import './App.css';
import { FilePage } from './pages/FilePage.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { TeamPage } from './pages/TeamPage.js';
import { SignInPage } from './pages/SignInPage.js';
import { AuthCallback } from './components/AuthCallback.js';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/team/:teamid/doc/:docid" element={<FilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/team/:teamid" element={<TeamPage />} />
      </Routes>
    </Router>
  );
};

export default App;
