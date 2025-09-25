import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Calculator } from 'lucide-react';
import { useStudentProfile, SchoolRecommendation } from '../context/StudentProfileContext';

const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, calculateProfileScore } = useStudentProfile();

  const [showResults, setShowResults] = useState(false);
  const [currentCalculatedScore, setCurrentCalculatedScore] = useState<number>(0);
  const [currentRecommendations, setCurrentRecommendations] = useState<any[]>([]);

  // Academic form data
  const [academicData, setAcademicData] = useState({
    gpa: profile?.gpa?.toString() || '',
    satEBRW: profile?.satEBRW?.toString() || '',
    satMath: profile?.satMath?.toString() || '',
    actScore: profile?.actScore?.toString() || '',
    apCourses: profile?.apCourses?.toString() || '',
    ibScore: profile?.ibScore?.toString() || '',
    toeflScore: profile?.toeflScore?.toString() || '',
  });

  const handleAcademicChange = (field: string, value: string) => {
    setAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleNonAcademicChange = (field: string, value: string | boolean) => {
    setNonAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    const profileData = {
      gpa: parseFloat(academicData.gpa) || 0,
      satEBRW: parseInt(academicData.satEBRW) || 0,
      satMath: parseInt(academicData.satMath) || 0,
      actScore: parseInt(academicData.actScore) || 0,
      apCourses: parseInt(academicData.apCourses) || 0,
      ibScore: parseInt(academicData.ibScore) || 0,
      toeflScore: parseInt(academicData.toeflScore) || 0,
      personalStatement: '',
      legacyStatus: false,
      citizenship: 'domestic' as 'domestic' | 'international',
      extracurriculars: [],
      recommendationLetters: [],
      // Legacy fields for compatibility
      leadership: [],
      volunteering: [],
      awards: [],
      intendedMajor: '',
    };

    try {
      console.log('Mock: Sending profile data:', profileData);
      const updatedProfile = await updateProfile(profileData);
      console.log('Mock: Received updated profile:', updatedProfile);
      
      if (updatedProfile) {
        setCurrentCalculatedScore(updatedProfile.profileRigorScore);
        setCurrentRecommendations(updatedProfile.recommendations || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error in handleSaveProfile:', error);
      alert('Error calculating profile score: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete your academic and non-academic profile to get a comprehensive rigor score 
            and personalized university recommendations.
          </p>
        </div>

        {/* Profile Rigor Score Display */}
        {(currentCalculatedScore > 0 || (profile && profile.profileRigorScore > 0)) && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Profile Rigor Score</h2>
            <div className="text-5xl font-bold mb-2">{currentCalculatedScore || profile?.profileRigorScore || 0}/100</div>
            <p className="text-blue-100">
              {(currentCalculatedScore || profile?.profileRigorScore || 0) >= 90 ? 'Excellent' : 
               (currentCalculatedScore || profile?.profileRigorScore || 0) >= 80 ? 'Very Good' : 
               (currentCalculatedScore || profile?.profileRigorScore || 0) >= 70 ? 'Good' : 
               (currentCalculatedScore || profile?.profileRigorScore || 0) >= 60 ? 'Fair' : 'Needs Improvement'}
            </p>
          </div>
        )}

        {/* University Recommendations */}
        {(currentRecommendations.length > 0 || (profile && profile.recommendations && profile.recommendations.length > 0)) && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">University Recommendations</h2>
              <p className="text-gray-600 dark:text-gray-300">Based on your academic profile and competitiveness analysis</p>
            </div>
            
            {['reach', 'target', 'safety'].map((category) => {
              const categoryRecommendations = (currentRecommendations.length > 0 ? currentRecommendations : profile?.recommendations || [])
                .filter((rec: SchoolRecommendation) => rec.category === category);
              
              if (categoryRecommendations.length === 0) return null;
              
              const categoryTitle = category === 'safety' ? 'Likely Schools' : 
                                  category === 'target' ? 'Target Schools' : 'Reach Schools';
              const categoryColor = category === 'safety' ? 'green' : 
                                   category === 'target' ? 'blue' : 'orange';
              
              return (
                <div key={category} className="mb-6">
                  <h3 className={`text-xl font-bold mb-4 text-${categoryColor}-700`}>
                    {categoryTitle} ({categoryRecommendations.length})
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryRecommendations.map((recommendation: SchoolRecommendation, index: number) => (
                      <div 
                        key={`${recommendation.universityId}-${index}`}
                        className={`bg-white dark:bg-gray-800 border-l-4 border-${categoryColor}-500 rounded-lg shadow-sm p-4`}
                        data-testid={`recommendation-${category}-${index}`}
                      >
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{recommendation.universityId}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Profile Match:</span>
                            <span className={`font-medium text-${categoryColor}-600`}>
                              {Math.round(recommendation.admissionChance * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Academic Information Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Academic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GPA (4.0 scale) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={academicData.gpa}
                    onChange={(e) => handleAcademicChange('gpa', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="3.8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SAT - EBRW (out of 800)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={academicData.satEBRW}
                    onChange={(e) => handleAcademicChange('satEBRW', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="720"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SAT - Math (out of 800)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={academicData.satMath}
                    onChange={(e) => handleAcademicChange('satMath', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="730"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ACT Score (out of 36)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={academicData.actScore}
                    onChange={(e) => handleAcademicChange('actScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="32"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional if SAT scores provided</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    TOEFL Score (International Students)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={academicData.toeflScore}
                    onChange={(e) => handleAcademicChange('toeflScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="105"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of AP Courses
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={academicData.apCourses}
                    onChange={(e) => handleAcademicChange('apCourses', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IB Score (out of 45)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    value={academicData.ibScore}
                    onChange={(e) => handleAcademicChange('ibScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="38"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Profile Score
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;