import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, Target, ArrowRight, Plus, X, Search, Calculator, CheckCircle, XCircle, ClipboardList } from 'lucide-react';
import { useStudentProfile, ExtracurricularActivity, RecommendationLetter, ApplicationComponents } from '../context/StudentProfileContext';

const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, calculateProfileScore, searchSchools } = useStudentProfile();

  const [activeTab, setActiveTab] = useState<'academic' | 'non-academic'>('academic');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentCalculatedScore, setCurrentCalculatedScore] = useState<number>(0);

  // Application Components Checker
  const [applicationComponents, setApplicationComponents] = useState<ApplicationComponents>(
    profile?.applicationComponents || {
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
    }
  );

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

  // Non-academic form data
  const [nonAcademicData, setNonAcademicData] = useState({
    personalStatement: profile?.personalStatement || '',
    legacyStatus: profile?.legacyStatus || false,
    citizenship: profile?.citizenship || 'domestic',
  });

  const [extracurriculars, setExtracurriculars] = useState<ExtracurricularActivity[]>(
    profile?.extracurriculars || []
  );

  const [recommendationLetters, setRecommendationLetters] = useState<RecommendationLetter[]>(
    profile?.recommendationLetters || []
  );

  const handleAcademicChange = (field: string, value: string) => {
    setAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleNonAcademicChange = (field: string, value: string | boolean) => {
    setNonAcademicData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplicationComponentChange = (component: keyof ApplicationComponents, value: boolean) => {
    setApplicationComponents(prev => ({ ...prev, [component]: value }));
  };

  const addExtracurricular = () => {
    const newActivity: ExtracurricularActivity = {
      id: Date.now().toString(),
      type: 'Other',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      recognitionLevel: 'Local',
      hoursPerWeek: 0,
    };
    setExtracurriculars(prev => [...prev, newActivity]);
  };

  const updateExtracurricular = (id: string, field: keyof ExtracurricularActivity, value: any) => {
    setExtracurriculars(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  const removeExtracurricular = (id: string) => {
    setExtracurriculars(prev => prev.filter(activity => activity.id !== id));
  };

  const addRecommendationLetter = () => {
    const newLetter: RecommendationLetter = {
      id: Date.now().toString(),
      source: 'Teacher',
      subject: '',
      relationship: '',
    };
    setRecommendationLetters(prev => [...prev, newLetter]);
  };

  const updateRecommendationLetter = (id: string, field: keyof RecommendationLetter, value: string) => {
    setRecommendationLetters(prev =>
      prev.map(letter =>
        letter.id === id ? { ...letter, [field]: value } : letter
      )
    );
  };

  const removeRecommendationLetter = (id: string) => {
    setRecommendationLetters(prev => prev.filter(letter => letter.id !== id));
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
      personalStatement: nonAcademicData.personalStatement,
      legacyStatus: nonAcademicData.legacyStatus,
      citizenship: nonAcademicData.citizenship as 'domestic' | 'international',
      extracurriculars,
      recommendationLetters,
      applicationComponents,
      // Legacy fields for compatibility
      leadership: [],
      volunteering: [],
      awards: [],
    };

    await updateProfile(profileData);
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
  
  const handleSearchAsync = async () => {
    if (searchQuery.trim() && profile) {
      const results = await searchSchools(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    }
  };

  // Calculate current score whenever form data changes
  React.useEffect(() => {
    const calculateCurrentScore = async () => {
      try {
        const score = await calculateProfileScore({
          ...academicData,
          ...nonAcademicData,
          extracurriculars,
          recommendationLetters,
          gpa: parseFloat(academicData.gpa) || 0,
          satEBRW: parseInt(academicData.satEBRW) || 0,
          satMath: parseInt(academicData.satMath) || 0,
          actScore: parseInt(academicData.actScore) || 0,
          apCourses: parseInt(academicData.apCourses) || 0,
          ibScore: parseInt(academicData.ibScore) || 0,
          toeflScore: parseInt(academicData.toeflScore) || 0,
        });
        setCurrentCalculatedScore(score);
      } catch (error) {
        console.error('Error calculating current score:', error);
        setCurrentCalculatedScore(0);
      }
    };

    // Only calculate if we have some data
    if (Object.values(academicData).some(v => v) || Object.values(nonAcademicData).some(v => v)) {
      calculateCurrentScore();
    } else {
      setCurrentCalculatedScore(0);
    }
  }, [academicData, nonAcademicData, extracurriculars, recommendationLetters, calculateProfileScore]);

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
        {(profile || Object.values(academicData).some(v => v) || Object.values(nonAcademicData).some(v => v)) && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Profile Rigor Score</h2>
            <div className="text-5xl font-bold mb-2">{currentCalculatedScore}/100</div>
            <p className="text-blue-100">
              {currentCalculatedScore >= 90 ? 'Excellent' : 
               currentCalculatedScore >= 80 ? 'Very Good' : 
               currentCalculatedScore >= 70 ? 'Good' : 
               currentCalculatedScore >= 60 ? 'Fair' : 'Needs Improvement'}
            </p>
          </div>
        )}

        {/* Application Components Checker */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <ClipboardList className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Application Components Checklist</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Check off the application components you have completed or possess. This helps track your application readiness.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'secondarySchoolGPA', label: 'Secondary School GPA', description: 'Official high school GPA' },
                { key: 'classRank', label: 'Class Rank', description: 'Your ranking within graduating class' },
                { key: 'academicRecord', label: 'Academic Record', description: 'Official transcripts and grades' },
                { key: 'collegePrepProgram', label: 'College-Prep Program', description: 'Completion of college preparatory curriculum' },
                { key: 'recommendationLetters', label: 'Recommendation Letters', description: 'Letters from teachers, counselors, etc.' },
                { key: 'formalDemonstrationCompetencies', label: 'Demonstration of Competencies', description: 'Portfolio, auditions, or skill demonstrations' },
                { key: 'workExperience', label: 'Work Experience', description: 'Part-time jobs, internships, or employment' },
                { key: 'personalStatementEssay', label: 'Personal Statement/Essay', description: 'Common App essay or personal statement' },
                { key: 'legacyStatus', label: 'Legacy Status', description: 'Family connection to the university' },
                { key: 'admissionTestScores', label: 'Admission Test Scores', description: 'SAT, ACT, or other standardized tests' },
                { key: 'englishProficiencyTest', label: 'English Proficiency Test', description: 'TOEFL, IELTS (for international students)' },
              ].map((component) => (
                <div
                  key={component.key}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    applicationComponents[component.key as keyof ApplicationComponents]
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleApplicationComponentChange(
                        component.key as keyof ApplicationComponents,
                        !applicationComponents[component.key as keyof ApplicationComponents]
                      )}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        applicationComponents[component.key as keyof ApplicationComponents]
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {applicationComponents[component.key as keyof ApplicationComponents] && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        applicationComponents[component.key as keyof ApplicationComponents]
                          ? 'text-green-800'
                          : 'text-gray-900'
                      }`}>
                        {component.label}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        applicationComponents[component.key as keyof ApplicationComponents]
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {component.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Completion Summary */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">Application Readiness</h3>
                  <p className="text-blue-700 text-sm">
                    {Object.values(applicationComponents).filter(Boolean).length} of {Object.keys(applicationComponents).length} components completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((Object.values(applicationComponents).filter(Boolean).length / Object.keys(applicationComponents).length) * 100)}%
                  </div>
                  <div className="text-sm text-blue-600">Complete</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.values(applicationComponents).filter(Boolean).length / Object.keys(applicationComponents).length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('academic')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'academic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                Academic Inputs
              </button>
              <button
                onClick={() => setActiveTab('non-academic')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'non-academic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award className="h-4 w-4 inline mr-2" />
                Non-Academic Inputs
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'academic' && (
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
            )}

            {activeTab === 'non-academic' && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Non-Academic Information</h2>

                {/* Personal Statement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Statement (Common App Essay)
                  </label>
                  <textarea
                    value={nonAcademicData.personalStatement}
                    onChange={(e) => handleNonAcademicChange('personalStatement', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder="Write your personal statement here..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {nonAcademicData.personalStatement.length} characters
                  </p>
                </div>

                {/* Legacy Status and Citizenship */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Legacy Status
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="legacyStatus"
                          checked={nonAcademicData.legacyStatus === true}
                          onChange={() => handleNonAcademicChange('legacyStatus', true)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="legacyStatus"
                          checked={nonAcademicData.legacyStatus === false}
                          onChange={() => handleNonAcademicChange('legacyStatus', false)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Citizenship
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="citizenship"
                          checked={nonAcademicData.citizenship === 'domestic'}
                          onChange={() => handleNonAcademicChange('citizenship', 'domestic')}
                          className="mr-2"
                        />
                        Domestic
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="citizenship"
                          checked={nonAcademicData.citizenship === 'international'}
                          onChange={() => handleNonAcademicChange('citizenship', 'international')}
                          className="mr-2"
                        />
                        International
                      </label>
                    </div>
                  </div>
                </div>

                {/* Extracurricular Activities */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Extracurricular Activities</h3>
                    <button
                      onClick={addExtracurricular}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Activity
                    </button>
                  </div>

                  <div className="space-y-4">
                    {extracurriculars.map((activity, index) => (
                      <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-gray-900">Activity {index + 1}</h4>
                          <button
                            onClick={() => removeExtracurricular(activity.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Activity Type
                            </label>
                            <select
                              value={activity.type}
                              onChange={(e) => updateExtracurricular(activity.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Sports">Sports</option>
                              <option value="Arts">Arts</option>
                              <option value="Community Service">Community Service</option>
                              <option value="Research">Research</option>
                              <option value="Academic Clubs">Academic Clubs</option>
                              <option value="Leadership">Leadership</option>
                              <option value="Work Experience">Work Experience</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Activity Name
                            </label>
                            <input
                              type="text"
                              value={activity.name}
                              onChange={(e) => updateExtracurricular(activity.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Varsity Soccer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={activity.startDate}
                              onChange={(e) => updateExtracurricular(activity.id, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={activity.endDate}
                              onChange={(e) => updateExtracurricular(activity.id, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Recognition Level
                            </label>
                            <select
                              value={activity.recognitionLevel}
                              onChange={(e) => updateExtracurricular(activity.id, 'recognitionLevel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Local">Local</option>
                              <option value="Regional">Regional</option>
                              <option value="National">National</option>
                              <option value="International">International</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hours per Week
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="40"
                              value={activity.hoursPerWeek}
                              onChange={(e) => updateExtracurricular(activity.id, 'hoursPerWeek', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="10"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={activity.description}
                            onChange={(e) => updateExtracurricular(activity.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="Describe your role and achievements..."
                          />
                        </div>
                      </div>
                    ))}

                    {extracurriculars.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No extracurricular activities added yet.</p>
                        <p className="text-sm">Click "Add Activity" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendation Letters */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recommendation Letters</h3>
                    <button
                      onClick={addRecommendationLetter}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Letter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {recommendationLetters.map((letter, index) => (
                      <div key={letter.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-gray-900">Recommendation {index + 1}</h4>
                          <button
                            onClick={() => removeRecommendationLetter(letter.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Source
                            </label>
                            <select
                              value={letter.source}
                              onChange={(e) => updateRecommendationLetter(letter.id, 'source', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Teacher">Teacher</option>
                              <option value="Counselor">Counselor</option>
                              <option value="Principal">Principal</option>
                              <option value="Coach">Coach</option>
                              <option value="Employer">Employer</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subject (if Teacher)
                            </label>
                            <input
                              type="text"
                              value={letter.subject || ''}
                              onChange={(e) => updateRecommendationLetter(letter.id, 'subject', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Mathematics"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={letter.relationship}
                              onChange={(e) => updateRecommendationLetter(letter.id, 'relationship', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., AP Calculus teacher for 2 years"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {recommendationLetters.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No recommendation letters added yet.</p>
                        <p className="text-sm">Click "Add Letter" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleSaveProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Profile Score
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Search
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