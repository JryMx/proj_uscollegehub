import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UniversitiesPage from './pages/UniversitiesPage';
import UniversityProfilePage from './pages/UniversityProfilePage';
import StudentProfilePage from './pages/StudentProfilePage';
import DashboardPage from './pages/DashboardPage';
import ConsultingPage from './pages/ConsultingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import { StudentProfileProvider } from './context/StudentProfileContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentProfileProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/universities" element={<UniversitiesPage />} />
                <Route path="/university/:id" element={<UniversityProfilePage />} />
                <Route path="/student-profile" element={<StudentProfilePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/consulting" element={<ConsultingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Routes>
            </div>
          </Router>
        </StudentProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;