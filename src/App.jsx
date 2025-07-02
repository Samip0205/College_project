
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import AddProgress from './pages/AddProgress';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyAccount from './pages/MyAccount';
import SkillPage from './components/SkillPage';


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <Router>
      <Navbar setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-progress" element={<AddProgress />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<MyAccount />} />
       <Route path="/skills/:skillName" element={<SkillPage />} />
      </Routes>
    </Router>
  );
}

export default App;
