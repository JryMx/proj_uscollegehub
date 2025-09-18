import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, DollarSign, BookOpen, Calendar, FileText, Award, ArrowLeft, Plus, BarChart3 } from 'lucide-react';

// Mock university data (in a real app, this would come from an API)
const getUniversityData = (id: string) => {
  const universities = {
    '1': {
      id: '1',
      name: 'Harvard University',
      location: 'Cambridge, Massachusetts',
      ranking: 2,
      tuition: 54269,
      acceptanceRate: 5.4,
      satRange: '1460-1570',
      actRange: '33-35',
      toeflMin: 100,
      image: 'https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'Private',
      size: 'Medium (6,700 undergraduates)',
      founded: 1636,
      description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, Harvard is the oldest institution of higher education in the United States and one of the most prestigious universities worldwide.',
      programs: ['Liberal Arts', 'Medicine', 'Business', 'Law', 'Engineering', 'Public Health'],
      requirements: {
        applicationDeadline: 'January 1',
        earlyDeadline: 'November 1',
        commonApp: true,
        essays: 2,
        recommendationLetters: 2,
        interview: 'Optional',
        requiredTests: ['SAT or ACT', 'TOEFL/IELTS (International)'],
        requiredDocuments: [
          'Common Application',
          'Harvard Supplement',
          'Official Transcripts',
          'Mid-Year Report',
          'Two Teacher Recommendations',
          'Counselor Recommendation',
        ],
      },
      essayPrompts: [
        'Harvard has long recognized the importance of enrolling a diverse student body. How will the life experiences that shape who you are today enable you to contribute to Harvard? (200 words)',
        'Briefly describe an intellectual experience that was important to you. (200 words)',
        'Briefly describe any of your extracurricular activities, employment experience, travel, or family responsibilities that have shaped who you are. (200 words)',
        'How do you hope to use your Harvard education in the future? (200 words)',
        'Top 3 things your roommates might like to know about you. (200 words)',
      ],
      majorRequirements: {
        'Engineering': {
          prerequisites: ['Physics', 'Chemistry', 'Advanced Mathematics'],
          averageGPA: 4.1,
          averageSAT: 1550,
        },
        'Business': {
          prerequisites: ['Mathematics', 'Economics recommended'],
          averageGPA: 4.0,
          averageSAT: 1520,
        },
      },
      campusLife: {
        location: 'Urban campus in historic Cambridge',
        housing: '98% of undergraduates live on campus',
        dining: '13 dining halls and cafes',
        activities: '450+ student organizations',
      },
      financialAid: {
        percentage: 55,
        averageAid: 53000,
        needBlind: true,
        details: 'Families earning less than $85,000 pay nothing. No loans required.',
      },
    },
    // Add more universities as needed
  };

  return universities[id as keyof typeof universities];
};

const UniversityProfilePage: React.FC = () => {
  const { id } = useParams();
  const university = getUniversityData(id || '1');

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">University Not Found</h2>
          <Link to="/universities" className="text-blue-600 hover:text-blue-700">
            Back to Universities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Link
              to="/universities"
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Universities
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={university.image}
              alt={university.name}
              className="w-full md:w-1/3 h-64 md:h-48 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {university.name}
                </h1>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    #{university.ranking} National
                  </span>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus className="h-4 w-4 inline mr-1" />
                    Compare
                  </button>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{university.location}</span>
                <span className="mx-2">•</span>
                <span>Founded {university.founded}</span>
                <span className="mx-2">•</span>
                <span>{university.type}</span>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {university.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Acceptance Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{university.acceptanceRate}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Tuition</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${university.tuition.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">SAT Range</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{university.satRange}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">ACT Range</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{university.actRange}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Requirements */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Application Requirements
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Important Dates</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Early Decision: {university.requirements.earlyDeadline}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Regular Decision: {university.requirements.applicationDeadline}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Required Tests</h3>
                  <div className="space-y-1">
                    {university.requirements.requiredTests.map((test, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        • {test}
                      </div>
                    ))}
                    <div className="text-sm text-gray-700">• TOEFL Minimum: {university.toeflMin}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Required Documents</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {university.requirements.requiredDocuments.map((doc, index) => (
                    <div key={index} className="text-sm text-gray-700 flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Essay Prompts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Essay Prompts
              </h2>

              <div className="space-y-4">
                {university.essayPrompts.map((prompt, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Essay {index + 1}
                    </div>
                    <div className="text-gray-700">{prompt}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Major-Specific Requirements */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                Major-Specific Information
              </h2>

              <div className="space-y-6">
                {Object.entries(university.majorRequirements).map(([major, req]) => (
                  <div key={major} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{major}</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-600 mb-1">Prerequisites</div>
                        <div className="space-y-1">
                          {req.prerequisites.map((prereq, index) => (
                            <div key={index} className="text-gray-700">• {prereq}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-600 mb-1">Average GPA</div>
                        <div className="text-lg font-bold text-blue-600">{req.averageGPA}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-600 mb-1">Average SAT</div>
                        <div className="text-lg font-bold text-blue-600">{req.averageSAT}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Programs */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Programs</h2>
              <div className="space-y-2">
                {university.programs.map((program, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 px-3 py-2 rounded-md text-sm font-medium text-gray-700"
                  >
                    {program}
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Life */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Campus Life</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-gray-600">Location</div>
                  <div className="text-gray-700">{university.campusLife.location}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Housing</div>
                  <div className="text-gray-700">{university.campusLife.housing}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Dining</div>
                  <div className="text-gray-700">{university.campusLife.dining}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Activities</div>
                  <div className="text-gray-700">{university.campusLife.activities}</div>
                </div>
              </div>
            </div>

            {/* Financial Aid */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Aid</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-gray-600">Students Receiving Aid</div>
                  <div className="text-2xl font-bold text-green-600">
                    {university.financialAid.percentage}%
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Average Aid Package</div>
                  <div className="text-lg font-bold text-green-600">
                    ${university.financialAid.averageAid.toLocaleString()}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="text-green-800 font-medium">Need-Blind Admissions</div>
                  <div className="text-green-700 text-xs mt-1">
                    {university.financialAid.details}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/student-profile"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center block"
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Check My Chances
              </Link>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
                <Plus className="h-4 w-4 inline mr-2" />
                Add to Compare List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfilePage;