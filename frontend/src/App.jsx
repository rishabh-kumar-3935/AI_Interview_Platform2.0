import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header/header.jsx';
import Login from './pages/login';
import Signup from './pages/signup';
import MainLayout from './layouts/mainlayout.jsx';
import Profile from './pages/profile.jsx';
import AIInterview from './pages/ai_interview.jsx';
import ResumeAnalyzer from './pages/resume_analyzer.jsx';
import ExplainConcept from './pages/explainconcept.jsx';
import Home from './pages/home.jsx';
import LandingPage from './pages/landingPage.jsx';

function App() {
  const isLoggedIn = useSelector((state) => state.auth.status);
  const location = useLocation();
  const showHeader = !isLoggedIn && ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/ai_interview" element={isLoggedIn ? <AIInterview /> : <Navigate to="/login" replace />} />
          <Route path="/resume_analyzer" element={isLoggedIn ? <ResumeAnalyzer /> : <Navigate to="/login" replace />} />
          <Route path="/explain_concept" element={isLoggedIn ? <ExplainConcept /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
