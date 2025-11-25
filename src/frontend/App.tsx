import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.js';
import  DashboardPage  from './pages/DashboardPage.js';
import { TeamPage } from './pages/TeamPage.js';
import SignINPage from './components/signIn.js';
import { AuthCallback } from './components/AuthCallback.js';
import DocPage from './pages/DocPage.js';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/signin" element={<SignINPage />} />
        <Route path="/team/:teamid/doc/:docid" element={<DocPage/>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/team/:teamid" element={<TeamPage />} />
      </Routes>
    </Router>
    
  );
};

export default App;
