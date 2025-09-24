import React from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, AlertCircle, BookOpen, Users, Award, ArrowRight, BarChart3 } from 'lucide-react';
import { useStudentProfile } from '../context/StudentProfileContext';
import { useAuth } from '../context/AuthContext';

// Mock university data for recommendations
const universityData = {
  '1': { name: 'Harvard University', ranking: 2, acceptanceRate: 5.4, image: 'https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=400' },
  '2': { name: 'Stanford University', ranking: 3, acceptanceRate: 4.8, image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400' },
  '3': { name: 'MIT', ranking: 4, acceptanceRate: 7.3, image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400' },
  '4': { name: 'UC Berkeley', ranking: 22, acceptanceRate: 17.5, image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400' },
  '5': { name: 'NYU', ranking: 28, acceptanceRate: 21.1, image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400' },
  '6': { name: 'Penn State', ranking: 63, acceptanceRate: 76.0, image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400' },
};

const DashboardPage: React.FC = () => {
  const { profile, getRecommendations } = useStudentProfile();
  const { user } = useAuth();

  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile Analysis</h2>
            <p className="text-gray-600 mb-6">
              To see your personalized university recommendations, please complete your student profile first.
            </p>
            <Link
              to="/student-profile"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              Start Profile Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendations();
  const safetySchools = recommendations.filter(r => r.category === 'safety');
  const targetSchools = recommendations.filter(r => r.category === 'target');
  const reachSchools = recommendations.filter(r => r.category === 'reach');

  const profileStrength = () => {
    const factors = [
      profile.gpa >= 3.7,
      profile.satScore >= 1400 || profile.actScore >= 30,
      profile.extracurriculars.length >= 3,
      profile.leadership.length >= 1,
      profile.awards.length >= 1,
      profile.apCourses >= 3,
    ];
    return Math.round((factors.filter(Boolean).length / factors.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Here's your personalized university admission analysis and recommendations.
          </p>
        </div>

        {/* Profile Strength Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Strength</p>
                <p className="text-2xl font-bold text-blue-600">{profileStrength()}%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">GPA</p>
                <p className="text-2xl font-bold text-green-600">{profile.gpa}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SAT Score</p>
                <p className="text-2xl font-bold text-orange-600">{profile.satScore || 'N/A'}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activities</p>
                <p className="text-2xl font-bold text-purple-600">{profile.extracurriculars.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* School Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">School Recommendations</h2>

              {/* Safety Schools */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Safety Schools</h3>
                  <span className="ml-2 text-sm text-green-600 font-medium">High Chance</span>
                </div>
                <div className="grid gap-4">
                  {safetySchools.map(rec => {
                    const uni = universityData[rec.universityId as keyof typeof universityData];
                    return (
                      <div key={rec.universityId} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img src={uni.image} alt={uni.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <h4 className="font-medium text-gray-900">{uni.name}</h4>
                              <p className="text-sm text-gray-600">#{uni.ranking} • {uni.acceptanceRate}% acceptance</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{rec.admissionChance}%</p>
                            <p className="text-xs text-gray-600">match score</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Schools */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Target Schools</h3>
                  <span className="ml-2 text-sm text-orange-600 font-medium">Good Match</span>
                </div>
                <div className="grid gap-4">
                  {targetSchools.map(rec => {
                    const uni = universityData[rec.universityId as keyof typeof universityData];
                    return (
                      <div key={rec.universityId} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img src={uni.image} alt={uni.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <h4 className="font-medium text-gray-900">{uni.name}</h4>
                              <p className="text-sm text-gray-600">#{uni.ranking} • {uni.acceptanceRate}% acceptance</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-600">{rec.admissionChance}%</p>
                            <p className="text-xs text-gray-600">match score</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reach Schools */}
              <div>
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Reach Schools</h3>
                  <span className="ml-2 text-sm text-blue-600 font-medium">Stretch Goals</span>
                </div>
                <div className="grid gap-4">
                  {reachSchools.map(rec => {
                    const uni = universityData[rec.universityId as keyof typeof universityData];
                    return (
                      <div key={rec.universityId} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <img src={uni.image} alt={uni.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <h4 className="font-medium text-gray-900">{uni.name}</h4>
                              <p className="text-sm text-gray-600">#{uni.ranking} • {uni.acceptanceRate}% acceptance</p>
                              {rec.strengthenAreas.length > 0 && (
                                <div className="flex items-center mt-1">
                                  <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                                  <p className="text-xs text-amber-600">
                                    Strengthen: {rec.strengthenAreas.join(', ')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{rec.admissionChance}%</p>
                            <p className="text-xs text-gray-600">match score</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Intended Major:</span>
                  <span className="font-medium">{profile.intendedMajor || 'Undecided'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">GPA:</span>
                  <span className="font-medium">{profile.gpa}/4.0</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">SAT:</span>
                  <span className="font-medium">{profile.satScore || 'Not taken'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">ACT:</span>
                  <span className="font-medium">{profile.actScore || 'Not taken'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">TOEFL:</span>
                  <span className="font-medium">{profile.toeflScore || 'Not taken'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">AP Courses:</span>
                  <span className="font-medium">{profile.apCourses || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities:</span>
                  <span className="font-medium">{profile.extracurriculars.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Leadership:</span>
                  <span className="font-medium">{profile.leadership.length}</span>
                </div>
              </div>
            </div>

            {/* Improvement Areas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Areas to Strengthen</h2>
              
              <div className="space-y-3">
                {reachSchools.length > 0 && reachSchools[0].strengthenAreas.map((area, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">{area}</p>
                      <p className="text-sm text-amber-600 mt-1">
                        Focus on improving this area to increase your chances at reach schools.
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!reachSchools.length || !reachSchools[0].strengthenAreas.length) && (
                  <div className="text-center py-4 text-gray-500">
                    <Award className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>Great job! Your profile looks strong across all areas.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  to="/consulting"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center block"
                >
                  Find Consulting Programs
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  to="/universities"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-center block"
                >
                  Browse More Universities
                </Link>
                
                <Link
                  to="/compare"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-center block"
                >
                  Compare Schools
                </Link>
                
                <Link
                  to="/student-profile"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-center block"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;