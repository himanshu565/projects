import '../frontend/components/lib/index.css';
import { FilePage } from './pages/FilePage.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.js';
import  DashboardPage  from './pages/DashboardPage.js';
import { TeamPage } from './pages/TeamPage.js';
import SignINPage from './components/signIn.js';
import { AuthCallback } from './components/AuthCallback.js';
import HeroSection  from './components/hero-section.js';
import FeaturesSection  from './components/features-section.js';
import HowItWorksSection  from './components/HowItWorksSection.js';
import Header from './components/header.js';

const App: React.FC = () => {
  return (
    <Router>
      {/* <main>
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/signin" element={<SignINPage />} />
        <Route path="/team/:teamid/doc/:docid" element={<FilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/team/:teamid" element={<TeamPage />} />
      </Routes>
    </Router>
    
  );
};

export default App;
