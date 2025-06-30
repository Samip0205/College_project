import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setSearchQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [photo, setPhoto] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/');
  };

  const handleSkillClick = (skill) => {
    if (skill === 'None') {
      setSearchQuery('');
      setSearchInput('');
    } else {
      setSearchQuery(skill);
      setSearchInput(skill);
    }
    navigate('/');
    setShowDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    navigate('/');
  };

  const skills = [
    'None', 'Cooking', 'Guitar', 'Coding', 'Fitness', 'Design', 'Photography', 'Music'
  ];

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedProfile?.photo) {
      setPhoto(storedProfile.photo);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-green-600">
            <Link to="/">Grow With Me</Link>
          </div>

          {/* Browse */}
          <div className="relative" ref={dropdownRef}>
            <span onClick={toggleDropdown} className="cursor-pointer text-gray-700 font-medium hover:text-green-600 flex items-center">
              Browse
              <span className={`ml-1 transform ${showDropdown ? 'rotate-180' : 'rotate-0'}`}>▼</span>
            </span>
            {showDropdown && (
              <ul className="absolute left-0 mt-2 w-44 bg-white border rounded shadow-md z-10">
                {skills.map((skill) => (
                  <li key={skill} onClick={() => handleSkillClick(skill)} className={`px-4 py-2 hover:bg-green-100 cursor-pointer ${skill === 'None' ? 'text-red-500 font-medium' : ''}`}>
                    {skill === 'None' ? 'None (Show All)' : skill}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border px-3 py-1 pr-8 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
              >
                ✖
              </button>
            )}
          </form>

          {/* Nav Links */}
          <Link to="/" className="hover:text-green-600 font-medium">Home</Link>
          <Link to="/explore" className="hover:text-green-600 font-medium">Explore</Link>
          <Link to="/dashboard" className="hover:text-green-600 font-medium">Dashboard</Link>
          <Link to="/add-progress" className="hover:text-green-600 font-medium">Add Progress</Link>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center space-x-4 text-gray-700 font-medium">
          {isLoggedIn ? (
            <>
              <Link to="/account" className="hover:text-green-600">My Account</Link>
              {photo && (
                <img
                  src={photo}
                  alt="DP"
                  className="w-8 h-8 rounded-full border-2 border-green-500"
                />
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-600">Login</Link>
              <Link to="/signup" className="hover:text-green-600">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={toggleMenu} className="md:hidden text-2xl font-bold">
          {isOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-3 text-gray-700 font-medium">
          <li>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border px-3 py-1 pr-8 rounded-md focus:ring-2 focus:ring-green-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                >
                  ✖
                </button>
              )}
            </form>
          </li>
          <li><Link to="/" onClick={toggleMenu} className="block hover:text-green-600">Home</Link></li>
          <li><Link to="/explore" onClick={toggleMenu} className="block hover:text-green-600">Explore</Link></li>
          <li><Link to="/dashboard" onClick={toggleMenu} className="block hover:text-green-600">Dashboard</Link></li>
          <li><Link to="/add-progress" onClick={toggleMenu} className="block hover:text-green-600">Add Progress</Link></li>
          {isLoggedIn ? (
            <li><Link to="/account" onClick={toggleMenu} className="block hover:text-green-600">My Account</Link></li>
          ) : (
            <>
              <li><Link to="/login" onClick={toggleMenu} className="block hover:text-green-600">Login</Link></li>
              <li><Link to="/signup" onClick={toggleMenu} className="block hover:text-green-600">Signup</Link></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
