#!/usr/bin/env python3
"""
Flask API server that integrates the college matching prototype
with the React frontend application.
"""

import os
import json
from typing import Dict, Any, Optional, List
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import requests
from dotenv import load_dotenv

# Import the scoring functions from the prototype
from prototype import (
    rigor_bonus, pct_position, compute_fit, competitiveness, bucket,
    fetch_scorecard, load_ipeds_admissions, recommend, dataframe_to_json
)

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Cache for university data to avoid repeated API calls
university_cache = None
last_cache_update = None

def get_university_data():
    """Get university data, using cache if available"""
    global university_cache, last_cache_update
    
    # For now, return mock data. In production, you'd fetch from College Scorecard
    if university_cache is None:
        university_cache = pd.DataFrame([
            {
                'id': '1',
                'school.name': 'Harvard University',
                'school.city': 'Cambridge',
                'school.state': 'MA',
                'latest.admissions.admission_rate.overall': 0.054,
                'latest.admissions.sat_scores.midpoint.math': 770,
                'latest.admissions.sat_scores.midpoint.critical_reading': 750,
                'latest.admissions.act_scores.midpoint.cumulative': 34,
                'SATMT25': 740, 'SATMT75': 800, 'SATVR25': 720, 'SATVR75': 780,
                'ACTCM25': 33, 'ACTCM75': 35
            },
            {
                'id': '2',
                'school.name': 'Stanford University',
                'school.city': 'Stanford',
                'school.state': 'CA',
                'latest.admissions.admission_rate.overall': 0.048,
                'latest.admissions.sat_scores.midpoint.math': 760,
                'latest.admissions.sat_scores.midpoint.critical_reading': 740,
                'latest.admissions.act_scores.midpoint.cumulative': 34,
                'SATMT25': 730, 'SATMT75': 800, 'SATVR25': 710, 'SATVR75': 770,
                'ACTCM25': 32, 'ACTCM75': 35
            },
            {
                'id': '3',
                'school.name': 'MIT',
                'school.city': 'Cambridge',
                'school.state': 'MA',
                'latest.admissions.admission_rate.overall': 0.073,
                'latest.admissions.sat_scores.midpoint.math': 780,
                'latest.admissions.sat_scores.midpoint.critical_reading': 730,
                'latest.admissions.act_scores.midpoint.cumulative': 34,
                'SATMT25': 750, 'SATMT75': 800, 'SATVR25': 700, 'SATVR75': 760,
                'ACTCM25': 33, 'ACTCM75': 35
            },
            {
                'id': '4',
                'school.name': 'UC Berkeley',
                'school.city': 'Berkeley',
                'school.state': 'CA',
                'latest.admissions.admission_rate.overall': 0.175,
                'latest.admissions.sat_scores.midpoint.math': 730,
                'latest.admissions.sat_scores.midpoint.critical_reading': 665,
                'latest.admissions.act_scores.midpoint.cumulative': 32,
                'SATMT25': 680, 'SATMT75': 780, 'SATVR25': 630, 'SATVR75': 700,
                'ACTCM25': 30, 'ACTCM75': 35
            },
            {
                'id': '5',
                'school.name': 'NYU',
                'school.city': 'New York',
                'school.state': 'NY',
                'latest.admissions.admission_rate.overall': 0.211,
                'latest.admissions.sat_scores.midpoint.math': 720,
                'latest.admissions.sat_scores.midpoint.critical_reading': 675,
                'latest.admissions.act_scores.midpoint.cumulative': 32,
                'SATMT25': 670, 'SATMT75': 770, 'SATVR25': 650, 'SATVR75': 700,
                'ACTCM25': 30, 'ACTCM75': 34
            },
            {
                'id': '6',
                'school.name': 'Penn State',
                'school.city': 'University Park',
                'school.state': 'PA',
                'latest.admissions.admission_rate.overall': 0.76,
                'latest.admissions.sat_scores.midpoint.math': 650,
                'latest.admissions.sat_scores.midpoint.critical_reading': 610,
                'latest.admissions.act_scores.midpoint.cumulative': 28,
                'SATMT25': 600, 'SATMT75': 700, 'SATVR25': 580, 'SATVR75': 640,
                'ACTCM25': 25, 'ACTCM75': 30
            }
        ])
    
    return university_cache


