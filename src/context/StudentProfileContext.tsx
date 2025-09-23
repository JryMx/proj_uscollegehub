import React, { createContext, useContext, useState, ReactNode } from 'react';

// API base URL - adjust for your backend deployment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api';

export interface StudentProfile {
  // Academic Inputs
  gpa: number;
  satEBRW: number;
  satMath: number;
  actScore: number;
  
  // Non-Academic Inputs
  personalStatement: string;
  extracurriculars: ExtracurricularActivity[];
  recommendationLetters: RecommendationLetter[];
  legacyStatus: boolean;
  citizenship: 'domestic' | 'international';
  
  // Additional fields for compatibility
  toeflScore: number;
  apCourses: number;
  ibScore: number;
  leadership: string[];
  volunteering: string[];
  awards: string[];
  intendedMajor: string;
  
  // Boolean Application Components Checker
  applicationComponents: ApplicationComponents;
  
  // Calculated fields
  profileRigorScore: number;
  recommendations: SchoolRecommendation[];
}

export interface ApplicationComponents {
  secondarySchoolGPA: boolean;
  classRank: boolean;
  academicRecord: boolean;
  collegePrepProgram: boolean;
  recommendationLetters: boolean;
  formalDemonstrationCompetencies: boolean;
  workExperience: boolean;
  personalStatementEssay: boolean;
  legacyStatus: boolean;
  admissionTestScores: boolean;
  englishProficiencyTest: boolean;
}

export interface ExtracurricularActivity {
  id: string;
  type: 'Sports' | 'Arts' | 'Community Service' | 'Research' | 'Academic Clubs' | 'Leadership' | 'Work Experience' | 'Other';
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  recognitionLevel: 'Local' | 'Regional' | 'National' | 'International';
  hoursPerWeek: number;
}

export interface RecommendationLetter {
  id: string;
  source: 'Teacher' | 'Counselor' | 'Principal' | 'Coach' | 'Employer' | 'Other';
  subject?: string;
  relationship: string;
}

export interface SchoolRecommendation {
  universityId: string;
  category: 'safety' | 'target' | 'reach';
  admissionChance: number;
  strengthenAreas: string[];
  requiredScore: number;
  comparisonRatio: number;
}

interface StudentProfileContextType {
  profile: StudentProfile | null;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  calculateProfileScore: (profile: Partial<StudentProfile>) => number;
  getRecommendations: () => SchoolRecommendation[];
  searchSchools: (query: string) => SchoolSearchResult[];
}

export interface SchoolSearchResult {
  id: string;
  name: string;
  requiredScore: number;
  comparisonRatio: number;
  category: 'safety' | 'target' | 'reach';
  ranking: number;
  acceptanceRate: number;
}

const StudentProfileContext = createContext<StudentProfileContextType | undefined>(undefined);

export const useStudentProfile = () => {
  const context = useContext(StudentProfileContext);
  if (context === undefined) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider');
  }
  return context;
};

interface StudentProfileProviderProps {
  children: ReactNode;
}

// Mock school data with required scores
const schoolsDatabase = [
  { id: '1', name: 'Harvard University', requiredScore: 95, ranking: 2, acceptanceRate: 5.4 },
  { id: '2', name: 'Stanford University', requiredScore: 94, ranking: 3, acceptanceRate: 4.8 },
  { id: '3', name: 'MIT', requiredScore: 93, ranking: 4, acceptanceRate: 7.3 },
  { id: '4', name: 'Yale University', requiredScore: 92, ranking: 5, acceptanceRate: 6.9 },
  { id: '5', name: 'Princeton University', requiredScore: 91, ranking: 1, acceptanceRate: 5.8 },
  { id: '6', name: 'UC Berkeley', requiredScore: 78, ranking: 22, acceptanceRate: 17.5 },
  { id: '7', name: 'NYU', requiredScore: 72, ranking: 28, acceptanceRate: 21.1 },
  { id: '8', name: 'Penn State', requiredScore: 65, ranking: 63, acceptanceRate: 76.0 },
  { id: '9', name: 'University of Michigan', requiredScore: 80, ranking: 21, acceptanceRate: 26.0 },
  { id: '10', name: 'UCLA', requiredScore: 82, ranking: 20, acceptanceRate: 14.3 },
];

