import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login'; 
import ProfileDashboard from './components/ProfileDashboard';
import ProgressPost from './components/ProgressPost';
import Explore from './components/Explore';
import FollowPage from './components/FollowPage';

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
         <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProfileDashboard />} />
        <Route path="/add-progress" element={<ProgressPost />} /> 
        <Route path="/explore" element={<Explore/>} />
        <Route path="/follow" element={<FollowPage />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
 
export default App;