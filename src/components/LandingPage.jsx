import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-slide {
          animation: fadeSlide 1s ease-out;
        }
      `}</style>

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-5 bg-white shadow-md sticky top-0 z-50">
        <div className="text-xl font-bold text-indigo-600">🌱 Grow With Me</div>
        <nav className="flex gap-6">
          <Link to="/" className="text-gray-800 font-medium hover:text-indigo-500 transition">Home</Link>
          <Link to="/signup" className="text-gray-800 font-medium hover:text-indigo-500 transition">Sign Up</Link>
          <Link to="/login" className="text-gray-800 font-medium hover:text-indigo-500 transition">Login</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="text-center py-20 px-4 flex-1 fade-slide">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Grow a Skill. Share Your Journey.</h1>
        <h2 className="text-2xl text-gray-600 mb-10">Pick a Skill to Get Started</h2>

        <div className="flex flex-wrap justify-center gap-6">
          {['Coding', 'Cooking', 'Fitness', 'Guitar'].map((skill, index) => (
            <Link
              key={skill}
              to="/signup"
              className="px-6 py-3 text-lg text-white bg-indigo-500 rounded-xl shadow-md hover:bg-indigo-600 transform transition duration-300"
              style={{ animationDelay: `${index * 0.2}s`, animation: 'fadeSlide 1s ease-out both' }}
            >
              {skill}
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p className="text-sm mb-2">© {new Date().getFullYear()} Grow With Me. All rights reserved.</p>
        <div className="flex justify-center gap-4 flex-wrap text-sm">
          <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
          <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
