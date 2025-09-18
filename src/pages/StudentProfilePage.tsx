import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, Target, ArrowRight } from 'lucide-react';
import { useStudentProfile } from '../context/StudentProfileContext';

const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useStudentProfile();

  const [formData, setFormData] = useState({
    gpa: '',
    satScore: '',
    actScore: '',
    toeflScore: '',
    apCourses: '',
    ibScore: '',
    extracurriculars: [''],
    leadership: [''],
    volunteering: [''],
    awards: [''],
    intendedMajor: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) =>
        i === index ? value : item
      ),
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], ''],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile = {
      gpa: parseFloat(formData.gpa) || 0,
      satScore: parseInt(formData.satScore) || 0,
      actScore: parseInt(formData.actScore) || 0,
      toeflScore: parseInt(formData.toeflScore) || 0,
      apCourses: parseInt(formData.apCourses) || 0,
      ibScore: parseInt(formData.ibScore) || 0,
      extracurriculars: formData.extracurriculars.filter(item => item.trim() !== ''),
      leadership: formData.leadership.filter(item => item.trim() !== ''),
      volunteering: formData.volunteering.filter(item => item.trim() !== ''),
      awards: formData.awards.filter(item => item.trim() !== ''),
      intendedMajor: formData.intendedMajor,
      recommendations: [],
    };

    updateProfile(profile);
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Information</h2>
              <p className="text-gray-600 mb-6">
                Tell us about your academic achievements and test scores.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA (4.0 scale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3.8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intended Major
                </label>
                <select
                  value={formData.intendedMajor}
                  onChange={(e) => handleInputChange('intendedMajor', e.target.value)}
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
                  SAT Score
                </label>
                <input
                  type="number"
                  min="400"
                  max="1600"
                  value={formData.satScore}
                  onChange={(e) => handleInputChange('satScore', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1450"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ACT Score
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={formData.actScore}
                  onChange={(e) => handleInputChange('actScore', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TOEFL Score (International Students)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.toeflScore}
                  onChange={(e) => handleInputChange('toeflScore', e.target.value)}
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
                  value={formData.apCourses}
                  onChange={(e) => handleInputChange('apCourses', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Extracurricular Activities</h2>
              <p className="text-gray-600 mb-6">
                List your extracurricular activities, clubs, sports, and other interests.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracurricular Activities
              </label>
              {formData.extracurriculars.map((activity, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => handleArrayInputChange('extracurriculars', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Debate Club, Soccer Team, Math Olympiad"
                  />
                  {formData.extracurriculars.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('extracurriculars', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('extracurriculars')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Another Activity
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Leadership & Service</h2>
              <p className="text-gray-600 mb-6">
                Tell us about your leadership roles and volunteer work.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leadership Positions
              </label>
              {formData.leadership.map((role, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => handleArrayInputChange('leadership', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Student Council President, Club Captain"
                  />
                  {formData.leadership.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('leadership', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('leadership')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
              >
                + Add Leadership Role
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volunteer Work
              </label>
              {formData.volunteering.map((work, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={work}
                    onChange={(e) => handleArrayInputChange('volunteering', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Local Food Bank, Environmental Cleanup"
                  />
                  {formData.volunteering.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('volunteering', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('volunteering')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Volunteer Work
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Awards & Achievements</h2>
              <p className="text-gray-600 mb-6">
                List any awards, honors, or special achievements you've received.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Awards & Honors
              </label>
              {formData.awards.map((award, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={award}
                    onChange={(e) => handleArrayInputChange('awards', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., National Merit Scholar, Science Fair Winner"
                  />
                  {formData.awards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('awards', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('awards')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Award
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Ready to analyze your profile?</h3>
              <p className="text-blue-700 text-sm">
                Once you submit this information, we'll analyze your academic profile and provide 
                personalized university recommendations categorized as Safety, Target, and Reach schools.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Student Profile Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us understand your academic background to provide personalized university recommendations.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                <Target className="mr-2 h-4 w-4" />
                Analyze Profile
              </button>
            )}
          </div>
        </form>

        {/* Step Indicators */}
        <div className="flex justify-center mt-8 space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step === 1 && <BookOpen className="h-4 w-4" />}
              {step === 2 && <Users className="h-4 w-4" />}
              {step === 3 && <Target className="h-4 w-4" />}
              {step === 4 && <Award className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;