export const StudentProfileProvider: React.FC<StudentProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const calculateProfileScore = async (profileData: Partial<StudentProfile>): Promise<number> => {
    try {
      const response = await fetch(`${API_BASE_URL}/calculate-profile-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate profile score');
      }
      
      const data = await response.json();
      return data.rigor_score;
    } catch (error) {
      console.error('Error calculating profile score:', error);
      // Fallback to local calculation if backend is unavailable
      return calculateLocalProfileScore(profileData);
    }
  };

  const calculateLocalProfileScore = (profileData: Partial<StudentProfile>): number => {
    // Fallback local calculation (simplified version)
    let score = 0;
    
    if (profileData.gpa) {
      score += (profileData.gpa / 4.0) * 25;
    }
    
    if (profileData.satEBRW && profileData.satMath) {
      const totalSAT = profileData.satEBRW + profileData.satMath;
      score += (totalSAT / 1600) * 20;
    } else if (profileData.actScore) {
      score += (profileData.actScore / 36) * 20;
    }
    
    if (profileData.apCourses) {
      score += Math.min(profileData.apCourses / 8, 1) * 15;
    }
    
    return Math.round(Math.min(score, 100));
  };

  const updateProfile = (newProfileData: Partial<StudentProfile>) => {
    const updatedProfile = profile ? { ...profile, ...newProfileData } : {
      gpa: 0,
      satEBRW: 0,
      satMath: 0,
      actScore: 0,
      personalStatement: '',
      extracurriculars: [],
      recommendationLetters: [],
      legacyStatus: false,
      citizenship: 'domestic' as const,
      toeflScore: 0,
      apCourses: 0,
      ibScore: 0,
      leadership: [],
      volunteering: [],
      awards: [],
      intendedMajor: '',
      applicationComponents: {
        secondarySchoolGPA: false,
        classRank: false,
        academicRecord: false,
        collegePrepProgram: false,
        recommendationLetters: false,
        formalDemonstrationCompetencies: false,
        workExperience: false,
        personalStatementEssay: false,
        legacyStatus: false,
        admissionTestScores: false,
        englishProficiencyTest: false,
      },
      profileRigorScore: 0,
      recommendations: [],
      ...newProfileData,
    };
    
    // Auto-update application components based on profile data
    updatedProfile.applicationComponents = {
      ...updatedProfile.applicationComponents,
      secondarySchoolGPA: updatedProfile.gpa > 0,
      recommendationLetters: updatedProfile.recommendationLetters.length > 0,
      personalStatementEssay: updatedProfile.personalStatement.length > 0,
      legacyStatus: updatedProfile.legacyStatus,
      admissionTestScores: (updatedProfile.satEBRW > 0 && updatedProfile.satMath > 0) || updatedProfile.actScore > 0,
      englishProficiencyTest: updatedProfile.citizenship === 'international' ? updatedProfile.toeflScore > 0 : true,
      ...newProfileData.applicationComponents,
    };
    
    // Calculate profile rigor score asynchronously
    calculateProfileScore(updatedProfile).then(score => {
      updatedProfile.profileRigorScore = score;
      setProfile({ ...updatedProfile });
    });
    
    // Generate recommendations
    updatedProfile.recommendations = generateRecommendations(updatedProfile);
    
    setProfile(updatedProfile);
  };

  const generateRecommendations = (profile: StudentProfile): SchoolRecommendation[] => {
    return schoolsDatabase.map(school => {
      const comparisonRatio = profile.profileRigorScore / school.requiredScore;
      let category: 'safety' | 'target' | 'reach';
      let admissionChance: number;
      const strengthenAreas: string[] = [];

      if (comparisonRatio >= 1.1) {
        category = 'safety';
        admissionChance = Math.min(85, 70 + (comparisonRatio - 1) * 50);
      } else if (comparisonRatio >= 0.9) {
        category = 'target';
        admissionChance = Math.min(65, 40 + (comparisonRatio - 0.9) * 125);
      } else {
        category = 'reach';
        admissionChance = Math.max(5, comparisonRatio * 30);
        
        // Suggest areas to strengthen
        if (profile.gpa < 3.7) strengthenAreas.push('GPA');
        if ((profile.satEBRW + profile.satMath) < 1400 && profile.actScore < 30) {
          strengthenAreas.push('Standardized Test Scores');
        }
        if (profile.extracurriculars.length < 3) {
          strengthenAreas.push('Extracurricular Activities');
        }
        if (!profile.personalStatement || profile.personalStatement.length < 300) {
          strengthenAreas.push('Personal Statement');
        }
      }

      return {
        universityId: school.id,
        category,
        admissionChance: Math.round(admissionChance),
        strengthenAreas,
        requiredScore: school.requiredScore,
        comparisonRatio: Math.round(comparisonRatio * 100) / 100,
      };
    });
  };

  const searchSchools = async (query: string): Promise<SchoolSearchResult[]> => {
    if (!profile || !query.trim()) return [];
    
    try {
      const response = await fetch(`${API_BASE_URL}/search-schools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          student_data: profile,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search schools');
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching schools:', error);
      // Fallback to local search if backend is unavailable
      return searchSchoolsLocal(query);
    }
  };

  const searchSchoolsLocal = (query: string): SchoolSearchResult[] => {
    // Fallback local search
    const filteredSchools = schoolsDatabase.filter(school =>
      school.name.toLowerCase().includes(query.toLowerCase())
    );

    return filteredSchools.map(school => {
      const comparisonRatio = profile!.profileRigorScore / school.requiredScore;
      let category: 'safety' | 'target' | 'reach';

      if (comparisonRatio >= 1.1) {
        category = 'safety';
      } else if (comparisonRatio >= 0.9) {
        category = 'target';
      } else {
        category = 'reach';
      }

      return {
        id: school.id,
        name: school.name,
        requiredScore: school.requiredScore,
        comparisonRatio: Math.round(comparisonRatio * 100) / 100,
        category,
        ranking: school.ranking,
        acceptanceRate: school.acceptanceRate,
      };
    });
  };

  const getRecommendations = (): SchoolRecommendation[] => {
    return profile?.recommendations || [];
  };

  const value = {
    profile,
    updateProfile,
    calculateProfileScore,
    getRecommendations,
    searchSchools,
  };

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  );
};