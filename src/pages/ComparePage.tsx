import React, { useState } from 'react';
import { X, Plus, BookOpen, Users, DollarSign, Award, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface University {
  id: string;
  name: string;
  location: string;
  ranking: number;
  tuition: number;
  acceptanceRate: number;
  satRange: string;
  actRange: string;
  toeflMin: number;
  image: string;
  type: string;
  size: string;
  founded: number;
  programs: string[];
  applicationDeadline: string;
  earlyDeadline: string;
  essayCount: number;
  averageAid: number;
  needBlind: boolean;
  housing: string;
}

// Mock university data
const allUniversities: University[] = [
  {
    id: '1',
    name: 'Harvard University',
    location: 'Cambridge, MA',
    ranking: 2,
    tuition: 54269,
    acceptanceRate: 5.4,
    satRange: '1460-1570',
    actRange: '33-35',
    toeflMin: 100,
    image: 'https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Private',
    size: 'Medium (6,700)',
    founded: 1636,
    programs: ['Liberal Arts', 'Medicine', 'Business', 'Law'],
    applicationDeadline: 'January 1',
    earlyDeadline: 'November 1',
    essayCount: 5,
    averageAid: 53000,
    needBlind: true,
    housing: '98% live on campus',
  },
  {
    id: '2',
    name: 'Stanford University',
    location: 'Stanford, CA',
    ranking: 3,
    tuition: 56169,
    acceptanceRate: 4.8,
    satRange: '1440-1570',
    actRange: '32-35',
    toeflMin: 100,
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Private',
    size: 'Medium (7,087)',
    founded: 1885,
    programs: ['Engineering', 'Computer Science', 'Business', 'Medicine'],
    applicationDeadline: 'January 5',
    earlyDeadline: 'November 1',
    essayCount: 3,
    averageAid: 52000,
    needBlind: true,
    housing: '95% live on campus',
  },
  {
    id: '3',
    name: 'MIT',
    location: 'Cambridge, MA',
    ranking: 4,
    tuition: 53790,
    acceptanceRate: 7.3,
    satRange: '1470-1570',
    actRange: '33-35',
    toeflMin: 90,
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Private',
    size: 'Small (4,602)',
    founded: 1861,
    programs: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'],
    applicationDeadline: 'January 1',
    earlyDeadline: 'November 1',
    essayCount: 4,
    averageAid: 48000,
    needBlind: true,
    housing: '89% live on campus',
  },
  {
    id: '4',
    name: 'UC Berkeley',
    location: 'Berkeley, CA',
    ranking: 22,
    tuition: 44007,
    acceptanceRate: 17.5,
    satRange: '1330-1530',
    actRange: '30-35',
    toeflMin: 80,
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Public',
    size: 'Large (31,780)',
    founded: 1868,
    programs: ['Engineering', 'Business', 'Liberal Arts', 'Sciences'],
    applicationDeadline: 'November 30',
    earlyDeadline: 'N/A',
    essayCount: 4,
    averageAid: 25000,
    needBlind: false,
    housing: '25% live on campus',
  },
];

const ComparePage: React.FC = () => {
  const [selectedUniversities, setSelectedUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const availableUniversities = allUniversities.filter(
    uni => !selectedUniversities.find(selected => selected.id === uni.id)
  );

  const filteredUniversities = availableUniversities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addUniversity = (university: University) => {
    if (selectedUniversities.length < 4) {
      setSelectedUniversities(prev => [...prev, university]);
      setShowAddModal(false);
      setSearchTerm('');
    }
  };

  const removeUniversity = (universityId: string) => {
    setSelectedUniversities(prev => prev.filter(uni => uni.id !== universityId));
  };

  const comparisonCategories = [
    {
      title: 'Basic Information',
      fields: [
        { key: 'ranking', label: 'National Ranking', format: (val: any) => `#${val}` },
        { key: 'type', label: 'Type', format: (val: any) => val },
        { key: 'location', label: 'Location', format: (val: any) => val },
        { key: 'founded', label: 'Founded', format: (val: any) => val },
        { key: 'size', label: 'Size', format: (val: any) => val },
      ],
    },
    {
      title: 'Admissions',
      fields: [
        { key: 'acceptanceRate', label: 'Acceptance Rate', format: (val: any) => `${val}%` },
        { key: 'satRange', label: 'SAT Range', format: (val: any) => val },
        { key: 'actRange', label: 'ACT Range', format: (val: any) => val },
        { key: 'toeflMin', label: 'TOEFL Minimum', format: (val: any) => val },
        { key: 'essayCount', label: 'Required Essays', format: (val: any) => val },
      ],
    },
    {
      title: 'Deadlines',
      fields: [
        { key: 'earlyDeadline', label: 'Early Decision', format: (val: any) => val || 'N/A' },
        { key: 'applicationDeadline', label: 'Regular Decision', format: (val: any) => val },
      ],
    },
    {
      title: 'Financial',
      fields: [
        { key: 'tuition', label: 'Annual Tuition', format: (val: any) => `$${val.toLocaleString()}` },
        { key: 'averageAid', label: 'Average Aid', format: (val: any) => `$${val.toLocaleString()}` },
        { key: 'needBlind', label: 'Need-Blind', format: (val: any) => val ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Campus Life',
      fields: [
        { key: 'housing', label: 'Housing', format: (val: any) => val },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compare Universities
          </h1>
          <p className="text-lg text-gray-600">
            Compare up to 4 universities side by side to make informed decisions about your applications.
          </p>
        </div>

        {/* Add Universities */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Selected Universities ({selectedUniversities.length}/4)
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={selectedUniversities.length >= 4}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add University
            </button>
          </div>

          {/* Selected Universities Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedUniversities.map(university => (
              <div key={university.id} className="relative border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => removeUniversity(university.id)}
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50 rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
                <img
                  src={university.image}
                  alt={university.name}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-900 mb-1">{university.name}</h3>
                <p className="text-sm text-gray-600">{university.location}</p>
              </div>
            ))}

            {/* Add Button Cards */}
            {Array.from({ length: 4 - selectedUniversities.length }).map((_, index) => (
              <div
                key={index}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add University</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedUniversities.length >= 2 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-48">
                      Category
                    </th>
                    {selectedUniversities.map(university => (
                      <th key={university.id} className="px-6 py-4 text-center min-w-48">
                        <div className="flex flex-col items-center">
                          <img
                            src={university.image}
                            alt={university.name}
                            className="w-12 h-12 object-cover rounded-lg mb-2"
                          />
                          <span className="font-semibold text-gray-900 text-sm">
                            {university.name}
                          </span>
                          <span className="text-xs text-gray-500">#{university.ranking}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {comparisonCategories.map(category => (
                    <React.Fragment key={category.title}>
                      {/* Category Header */}
                      <tr className="bg-gray-50">
                        <td
                          colSpan={selectedUniversities.length + 1}
                          className="px-6 py-3 text-sm font-semibold text-gray-900"
                        >
                          {category.title}
                        </td>
                      </tr>

                      {/* Category Fields */}
                      {category.fields.map(field => (
                        <tr key={field.key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                            {field.label}
                          </td>
                          {selectedUniversities.map(university => (
                            <td key={university.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                              {field.format(university[field.key as keyof University])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Programs */}
                  <tr className="bg-gray-50">
                    <td
                      colSpan={selectedUniversities.length + 1}
                      className="px-6 py-3 text-sm font-semibold text-gray-900"
                    >
                      Popular Programs
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                      Top Programs
                    </td>
                    {selectedUniversities.map(university => (
                      <td key={university.id} className="px-6 py-4 text-sm text-gray-700">
                        <div className="space-y-1">
                          {university.programs.map(program => (
                            <div
                              key={program}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full inline-block mr-1 mb-1"
                            >
                              {program}
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedUniversities.length < 2 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Add universities to start comparing
            </h3>
            <p className="text-gray-600 mb-6">
              Select at least 2 universities to see a detailed side-by-side comparison.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Universities
            </button>
          </div>
        )}

        {/* Add University Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add University</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />

              {/* University List */}
              <div className="space-y-2">
                {filteredUniversities.map(university => (
                  <button
                    key={university.id}
                    onClick={() => addUniversity(university)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={university.image}
                        alt={university.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{university.name}</div>
                        <div className="text-sm text-gray-600">{university.location}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredUniversities.length === 0 && (
                <p className="text-gray-500 text-center py-4">No universities found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;