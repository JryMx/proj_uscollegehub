import React, { useState } from 'react';
import { MapPin, Star, DollarSign, Clock, Users, Award, Phone, Mail, CheckCircle } from 'lucide-react';

interface ConsultingProgram {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: string;
  studentsHelped: number;
  successRate: number;
  image: string;
  specialties: string[];
  services: string[];
  description: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  strengths: string[];
}

// Mock consulting program data
const consultingPrograms: ConsultingProgram[] = [
  {
    id: '1',
    name: 'Seoul Academic Consulting',
    location: 'Gangnam-gu, Seoul',
    rating: 4.8,
    reviewCount: 156,
    price: 3500000,
    duration: '6 months',
    studentsHelped: 450,
    successRate: 87,
    image: 'https://images.pexels.com/photos/1181625/pexels-photo-1181625.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['SAT Prep', 'Essay Writing', 'Interview Coaching'],
    services: [
      'Personalized Study Plan',
      'Weekly Mock Tests',
      'Essay Review & Editing',
      'Interview Preparation',
      'College List Strategy',
      'Application Timeline Management',
    ],
    description: 'Premier consulting service specializing in top-tier university admissions with experienced counselors who studied at Ivy League schools.',
    contact: {
      phone: '+82-2-1234-5678',
      email: 'info@seoulacademic.com',
      website: 'www.seoulacademic.com',
    },
    strengths: ['SAT Score', 'Essay Writing', 'Interview Skills'],
  },
  {
    id: '2',
    name: 'GlobalEd Consulting',
    location: 'Jung-gu, Seoul',
    rating: 4.6,
    reviewCount: 203,
    price: 2800000,
    duration: '4 months',
    studentsHelped: 680,
    successRate: 82,
    image: 'https://images.pexels.com/photos/1181625/pexels-photo-1181625.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['STEM Programs', 'Research Projects', 'Leadership Development'],
    services: [
      'STEM Research Mentoring',
      'Leadership Project Development',
      'Extracurricular Planning',
      'Recommendation Letter Strategy',
      'Scholarship Application',
      'Visa Application Support',
    ],
    description: 'Focused on STEM education with strong connections to research institutions and internship opportunities.',
    contact: {
      phone: '+82-2-9876-5432',
      email: 'contact@globaled.co.kr',
      website: 'www.globaled.co.kr',
    },
    strengths: ['Extracurricular Activities', 'Leadership Experience', 'Research Experience'],
  },
  {
    id: '3',
    name: 'Elite Prep Academy',
    location: 'Seocho-gu, Seoul',
    rating: 4.9,
    reviewCount: 89,
    price: 4200000,
    duration: '8 months',
    studentsHelped: 280,
    successRate: 92,
    image: 'https://images.pexels.com/photos/1181625/pexels-photo-1181625.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['Ivy League Prep', 'Premium Counseling', 'Holistic Development'],
    services: [
      'One-on-One Counseling',
      'Ivy League Alumni Mentoring',
      'Premium Essay Workshop',
      'Mock Interview Sessions',
      'Standardized Test Prep',
      'College Visit Planning',
    ],
    description: 'Exclusive program with limited enrollment, providing intensive support for top-tier university admissions.',
    contact: {
      phone: '+82-2-5555-7777',
      email: 'admissions@eliteprep.kr',
      website: 'www.eliteprep.kr',
    },
    strengths: ['GPA', 'SAT Score', 'Overall Profile Development'],
  },
  {
    id: '4',
    name: 'Bridge Education Center',
    location: 'Mapo-gu, Seoul',
    rating: 4.4,
    reviewCount: 167,
    price: 2200000,
    duration: '5 months',
    studentsHelped: 520,
    successRate: 78,
    image: 'https://images.pexels.com/photos/1181625/pexels-photo-1181625.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['English Proficiency', 'Cultural Adaptation', 'Liberal Arts'],
    services: [
      'English Language Enhancement',
      'Cultural Orientation',
      'Liberal Arts Preparation',
      'Community Service Projects',
      'Study Abroad Preparation',
      'Financial Aid Guidance',
    ],
    description: 'Comprehensive support focusing on cultural adaptation and English proficiency for international education.',
    contact: {
      phone: '+82-2-3333-9999',
      email: 'info@bridgeedu.com',
      website: 'www.bridgeedu.com',
    },
    strengths: ['TOEFL Score', 'Cultural Adaptation', 'Liberal Arts Preparation'],
  },
];

