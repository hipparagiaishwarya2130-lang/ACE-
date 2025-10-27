import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Home, { AuthHome } from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import InterviewPractice from './pages/InterviewPractice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import DomainSelectionPage from './pages/DomainSelectionPage';
import CourseRecommendations from './components/CourseRecommendations';
import CourseDetail from './components/CourseDetail';
import Loader from './components/Loader';
import Team from './pages/Team';
import TiltedCard from './pages/TiltedCard';

function EnrolledProfile() {
  const [enrolled, setEnrolled] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      setEnrolled(Array.isArray(data) ? data : []);
    } catch {
      setEnrolled([]);
    }
  }, []);

  const initials = user?.name
    ? user.name.trim().split(/\s+/).map(p => p[0]).join('').slice(0,2).toUpperCase()
    : 'U';

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 16,
        marginBottom: 20
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: 'var(--gradient)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            letterSpacing: 0.5
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{user?.name || 'User'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '.95rem' }}>{user?.email || ''}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {user?.level && (
              <span style={{ padding: '6px 10px', background: 'rgba(108,140,255,0.12)', borderRadius: 8, fontSize: 12 }}>Level: {user.level}</span>
            )}
            {typeof user?.streak === 'number' && (
              <span style={{ padding: '6px 10px', background: 'rgba(23,210,194,0.12)', borderRadius: 8, fontSize: 12 }}>Streak: {user.streak}d</span>
            )}
          </div>
        </div>
      </div>

      <h1 style={{
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'var(--gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>My Enrolled Courses</h1>

      {enrolled.length === 0 ? (
        <div style={{ color: 'var(--muted)' }}>
          You haven't enrolled in any courses yet.
          <div style={{ marginTop: 12 }}>
            <Link to="/courses" className="nav-link" style={{ display: 'inline-block' }}>Browse courses</Link>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {enrolled.map((c) => (
            <div key={c.id} className="card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 8px' }}>{c.title}</h3>
              {c.description && (
                <p style={{ color: 'var(--muted)', margin: '0 0 12px' }}>
                  {c.description.length > 140 ? c.description.slice(0, 140) + '…' : c.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {c.difficulty && (
                  <span style={{ padding: '6px 10px', background: 'rgba(108,140,255,0.12)', borderRadius: 8, fontSize: 12 }}>{c.difficulty}</span>
                )}
                {c.duration && (
                  <span style={{ padding: '6px 10px', background: 'rgba(108,140,255,0.12)', borderRadius: 8, fontSize: 12 }}>{c.duration}</span>
                )}
                {c.price && (
                  <span style={{ padding: '6px 10px', background: 'rgba(108,140,255,0.12)', borderRadius: 8, fontSize: 12 }}>{c.price}</span>
                )}
              </div>
              <Link to={`/course-detail/${c.id}`} className="nav-link" style={{ display: 'inline-block' }}>
                Continue
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // (Dashboard removed) Default authenticated landing handled via routes below

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    
    // Prevent body scroll when mobile menu is open
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Handle loader completion
  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  // Cleanup body class on component unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  // Close mobile menu on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Show loader while loading
  if (isLoading) {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="AI E-Learning Home">
            <span className="brand-logo" aria-hidden>AI</span>
            <span className="brand-text">E‑Learning & Proctor</span>
          </Link>
          
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`} aria-label="Primary">
            {mobileMenuOpen && (
              <button 
                className="mobile-menu-close"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                ✕
              </button>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
                <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link>
                <Link to="/features" className="nav-link" onClick={closeMobileMenu}>Features</Link>
                <Link to="/interview-practice" className="nav-link" onClick={closeMobileMenu}>AI Interview</Link>
                <Link to="/courses" className="nav-link" onClick={closeMobileMenu}>Courses</Link>
                <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>Profile</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
                <Link to="/signup" className="nav-link" onClick={closeMobileMenu}>Sign Up</Link>
              </>
            )}
          </nav>
          {mobileMenuOpen && (
            <div className="mobile-nav-backdrop" onClick={closeMobileMenu} />
          )}
        </div>
      </header>
      <main className="app-main">
        <Routes>
          {/* Public + Auth Home */}
          <Route path="/" element={isAuthenticated ? <AuthHome /> : <Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" replace />} />
          <Route path="/features" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/interview-practice" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/domain-selection" element={isAuthenticated ? <DomainSelectionPage /> : <Navigate to="/login" replace />} />
          <Route path="/course-recommendations" element={isAuthenticated ? <CourseRecommendations /> : <Navigate to="/login" replace />} />
          <Route path="/course-detail/:courseId" element={isAuthenticated ? <CourseDetail /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuthenticated ? <EnrolledProfile /> : <Navigate to="/login" replace />} />
          
          {/* Direct routes for main sections */}
          <Route path="/courses" element={isAuthenticated ? <CourseRecommendations /> : <Navigate to="/login" replace />} />
          <Route path="/assessment" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/career-guidance" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/certificates" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/all-courses" element={isAuthenticated ? <CourseRecommendations /> : <Navigate to="/login" replace />} />
          <Route path="/practice" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/interview" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/progress" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