@app.route('/api/calculate-profile-score', methods=['POST'])
def calculate_profile_score():
    """Calculate the student's profile rigor score using prototype.py logic only"""
    try:
        student_data = request.json
        
        # Use only the prototype.py rigor_bonus function
        rigor_score = rigor_bonus(
            student_data.get('gpa', 0),
            student_data.get('apCourses', 0),
            student_data.get('ibScore', 0)
        ) * 100  # Convert to 0-100 scale
        
        return jsonify({
            'rigor_score': round(rigor_score, 1)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-recommendations', methods=['POST'])
def get_recommendations():
    """Get school recommendations based on student profile"""
    try:
        student_data = request.json
        
        # Get university data
        df = get_university_data()
        
        # Convert student data to format expected by backend functions
        student = {
            "gpa": student_data.get('gpa', 0),
            "sat_total": (student_data.get('satEBRW', 0) or 0) + (student_data.get('satMath', 0) or 0),
            "act": student_data.get('actScore', 0),
            "toefl": student_data.get('toeflScore', 0),
            "ap": student_data.get('apCourses', 0),
            "ib": student_data.get('ibScore', 0),
            "major": student_data.get('intendedMajor', ''),
        }
        
        # Get recommendations using the backend algorithm
        recommendations = recommend(df, student, max_per_bucket=10)
        
        # Convert to JSON format
        recs_json = dataframe_to_json(recommendations)
        
        # Calculate summary
        summary = {
            'total_recommendations': len(recs_json),
            'reach_schools': len([r for r in recs_json if r.get('bucket') == 'Reach']),
            'target_schools': len([r for r in recs_json if r.get('bucket') == 'Target']),
            'likely_schools': len([r for r in recs_json if r.get('bucket') == 'Likely']),
            'unknown_schools': len([r for r in recs_json if r.get('bucket') == 'Unknown'])
        }
        
        return jsonify({
            'recommendations': recs_json,
            'summary': summary,
            'student_profile': student
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search-schools', methods=['POST'])
def search_schools():
    """Search for schools and get competitiveness scores"""
    try:
        data = request.json
        query = data.get('query', '').lower()
        student_data = data.get('student_data', {})
        
        # Get university data
        df = get_university_data()
        
        # Filter schools by query
        filtered_df = df[df['school.name'].str.lower().str.contains(query, na=False)]
        
        if filtered_df.empty:
            return jsonify({'results': []})
        
        # Convert student data to format expected by backend functions
        student = {
            "gpa": student_data.get('gpa', 0),
            "sat_total": (student_data.get('satEBRW', 0) or 0) + (student_data.get('satMath', 0) or 0),
            "act": student_data.get('actScore', 0),
            "toefl": student_data.get('toeflScore', 0),
            "ap": student_data.get('apCourses', 0),
            "ib": student_data.get('ibScore', 0),
        }
        
        # Calculate competitiveness for each school
        results = []
        for _, row in filtered_df.iterrows():
            comp_score = competitiveness(student, row)
            bucket_category = bucket(comp_score)
            
            # Calculate required score (inverse of competitiveness)
            required_score = 85 if comp_score and comp_score > 0 else 90
            if comp_score:
                if comp_score >= 0.75:
                    required_score = 95
                elif comp_score >= 0.45:
                    required_score = 80
                else:
                    required_score = 65
            
            # Calculate user's current score
            user_score = rigor_bonus(
                student_data.get('gpa', 0),
                student_data.get('apCourses', 0),
                student_data.get('ibScore', 0)
            ) * 100  # Convert to 0-100 scale
            
            # Calculate comparison ratio
            comparison_ratio = round(user_score / required_score, 2) if required_score > 0 else 0
            
            results.append({
                'id': row['id'],
                'name': row['school.name'],
                'city': row['school.city'],
                'state': row['school.state'],
                'acceptanceRate': round(row['latest.admissions.admission_rate.overall'] * 100, 1),
                'ranking': int(row['id']) * 10,  # Mock ranking
                'requiredScore': required_score,
                'comparisonRatio': comparison_ratio,
                'category': bucket_category.lower(),
                'competitivenessScore': round(comp_score * 100, 1) if comp_score else 0
            })
        
        # Sort by competitiveness score
        results.sort(key=lambda x: x['competitivenessScore'], reverse=True)
        
        return jsonify({'results': results[:10]})  # Return top 10 results
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Backend API is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='localhost', port=port, debug=True)