const ConsultingPage: React.FC = () => {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    specialty: '',
    priceRange: '',
    location: '',
    rating: '',
  });

  const filteredPrograms = consultingPrograms.filter(program => {
    const matchesSpecialty = !filters.specialty || program.specialties.some(s => 
      s.toLowerCase().includes(filters.specialty.toLowerCase())
    );
    
    const matchesPrice = !filters.priceRange || 
                        (filters.priceRange === 'under3m' && program.price < 3000000) ||
                        (filters.priceRange === '3m-4m' && program.price >= 3000000 && program.price < 4000000) ||
                        (filters.priceRange === 'over4m' && program.price >= 4000000);
    
    const matchesLocation = !filters.location || 
                           program.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesRating = !filters.rating || 
                         (filters.rating === '4.5+' && program.rating >= 4.5) ||
                         (filters.rating === '4.0+' && program.rating >= 4.0);

    return matchesSpecialty && matchesPrice && matchesLocation && matchesRating;
  });

  const toggleProgramSelection = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : prev.length < 3 ? [...prev, programId] : prev
    );
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? '' : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Consulting Programs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Find the right consulting program to strengthen your profile and increase your chances 
            of admission to your target universities.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8 transition-colors">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Programs</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialty</label>
              <div className="space-y-2">
                {['SAT Prep', 'Essay Writing', 'STEM Programs', 'Interview Coaching'].map(specialty => (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.specialty === specialty}
                      onChange={() => handleFilterChange('specialty', specialty)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.priceRange === 'under3m'}
                    onChange={() => handleFilterChange('priceRange', 'under3m')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Under ₩3M</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.priceRange === '3m-4m'}
                    onChange={() => handleFilterChange('priceRange', '3m-4m')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">₩3M - ₩4M</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.priceRange === 'over4m'}
                    onChange={() => handleFilterChange('priceRange', 'over4m')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Over ₩4M</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <div className="space-y-2">
                {['Gangnam-gu', 'Jung-gu', 'Seocho-gu', 'Mapo-gu'].map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.location === location}
                      onChange={() => handleFilterChange('location', location)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.rating === '4.5+'}
                    onChange={() => handleFilterChange('rating', '4.5+')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">4.5+ Stars</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.rating === '4.0+'}
                    onChange={() => handleFilterChange('rating', '4.0+')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">4.0+ Stars</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Programs for Comparison */}
        {selectedPrograms.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-8 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Selected Programs ({selectedPrograms.length}/3)
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Compare up to 3 programs side by side
                </p>
              </div>
              {selectedPrograms.length >= 2 && (
                <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Compare Selected
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredPrograms.length} of {consultingPrograms.length} consulting programs
          </p>
        </div>

        {/* Program List */}
        <div className="space-y-6">
          {filteredPrograms.map(program => (
            <div
              key={program.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-300 ${
                selectedPrograms.includes(program.id) 
                  ? 'border-2 border-blue-500 shadow-lg' 
                  : 'border border-gray-200 hover:shadow-md dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="lg:w-1/4">
                  <img
                    src={program.image}
                    alt={program.name}
                    className="w-full h-48 lg:h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{program.name}</h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{program.location}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{program.rating}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({program.reviewCount} reviews)</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {program.studentsHelped} students helped
                        </div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          {program.successRate}% success rate
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        ₩{(program.price / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{program.duration}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{program.description}</p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Helps strengthen:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.strengths.map(strength => (
                        <span
                          key={strength}
                          className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm px-2 py-1 rounded-full flex items-center"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Services included:</h4>
                    <div className="grid md:grid-cols-2 gap-1">
                      {program.services.map(service => (
                        <div key={service} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mr-2"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {program.contact.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {program.contact.email}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => toggleProgramSelection(program.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedPrograms.includes(program.id)
                            ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-50\0 dark:hover:bg-blue-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {selectedPrograms.includes(program.id) ? 'Selected' : 'Select'}
                      </button>
                      <button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No consulting programs match your current filters.</p>
            <button
              onClick={() => setFilters({ specialty: '', priceRange: '', location: '', rating: '' })}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultingPage;