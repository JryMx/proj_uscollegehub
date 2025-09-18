import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, DollarSign, BookOpen, Filter, Grid, List } from 'lucide-react';

interface University {
  id: string;
  name: string;
  location: string;
  ranking: number;
  tuition: number;
  acceptanceRate: number;
  satRange: string;
  actRange: string;
  image: string;
  type: string;
  size: string;
  programs: string[];
}

// Mock university data
const universities: University[] = [
  {
    id: '1',
    name: 'Harvard University',
    location: 'Cambridge, MA',
    ranking: 2,
    tuition: 54269,
    acceptanceRate: 5.4,
    satRange: '1460-1570',
    actRange: '33-35',
    image: 'https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Private',
    size: 'Medium (5,000-15,000)',
    programs: ['Liberal Arts', 'Medicine', 'Business', 'Law'],
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
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Private',
    size: 'Medium (5,000-15,000)',
    programs: ['Engineering', 'Computer Science', 'Business', 'Medicine'],
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
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Private',
    size: 'Small (<5,000)',
    programs: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'],
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
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Public',
    size: 'Large (15,000+)',
    programs: ['Engineering', 'Business', 'Liberal Arts', 'Sciences'],
  },
  {
    id: '5',
    name: 'NYU',
    location: 'New York, NY',
    ranking: 28,
    tuition: 53308,
    acceptanceRate: 21.1,
    satRange: '1350-1530',
    actRange: '30-34',
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Private',
    size: 'Large (15,000+)',
    programs: ['Business', 'Arts', 'Liberal Arts', 'Medicine'],
  },
  {
    id: '6',
    name: 'Penn State',
    location: 'University Park, PA',
    ranking: 63,
    tuition: 35514,
    acceptanceRate: 76.0,
    satRange: '1160-1360',
    actRange: '25-30',
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Public',
    size: 'Large (15,000+)',
    programs: ['Engineering', 'Business', 'Liberal Arts', 'Agriculture'],
  },
];

const UniversitiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    type: '',
    size: '',
    ranking: '',
    tuition: '',
  });

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || uni.type === filters.type;
    const matchesSize = !filters.size || uni.size === filters.size;
    const matchesRanking = !filters.ranking || 
                          (filters.ranking === 'top10' && uni.ranking <= 10) ||
                          (filters.ranking === 'top50' && uni.ranking <= 50) ||
                          (filters.ranking === 'top100' && uni.ranking <= 100);
    const matchesTuition = !filters.tuition ||
                          (filters.tuition === 'under30k' && uni.tuition < 30000) ||
                          (filters.tuition === '30k-50k' && uni.tuition >= 30000 && uni.tuition < 50000) ||
                          (filters.tuition === 'over50k' && uni.tuition >= 50000);

    return matchesSearch && matchesType && matchesSize && matchesRanking && matchesTuition;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? '' : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            U.S. Universities Directory
          </h1>
          <p className="text-lg text-gray-600">
            Explore detailed profiles of top U.S. universities and find your perfect match.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search universities by name or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center mb-3">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium text-gray-700">Filters</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type === 'Private'}
                      onChange={() => handleFilterChange('type', 'Private')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Private</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type === 'Public'}
                      onChange={() => handleFilterChange('type', 'Public')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Public</span>
                  </label>
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.size === 'Small (<5,000)'}
                      onChange={() => handleFilterChange('size', 'Small (<5,000)')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Small</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.size === 'Medium (5,000-15,000)'}
                      onChange={() => handleFilterChange('size', 'Medium (5,000-15,000)')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Medium</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.size === 'Large (15,000+)'}
                      onChange={() => handleFilterChange('size', 'Large (15,000+)')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Large</span>
                  </label>
                </div>
              </div>

              {/* Ranking Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ranking</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.ranking === 'top10'}
                      onChange={() => handleFilterChange('ranking', 'top10')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Top 10</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.ranking === 'top50'}
                      onChange={() => handleFilterChange('ranking', 'top50')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Top 50</span>
                  </label>
                </div>
              </div>

              {/* Tuition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tuition</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tuition === 'under30k'}
                      onChange={() => handleFilterChange('tuition', 'under30k')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Under $30K</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tuition === '30k-50k'}
                      onChange={() => handleFilterChange('tuition', '30k-50k')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">$30K-$50K</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tuition === 'over50k'}
                      onChange={() => handleFilterChange('tuition', 'over50k')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Over $50K</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredUniversities.length} of {universities.length} universities
          </p>
        </div>

        {/* University Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
        }>
          {filteredUniversities.map(university => (
            <div
              key={university.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={viewMode === 'list' ? 'w-1/3' : ''}>
                <img
                  src={university.image}
                  alt={university.name}
                  className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-48'}`}
                />
              </div>
              
              <div className={`p-6 ${viewMode === 'list' ? 'w-2/3 flex flex-col justify-between' : ''}`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{university.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                      #{university.ranking}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{university.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{university.acceptanceRate}% acceptance</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                      <span>${university.tuition.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <span>SAT: {university.satRange}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <span>ACT: {university.actRange}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {university.programs.slice(0, 3).map(program => (
                        <span
                          key={program}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {program}
                        </span>
                      ))}
                      {university.programs.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{university.programs.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/university/${university.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No universities match your current filters.</p>
            <button
              onClick={() => setFilters({ type: '', size: '', ranking: '', tuition: '' })}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitiesPage;