#!/usr/bin/env python3
"""
college_match_prototype.py

End-to-end prototype that:
1) Fetches College Scorecard data (schools endpoint)
2) Loads IPEDS Admissions CSV (optional)
3) Merges on UNITID/id
4) Computes a "competitiveness" score using student inputs (GPA, SAT/ACT, AP/IB)
5) Buckets schools into Reach/Target/Likely and writes a JSON of recommendations

Interactive mode:
    Run `python college_match_prototype.py` with no flags to be prompted for inputs.
Command-line mode:
    Pass flags to skip prompts (see --help).

Requires:
    pip install pandas numpy requests python-dotenv
"""

import argparse
import json
import math
import os
import sys
from typing import Dict, Any, Optional, List

import numpy as np
import pandas as pd
import requests
from dotenv import load_dotenv

SCORECARD_BASE = "https://api.data.gov/ed/collegescorecard/v1/schools"

# ---------------------------
# Ingest: College Scorecard
# ---------------------------

SCORECARD_FIELDS = [
    "id", "school.name", "school.city", "school.state", "school.zip",
    "school.school_url", "school.ownership", "school.region_id",
    "latest.admissions.admission_rate.overall",
    "latest.admissions.sat_scores.midpoint.math",
    "latest.admissions.sat_scores.midpoint.critical_reading",
    "latest.admissions.act_scores.midpoint.cumulative",
    "latest.student.size",
    "latest.cost.tuition.in_state", "latest.cost.tuition.out_of_state",
    "school.degrees_awarded.predominant",
]

