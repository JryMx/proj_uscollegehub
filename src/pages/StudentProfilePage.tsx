import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Search, Calculator } from 'lucide-react';
import { useStudentProfile, SchoolRecommendation } from '../context/StudentProfileContext';

const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, calculateProfileScore, searchSchools } = useStudentProfile();

  const [searchQuery, setSearchQuery] = useState('');
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
    intendedMajor: profile?.intendedMajor || '',
  });

  const handleAcademicChange = (field: string, value: string) => {
    setAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleNonAcademicChange = (field: string, value: string | boolean) => {
    setNonAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    const profileData = {
      gpa: parseFloat(academicData.gpa) || 0,
      satEBRW: parseInt(academicData.satEBRW) || 0,
      satMath: parseInt(academicData.satMath) || 0,
      actScore: parseInt(academicData.actScore) || 0,
      apCourses: parseInt(academicData.apCourses) || 0,
      ibScore: parseInt(academicData.ibScore) || 0,
      toeflScore: parseInt(academicData.toeflScore) || 0,
      intendedMajor: academicData.intendedMajor,
      personalStatement: '',
      legacyStatus: false,
      citizenship: 'domestic' as 'domestic' | 'international',
      extracurriculars: [],
      recommendationLetters: [],
      // Legacy fields for compatibility
      leadership: [],
      volunteering: [],
      awards: [],
    };

    const updatedProfile = await updateProfile(profileData);
    if (updatedProfile) {
      setCurrentCalculatedScore(updatedProfile.profileRigorScore);
      setCurrentRecommendations(updatedProfile.recommendations || []);
    }
    setShowResults(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim() && profile) {
      searchSchools(searchQuery).then(() => {
        setShowResults(true);
      });
    }
  };

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearchAsync = async () => {
    if (searchQuery.trim() && profile) {
      setIsSearching(true);
      try {
      const results = await searchSchools(searchQuery);
      setSearchResults(results);
      setShowResults(true);
      } catch (error) {
        console.error('Error searching schools:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Profile Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">University Recommendations</h2>
              <p className="text-gray-600">Based on your academic profile and competitiveness analysis</p>
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
                        className={`bg-white border-l-4 border-${categoryColor}-500 rounded-lg shadow-sm p-4`}
                        data-testid={`recommendation-${category}-${index}`}
                      >
                        <h4 className="font-bold text-gray-900 mb-2">{recommendation.universityId}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Match Score:</span>
                            <span className={`font-medium text-${categoryColor}-600`}>
                              {Math.round(recommendation.admissionChance * 100)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Match Score:</span>
                            <span className="font-medium">
                              {Math.round(recommendation.comparisonRatio * 100)}/100
                            </span>
                          </div>
                          {recommendation.requiredScore && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Required Score:</span>
                              <span className="font-medium">{recommendation.requiredScore}/100</span>
                            </div>
                          )}
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
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA (4.0 scale) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={academicData.gpa}
                    onChange={(e) => handleAcademicChange('gpa', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3.8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intended Major
                  </label>
                  <select
                    value={academicData.intendedMajor}
                    onChange={(e) => handleAcademicChange('intendedMajor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a major</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Liberal Arts">Liberal Arts</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SAT - EBRW (out of 800)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={academicData.satEBRW}
                    onChange={(e) => handleAcademicChange('satEBRW', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="720"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SAT - Math (out of 800)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={academicData.satMath}
                    onChange={(e) => handleAcademicChange('satMath', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="730"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ACT Score (out of 36)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={academicData.actScore}
                    onChange={(e) => handleAcademicChange('actScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="32"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional if SAT scores provided</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TOEFL Score (International Students)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={academicData.toeflScore}
                    onChange={(e) => handleAcademicChange('toeflScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="105"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of AP Courses
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={academicData.apCourses}
                    onChange={(e) => handleAcademicChange('apCourses', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IB Score (out of 45)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    value={academicData.ibScore}
                    onChange={(e) => handleAcademicChange('ibScore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {/* School Comparison Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">School Comparison</h2>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search schools by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearchAsync}
              disabled={isSearching || !profile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Search Results</h3>
              {searchResults.map(school => (
                <div
                  key={school.id}
                  className={`border rounded-lg p-4 ${
                    school.category === 'safety' ? 'border-green-200 bg-green-50' :
                    school.category === 'target' ? 'border-orange-200 bg-orange-50' :
                    'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{school.name}</h4>
                      <p className="text-sm text-gray-600">#{school.ranking} • {school.acceptanceRate}% acceptance rate</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        school.category === 'safety' ? 'bg-green-100 text-green-800' :
                        school.category === 'target' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {school.category.charAt(0).toUpperCase() + school.category.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Required Score:</span>
                      <span className="ml-2 font-bold">{school.requiredScore}/100</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Your Score:</span>
                      <span className="ml-2 font-bold">{currentCalculatedScore}/100</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ratio:</span>
                      <span className="ml-2 font-bold">{school.comparisonRatio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showResults && searchResults.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No schools found matching "{searchQuery}"</p>
              <p className="text-sm">Try searching for a different school name.</p>
            </div>
          )}

          {!showResults && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Complete your profile and search for schools to see comparisons.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;