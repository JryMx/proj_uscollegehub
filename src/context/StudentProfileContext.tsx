import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  updateProfile: (profile: Partial<StudentProfile>) => Promise<StudentProfile>;
  calculateProfileScore: (profile: Partial<StudentProfile>) => Promise<{score: number, recommendations: SchoolRecommendation[]}>;
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

// Mock database of 25 U.S. universities with varying difficulties
const universitiesDatabase = [
  // Ivy League & Top Tier (Very Hard)
  { id: '1', name: 'Harvard University', requiredScore: 95, ranking: 2, acceptanceRate: 5.4, location: 'Cambridge, MA' },
  { id: '2', name: 'Stanford University', requiredScore: 94, ranking: 3, acceptanceRate: 4.8, location: 'Stanford, CA' },
  { id: '3', name: 'MIT', requiredScore: 93, ranking: 4, acceptanceRate: 7.3, location: 'Cambridge, MA' },
  { id: '4', name: 'Yale University', requiredScore: 92, ranking: 5, acceptanceRate: 6.9, location: 'New Haven, CT' },
  { id: '5', name: 'Princeton University', requiredScore: 91, ranking: 1, acceptanceRate: 5.8, location: 'Princeton, NJ' },
  
  // Top Public & Private (Hard)
  { id: '6', name: 'UC Berkeley', requiredScore: 85, ranking: 22, acceptanceRate: 17.5, location: 'Berkeley, CA' },
  { id: '7', name: 'UCLA', requiredScore: 84, ranking: 20, acceptanceRate: 14.3, location: 'Los Angeles, CA' },
  { id: '8', name: 'University of Michigan', requiredScore: 82, ranking: 21, acceptanceRate: 26.0, location: 'Ann Arbor, MI' },
  { id: '9', name: 'Northwestern University', requiredScore: 88, ranking: 9, acceptanceRate: 9.3, location: 'Evanston, IL' },
  { id: '10', name: 'Duke University', requiredScore: 89, ranking: 10, acceptanceRate: 8.9, location: 'Durham, NC' },
  
  // Competitive (Medium-Hard)
  { id: '11', name: 'NYU', requiredScore: 78, ranking: 28, acceptanceRate: 21.1, location: 'New York, NY' },
  { id: '12', name: 'Boston University', requiredScore: 76, ranking: 41, acceptanceRate: 22.1, location: 'Boston, MA' },
  { id: '13', name: 'University of Southern California', requiredScore: 80, ranking: 25, acceptanceRate: 16.1, location: 'Los Angeles, CA' },
  { id: '14', name: 'Carnegie Mellon University', requiredScore: 86, ranking: 25, acceptanceRate: 17.3, location: 'Pittsburgh, PA' },
  { id: '15', name: 'University of Virginia', requiredScore: 79, ranking: 25, acceptanceRate: 26.4, location: 'Charlottesville, VA' },
  
  // Good Schools (Medium)
  { id: '16', name: 'Penn State', requiredScore: 70, ranking: 63, acceptanceRate: 76.0, location: 'University Park, PA' },
  { id: '17', name: 'University of Florida', requiredScore: 72, ranking: 28, acceptanceRate: 37.0, location: 'Gainesville, FL' },
  { id: '18', name: 'Ohio State University', requiredScore: 68, ranking: 49, acceptanceRate: 68.0, location: 'Columbus, OH' },
  { id: '19', name: 'University of Washington', requiredScore: 74, ranking: 59, acceptanceRate: 56.0, location: 'Seattle, WA' },
  { id: '20', name: 'University of Illinois', requiredScore: 73, ranking: 47, acceptanceRate: 63.0, location: 'Urbana-Champaign, IL' },
  
  // Accessible Schools (Easy-Medium)
  { id: '21', name: 'Arizona State University', requiredScore: 62, ranking: 117, acceptanceRate: 88.0, location: 'Tempe, AZ' },
  { id: '22', name: 'University of Arizona', requiredScore: 60, ranking: 124, acceptanceRate: 87.0, location: 'Tucson, AZ' },
  { id: '23', name: 'Florida State University', requiredScore: 65, ranking: 55, acceptanceRate: 37.0, location: 'Tallahassee, FL' },
  { id: '24', name: 'University of Colorado Boulder', requiredScore: 64, ranking: 99, acceptanceRate: 84.0, location: 'Boulder, CO' },
  { id: '25', name: 'San Diego State University', requiredScore: 58, ranking: 151, acceptanceRate: 38.0, location: 'San Diego, CA' },
];

export const StudentProfileProvider: React.FC<StudentProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Mock rigor score calculation based on academic factors
  const calculateRigorScore = (profileData: Partial<StudentProfile>): number => {
    let score = 0;
    
    // GPA component (40% of score)
    const gpa = profileData.gpa || 0;
    const gpaScore = Math.min((gpa / 4.0) * 40, 40);
    score += gpaScore;
    
    // SAT component (30% of score)
    const satTotal = (profileData.satEBRW || 0) + (profileData.satMath || 0);
    const satScore = Math.min((satTotal / 1600) * 30, 30);
    score += satScore;
    
    // ACT component (alternative to SAT, 30% of score)
    if (satTotal === 0 && profileData.actScore) {
      const actScore = Math.min((profileData.actScore / 36) * 30, 30);
      score += actScore;
    }
    
    // AP courses bonus (up to 15 points)
    const apBonus = Math.min((profileData.apCourses || 0) * 2, 15);
    score += apBonus;
    
    // IB score bonus (up to 10 points)
    if (profileData.ibScore && profileData.ibScore >= 35) {
      const ibBonus = Math.min(((profileData.ibScore - 35) / 10) * 10, 10);
      score += ibBonus;
    }
    
    // TOEFL penalty for international students with low scores
    if (profileData.citizenship === 'international' && profileData.toeflScore && profileData.toeflScore < 100) {
      score -= (100 - profileData.toeflScore) * 0.2;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateProfileScore = async (profileData: Partial<StudentProfile>): Promise<{score: number, recommendations: SchoolRecommendation[]}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Mock: Calculating profile score for:', profileData);
    
    const score = calculateRigorScore(profileData);
    const recommendations = generateRecommendations(score);
    
    console.log('Mock: Calculated score:', score);
    console.log('Mock: Generated recommendations:', recommendations);
    
    return { score, recommendations };
  };

  const generateRecommendations = (profileScore: number): SchoolRecommendation[] => {
    const recommendations: SchoolRecommendation[] = [];
    
    universitiesDatabase.forEach(school => {
      const comparisonRatio = profileScore / school.requiredScore;
      let category: 'safety' | 'target' | 'reach';
      let admissionChance: number;
      const strengthenAreas: string[] = [];

      if (comparisonRatio >= 1.15) {
        category = 'safety';
        admissionChance = Math.min(85, 70 + (comparisonRatio - 1) * 30);
      } else if (comparisonRatio >= 0.85) {
        category = 'target';
        admissionChance = Math.min(65, 35 + (comparisonRatio - 0.85) * 100);
      } else {
        category = 'reach';
        admissionChance = Math.max(5, comparisonRatio * 40);
        
        // Suggest areas to strengthen for reach schools
        if (profileScore < 70) strengthenAreas.push('Overall Academic Profile');
        if (profileScore < 80) strengthenAreas.push('Standardized Test Scores');
        if (profileScore < 85) strengthenAreas.push('Advanced Coursework (AP/IB)');
      }

      recommendations.push({
        universityId: school.name,
        category,
        admissionChance: Math.round(admissionChance) / 100,
        strengthenAreas,
        requiredScore: school.requiredScore,
        comparisonRatio: Math.round(comparisonRatio * 100) / 100,
      });
    });

    // Sort by category and then by admission chance
    const categoryOrder = { 'safety': 0, 'target': 1, 'reach': 2 };
    recommendations.sort((a, b) => {
      if (a.category !== b.category) {
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      return b.admissionChance - a.admissionChance;
    });

    // Limit to top recommendations per category
    const safetySchools = recommendations.filter(r => r.category === 'safety').slice(0, 8);
    const targetSchools = recommendations.filter(r => r.category === 'target').slice(0, 8);
    const reachSchools = recommendations.filter(r => r.category === 'reach').slice(0, 8);

    return [...safetySchools, ...targetSchools, ...reachSchools];
  };

  const updateProfile = async (newProfileData: Partial<StudentProfile>): Promise<StudentProfile> => {
    console.log('Mock: Updating profile with data:', newProfileData);
    
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
    
    try {
      // Calculate profile rigor score and get recommendations
      const result = await calculateProfileScore(updatedProfile);
      updatedProfile.profileRigorScore = result.score;
      updatedProfile.recommendations = result.recommendations;
      
      // Update profile with calculated score and recommendations
      setProfile(updatedProfile);
      console.log('Mock: Profile updated successfully:', updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Mock: Error updating profile:', error);
      throw error;
    }
  };

  const searchSchools = (query: string): SchoolSearchResult[] => {
    if (!profile || !query.trim()) return [];
    
    const filteredSchools = universitiesDatabase.filter(school =>
      school.name.toLowerCase().includes(query.toLowerCase()) ||
      school.location.toLowerCase().includes(query.toLowerCase())
    );

    return filteredSchools.map(school => {
      const comparisonRatio = profile.profileRigorScore / school.requiredScore;
      let category: 'safety' | 'target' | 'reach';

      if (comparisonRatio >= 1.15) {
        category = 'safety';
      } else if (comparisonRatio >= 0.85) {
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