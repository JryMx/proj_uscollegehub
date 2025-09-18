import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StudentProfile {
  gpa: number;
  satScore: number;
  actScore: number;
  toeflScore: number;
  apCourses: number;
  ibScore: number;
  extracurriculars: string[];
  leadership: string[];
  volunteering: string[];
  awards: string[];
  intendedMajor: string;
  recommendations: SchoolRecommendation[];
}

export interface SchoolRecommendation {
  universityId: string;
  category: 'safety' | 'target' | 'reach';
  admissionChance: number;
  strengthenAreas: string[];
}

interface StudentProfileContextType {
  profile: StudentProfile | null;
  updateProfile: (profile: StudentProfile) => void;
  getRecommendations: () => SchoolRecommendation[];
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

export const StudentProfileProvider: React.FC<StudentProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    
    // Generate recommendations based on profile
    const recommendations = generateRecommendations(newProfile);
    setProfile({ ...newProfile, recommendations });
  };

  const generateRecommendations = (profile: StudentProfile): SchoolRecommendation[] => {
    // Simple AI logic for school recommendations
    const recommendations: SchoolRecommendation[] = [];
    
    // Mock universities and their requirements
    const universities = [
      { id: '1', name: 'Harvard University', avgSAT: 1540, avgGPA: 4.2, selectivity: 'reach' },
      { id: '2', name: 'Stanford University', avgSAT: 1530, avgGPA: 4.2, selectivity: 'reach' },
      { id: '3', name: 'MIT', avgSAT: 1550, avgGPA: 4.1, selectivity: 'reach' },
      { id: '4', name: 'UC Berkeley', avgSAT: 1450, avgGPA: 4.0, selectivity: 'target' },
      { id: '5', name: 'NYU', avgSAT: 1400, avgGPA: 3.8, selectivity: 'target' },
      { id: '6', name: 'Penn State', avgSAT: 1300, avgGPA: 3.6, selectivity: 'safety' },
    ];

    universities.forEach(uni => {
      let category: 'safety' | 'target' | 'reach';
      let admissionChance: number;
      const strengthenAreas: string[] = [];

      const satDiff = profile.satScore - uni.avgSAT;
      const gpaDiff = profile.gpa - uni.avgGPA;

      if (satDiff >= 50 && gpaDiff >= 0.2) {
        category = 'safety';
        admissionChance = Math.min(90, 75 + satDiff / 10);
      } else if (satDiff >= -50 && gpaDiff >= -0.2) {
        category = 'target';
        admissionChance = Math.min(70, 45 + satDiff / 20);
      } else {
        category = 'reach';
        admissionChance = Math.max(5, 25 + satDiff / 30);
        
        if (profile.satScore < uni.avgSAT) {
          strengthenAreas.push('SAT Score');
        }
        if (profile.gpa < uni.avgGPA) {
          strengthenAreas.push('GPA');
        }
        if (profile.extracurriculars.length < 3) {
          strengthenAreas.push('Extracurricular Activities');
        }
        if (profile.leadership.length < 1) {
          strengthenAreas.push('Leadership Experience');
        }
      }

      recommendations.push({
        universityId: uni.id,
        category,
        admissionChance,
        strengthenAreas,
      });
    });

    return recommendations;
  };

  const getRecommendations = (): SchoolRecommendation[] => {
    return profile?.recommendations || [];
  };

  const value = {
    profile,
    updateProfile,
    getRecommendations,
  };

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  );
};