def fetch_scorecard(api_key: str, per_page: int = 100, max_pages: Optional[int] = None,
                    state: Optional[str] = None, ownership: Optional[str] = None,
                    degree_predominant_in: str = "2,3",
                    extra_filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
    """Fetch rows from the Scorecard schools endpoint and return a DataFrame."""
    params = {
        "api_key": api_key,
        "fields": ",".join(SCORECARD_FIELDS),
        "per_page": per_page,
        "page": 0,
        "school.degrees_awarded.predominant__in": degree_predominant_in,
    }
    if state:
        params["school.state"] = state
    if ownership:
        params["school.ownership"] = ownership
    if extra_filters:
        params.update(extra_filters)

    rows: List[Dict[str, Any]] = []
    page = 0
    while True:
        page += 1
        params["page"] = page
        r = requests.get(SCORECARD_BASE, params=params, timeout=45)
        r.raise_for_status()
        data = r.json()
        rows.extend(data.get("results", []))
        total = data.get("metadata", {}).get("total", 0)
        if max_pages and page >= max_pages:
            break
        if page >= math.ceil(total / per_page):
            break

    df = pd.DataFrame(rows)
    return df

# ---------------------------
# Ingest: IPEDS CSV (Admissions)
# ---------------------------

IPED_ADM_COLS = [
    "UNITID", "ADM_RATE",
    "SATVR25","SATVR75","SATMT25","SATMT75",
    "ACTCM25","ACTCM75"
]

def load_ipeds_admissions(csv_path: Optional[str]) -> Optional[pd.DataFrame]:
    if not csv_path:
        return None
    adm = pd.read_csv(csv_path, low_memory=False)
    keep = [c for c in IPED_ADM_COLS if c in adm.columns]
    if "UNITID" not in keep:
        print("Warning: IPEDS CSV missing UNITID; skipping IPEDS merge.", file=sys.stderr)
        return None
    adm = adm[keep].drop_duplicates("UNITID")
    return adm

# ---------------------------
# Scoring
# ---------------------------

def rigor_bonus(gpa: float, ap: int, ib: int, sat_ebrw: Optional[int] = None, sat_math: Optional[int] = None) -> float:
    # Comprehensive rigor score (0..1) including GPA, SAT, AP, and IB
    # Core academic components (normalized to 0-1)
    gpa_norm = np.clip((gpa or 0) / 4.0, 0, 1)
    
    # SAT component (combined EBRW + Math, normalized to 0-1)
    sat_total = (sat_ebrw or 0) + (sat_math or 0)
    sat_norm = np.clip(sat_total / 1600.0, 0, 1)
    # Bonus components
    ap_bump = min(max(ap or 0, 0) * 0.02, 0.10)  # AP bump capped at +0.10
    if ib is not None and ib >= 38:
        ib_bump = 0.05
    else:
        ib_bump = 0.0
    
    # Calculate the comprehensive score - give GPA even more weight
    score = (0.75 * gpa_norm) + (0.15 * sat_norm) + ap_bump + ib_bump
    return float(np.clip(score, 0, 1))

def pct_position(x: float, lo: float, hi: float) -> Optional[float]:
    if any(pd.isna(v) for v in [x, lo, hi]) or hi <= lo:
        return None
    return float(np.clip((x - lo) / (hi - lo), 0, 1))

def compute_fit(student: Dict[str, Any], row: pd.Series) -> Optional[float]:
    # Combine SAT scores if provided separately
    sat_ebrw = student.get("satEBRW", 0) or 0
    sat_math = student.get("satMath", 0) or 0
    sat_total = (sat_ebrw + sat_math) if (sat_ebrw > 0 or sat_math > 0) else student.get("sat_total")
    act = student.get("act")

    SATMT25, SATMT75 = row.get("SATMT25"), row.get("SATMT75")
    SATVR25, SATVR75 = row.get("SATVR25"), row.get("SATVR75")
    ACT25, ACT75 = row.get("ACTCM25"), row.get("ACTCM75")

    # Prefer IPEDS 25/75 SAT band
    if (pd.notna(SATMT25) and pd.notna(SATMT75) and pd.notna(SATVR25) and 
        pd.notna(SATVR75) and sat_total is not None and sat_total > 0):
        lo = SATMT25 + SATVR25
        hi = SATMT75 + SATVR75
        return pct_position(sat_total, lo, hi)

    # Fall back to Scorecard SAT midpoints (approx band ±100)
    sc_sat_m = row.get("latest.admissions.sat_scores.midpoint.math")
    sc_sat_r = row.get("latest.admissions.sat_scores.midpoint.critical_reading")
    if pd.notna(sc_sat_m) and pd.notna(sc_sat_r) and sat_total is not None and sat_total > 0:
        mid_total = sc_sat_m + sc_sat_r  # already total scores, don't multiply by 10
        lo = mid_total - 100
        hi = mid_total + 100
        return pct_position(sat_total, lo, hi)

    # ACT fallback (IPEDS 25/75)
    if pd.notna(ACT25) and pd.notna(ACT75) and act is not None and act > 0:
        return pct_position(act, ACT25, ACT75)

    # Scorecard ACT midpoint fallback (±2)
    sc_act_mid = row.get("latest.admissions.act_scores.midpoint.cumulative")
    if pd.notna(sc_act_mid) and act is not None and act > 0:
        lo = sc_act_mid - 2
        hi = sc_act_mid + 2
        return pct_position(act, lo, hi)

    return None

def competitiveness(student: Dict[str, Any], row: pd.Series,
                    w_fit=0.25, w_sel=0.25, w_rigor=0.5) -> Optional[float]:
    fit = compute_fit(student, row)
    adm_rate = row.get("latest.admissions.admission_rate.overall")
    if pd.isna(adm_rate) and "ADM_RATE" in row:
        adm_rate = row.get("ADM_RATE")
    sel = None if pd.isna(adm_rate) else float(np.clip(adm_rate, 0, 1))  # Higher admission rate = easier = higher score
    rigor = rigor_bonus(
        student.get("gpa", 0) or 0, 
        int(student.get("apCourses", 0) or 0), 
        int(student.get("ibScore", 0) or 0),
        student.get("satEBRW", 0),
        student.get("satMath", 0)
    )

    pieces, weights = [], []
    if fit is not None:
        pieces.append(fit); weights.append(w_fit)
    if sel is not None:
        pieces.append(sel); weights.append(w_sel)
    # rigor always present
    pieces.append(rigor); weights.append(w_rigor)

    if not pieces:
        return None

    score = float(np.average(pieces, weights=weights))
    
    # Apply extremely harsh GPA penalty - elite schools absolutely require strong GPAs
    gpa = student.get("gpa", 0) or 0
    if gpa < 3.0:
        # Exponential penalty: 2.0 GPA gets ~0.8 penalty, 2.5 gets ~0.5 penalty  
        gpa_penalty = (3.0 - gpa) ** 2 * 0.2
        score = score - gpa_penalty  # Remove floor now that selectivity is fixed
    return float(np.clip(score, 0, 1))

def bucket(score: Optional[float]) -> str:
    if score is None or pd.isna(score):
        return "Unknown"
    if score >= 0.75:
        return "Likely"
    if score >= 0.45:
        return "Target"
    return "Reach"

# ---------------------------
# Recommendation pipeline
# ---------------------------

def recommend(df: pd.DataFrame, student: Dict[str, Any],
              toefl_min: Optional[int] = None,
              max_per_bucket: int = 15) -> pd.DataFrame:
    work = df.copy()

    # Compute score & bucket
    work["score"] = work.apply(lambda r: competitiveness(student, r), axis=1)
    work["bucket"] = work["score"].apply(bucket)

    work = work.sort_values(["bucket", "score"], ascending=[True, False])

    cols = [
        "school.name","school.city","school.state","latest.student.size",
        "latest.admissions.admission_rate.overall",
        "ADM_RATE",
        "SATVR25","SATVR75","SATMT25","SATMT75","ACTCM25","ACTCM75",
        "latest.admissions.sat_scores.midpoint.math",
        "latest.admissions.sat_scores.midpoint.critical_reading",
        "latest.admissions.act_scores.midpoint.cumulative",
        "latest.cost.tuition.in_state","latest.cost.tuition.out_of_state",
        "school.school_url",
        "score","bucket","id"
    ]
    keep = [c for c in cols if c in work.columns]
    top = work.groupby("bucket", group_keys=False).head(max_per_bucket)[keep]
    return top

# ---------------------------
# Interactive helpers
# ---------------------------

def _prompt_str(label: str, default: str = "", required: bool = False) -> str:
    while True:
        val = input(f"{label}" + (f" [{default}]" if default else "") + ": ").strip()
        if not val and default:
            return default
        if val or not required:
            return val
        print("This field is required.")

def _prompt_float(label: str, default: Optional[float] = None, required: bool = False, lo=None, hi=None):
    while True:
        raw = input(f"{label}" + (f" [{default}]" if default is not None else "") + ": ").strip()
        if not raw and default is not None:
            return float(default)
        if not raw and not required:
            return None
        try:
            v = float(raw)
            if lo is not None and v < lo:
                print(f"Enter a value >= {lo}"); continue
            if hi is not None and v > hi:
                print(f"Enter a value <= {hi}"); continue
            return v
        except ValueError:
            print("Please enter a number.")

def _prompt_int(label: str, default: Optional[int] = None, required: bool = False, lo=None, hi=None):
    f = _prompt_float(label, default, required, lo, hi)
    return None if f is None else int(f)

def dataframe_to_json(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Convert DataFrame to JSON-serializable list of dictionaries."""
    # Replace NaN values with None for JSON serialization
    df_clean = df.replace({np.nan: None})
    
    # Convert to list of dictionaries
    records = df_clean.to_dict('records')
    
    # Convert numpy types to native Python types for JSON serialization
    json_records = []
    for record in records:
        json_record = {}
        for key, value in record.items():
            if isinstance(value, (np.integer, np.floating)):
                json_record[key] = value.item()
            elif isinstance(value, np.ndarray):
                json_record[key] = value.tolist()
            else:
                json_record[key] = value
        json_records.append(json_record)
    
    return json_records

# ---------------------------
# Main
# ---------------------------

def main():
    load_dotenv()

    p = argparse.ArgumentParser()
    p.add_argument("--api_key", help="College Scorecard API key (or set API_KEY in .env)")
    p.add_argument("--state", help="Filter by state code, e.g., CA, NY")
    p.add_argument("--ownership", help="1=Public, 2=Private nonprofit, 3=Private for-profit")
    p.add_argument("--major", help="Intended major (not used in filter in this minimal prototype)")
    p.add_argument("--ipeds_csv", help="Path to IPEDS Admissions CSV (optional but recommended)")
    p.add_argument("--max_pages", type=int, default=None, help="Limit Scorecard pages to fetch (100 per page)")
    # Student inputs
    p.add_argument("--gpa", type=float)
    p.add_argument("--sat_ebrw", type=int)
    p.add_argument("--sat_math", type=int)
    p.add_argument("--act", type=int)
    p.add_argument("--toefl", type=int)
    p.add_argument("--ap", type=int)
    p.add_argument("--ib", type=int)
    p.add_argument("--out_json", help="Output JSON filename (default: recommendations.json)")
    args = p.parse_args()

    # Decide interactive vs CLI
    interactive_needed = any(v is None for v in [args.gpa, args.sat_ebrw, args.sat_math, args.act, args.toefl, args.ap, args.ib, args.out_json])
    if interactive_needed:
        print("Interactive mode (press Enter to accept defaults).")
        api_key = args.api_key or os.getenv("API_KEY")
        if not api_key:
            api_key = _prompt_str("API key (or set API_KEY in .env)", required=True)

        state = args.state if args.state is not None else _prompt_str("State filter (e.g., CA) [optional]", default="")
        ownership = args.ownership if args.ownership is not None else _prompt_str("Ownership (1=Public, 2=Private nonprofit, 3=For-profit) [optional]", default="")
        major = args.major if args.major is not None else _prompt_str("Intended major [optional]", default="")
        ipeds_csv = args.ipeds_csv if args.ipeds_csv is not None else _prompt_str("Path to IPEDS Admissions CSV (e.g., ADM_2023.csv) [optional]", default="")
        max_pages = args.max_pages if args.max_pages is not None else _prompt_int("Max pages from Scorecard (100 per page)", default=5, required=True, lo=1, hi=200)

        gpa = args.gpa if args.gpa is not None else _prompt_float("GPA (0.0-4.0)", default=3.7, required=True, lo=0.0, hi=4.0)
        sat_ebrw = args.sat_ebrw if args.sat_ebrw is not None else _prompt_int("SAT EBRW (0-800)", default=650, required=True, lo=0, hi=800)
        sat_math = args.sat_math if args.sat_math is not None else _prompt_int("SAT Math (0-800)", default=670, required=True, lo=0, hi=800)
        act = args.act if args.act is not None else _prompt_int("ACT Composite (0-36)", default=0, required=False, lo=0, hi=36)
        toefl = args.toefl if args.toefl is not None else _prompt_int("TOEFL iBT (0-120)", default=0, required=False, lo=0, hi=120)
        ap = args.ap if args.ap is not None else _prompt_int("Number of AP courses", default=2, required=False, lo=0, hi=20)
        ib = args.ib if args.ib is not None else _prompt_int("IB Score (0-45)", default=0, required=False, lo=0, hi=45)
        out_json = args.out_json if args.out_json is not None else (_prompt_str("Output JSON filename", default="recommendations.json", required=True))

    else:
        api_key = args.api_key or os.getenv("API_KEY")
        if not api_key:
            print("Error: API key not provided. Use --api_key or set API_KEY in your .env", file=sys.stderr)
            sys.exit(1)
        state, ownership, major = args.state, args.ownership, args.major
        ipeds_csv = args.ipeds_csv or ""
        max_pages = args.max_pages or 5
        gpa, sat_ebrw, sat_math = args.gpa, args.sat_ebrw, args.sat_math
        act, toefl, ap, ib = args.act or 0, args.toefl or 0, args.ap or 0, args.ib or 0
        out_json = args.out_json or "recommendations.json"

    # 1) Fetch Scorecard
    sc = fetch_scorecard(
        api_key=api_key,
        max_pages=max_pages,
        state=state or None,
        ownership=ownership or None,
    )
    if sc.empty:
        print("No results from College Scorecard. Check filters or API key.", file=sys.stderr)
        sys.exit(1)

    # 2) Load IPEDS admissions (optional)
    ipeds = load_ipeds_admissions(ipeds_csv if ipeds_csv else None)

    # 3) Merge on UNITID
    sc_renamed = sc.rename(columns={"id": "UNITID"})
    merged = sc_renamed.merge(ipeds, on="UNITID", how="left") if ipeds is not None else sc_renamed.copy()

    # 4) Build student profile
    student = {
        "gpa": gpa,
        "sat_total": int(sat_ebrw or 0) + int(sat_math or 0),
        "act": act,
        "toefl": toefl,
        "ap": ap,
        "ib": ib,
        "major": major,
    }

    # 5) Score & recommend
    recs = recommend(merged, student, toefl_min=None, max_per_bucket=15)

    # 6) Output
    recs = recs.rename(columns={"id": "UNITID"})
    
    # Convert DataFrame to JSON format
    json_data = {
        "student_profile": {
            "gpa": gpa,
            "sat_ebrw": sat_ebrw,
            "sat_math": sat_math,
            "sat_total": int(sat_ebrw or 0) + int(sat_math or 0),
            "act": act,
            "toefl": toefl,
            "ap_courses": ap,
            "ib_score": ib,
            "major": major
        },
        "recommendations": dataframe_to_json(recs),
        "summary": {
            "total_recommendations": len(recs),
            "reach_schools": len(recs[recs["bucket"] == "Reach"]),
            "target_schools": len(recs[recs["bucket"] == "Target"]),
            "likely_schools": len(recs[recs["bucket"] == "Likely"]),
            "unknown_schools": len(recs[recs["bucket"] == "Unknown"])
        }
    }
    
    # Write JSON file
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nWrote {len(recs)} recommendations to {out_json}\n")
    
    # Show preview safely
    try:
        print("Recommendations Preview:")
        print("=" * 50)
        for i, rec in enumerate(json_data["recommendations"][:12]):
            print(f"{i+1:2d}. {rec.get('school.name', 'N/A')} ({rec.get('school.city', 'N/A')}, {rec.get('school.state', 'N/A')})")
            print(f"     Score: {rec.get('score', 'N/A'):.3f} | Bucket: {rec.get('bucket', 'N/A')}")
            print(f"     Admission Rate: {rec.get('latest.admissions.admission_rate.overall', 'N/A')}")
            print()
    except Exception as e:
        print(f"Preview not available: {e}")

if __name__ == "__main__":
    main()
