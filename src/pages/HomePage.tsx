import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Target, Users, ArrowRight, BookOpen, Trophy, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Path to
              <span className="text-blue-200 dark:text-blue-300"> U.S. Universities</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
              Discover universities, analyze your chances, and find the best consulting programs 
              to strengthen your profile for admission success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/student-profile"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Profile Analysis
              </Link>
              <Link
                to="/universities"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-2 border-white border-opacity-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                Browse Universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for University Admissions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides the tools and insights international students need 
              to navigate U.S. university admissions successfully.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">University Database</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Access detailed information about hundreds of U.S. universities including 
                admission requirements, deadlines, and program details.
              </p>
              <Link
                to="/universities"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Explore Universities
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                AI-powered analysis of your academic profile to categorize schools into 
                safety, target, and reach categories with match scores.
              </p>
              <Link
                to="/student-profile"
                className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                Analyze Profile
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Consulting Programs</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Find and compare consulting programs that can help strengthen your profile 
                for your target universities.
              </p>
              <Link
                to="/consulting"
                className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
              >
                Find Consultants
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-300">Universities Tracked</div>
            </div>
            <div className="p-8">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div className="p-8">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-gray-300">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-gray-100 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of international students who have successfully navigated 
            U.S. university admissions with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/universities"
              className="bg-transparent hover:bg-blue-500 dark:hover:bg-blue-700 text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Browse Universities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;