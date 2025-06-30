import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = ['Timeline', 'My Journal', 'Milestones', 'Skill Stats'];

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('Timeline');
  const [animationClass, setAnimationClass] = useState('fade-in');
  const navigate = useNavigate();

  const switchTab = (tab) => {
    setAnimationClass('fade-out');
    setTimeout(() => {
      setActiveTab(tab);
      setAnimationClass('fade-in');
    }, 300);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Timeline':
        return (
          <div>
            <div className={`dashboard-card ${animationClass}`}>
              <p>🏅 <strong>Week 1:</strong> Wrote blog + learned CSS</p>
              <img
                src="https://via.placeholder.com/200"
                alt="week"
                className="mt-3 rounded-lg w-full max-w-xs"
              />
            </div>
            <div className={`dashboard-card ${animationClass}`}>
              <p>📹 <strong>Week 2:</strong> Uploaded practice video</p>
              <video controls className="mt-3 rounded-lg w-full max-w-xs">
                <source src="sample-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        );
      case 'My Journal':
        return (
          <div>
            <div className={`dashboard-card ${animationClass}`}>
              <p><strong>Entry:</strong> First draft finished 🎉</p>
              <p>Tags: #writing #focus</p>
            </div>
            <div className={`dashboard-card ${animationClass}`}>
              <p><strong>Entry:</strong> Burnout hit today. Took rest.</p>
              <p>Tags: #mentalhealth</p>
            </div>
          </div>
        );
      case 'Milestones':
        return (
          <div>
            <div className={`dashboard-card ${animationClass}`}>
              <p>🏆 <strong>10-day streak!</strong> Skill: Design</p>
            </div>
            <div className={`dashboard-card ${animationClass}`}>
              <p>✅ <strong>Submitted first article</strong> Skill: Writing</p>
            </div>
          </div>
        );
      case 'Skill Stats':
        return (
          <div>
            <div className={`dashboard-card ${animationClass}`}>
              <p><strong>Coding:</strong> 20 hrs | 🔥 Streak: 6 days</p>
              <p><strong>Writing:</strong> 10 hrs | 🔥 Streak: 4 days</p>
              <p><strong>Design:</strong> 12 hrs | 🔥 Streak: 5 days</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-xl shadow-lg font-sans">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
        .fade-in { animation: fade-in 0.4s ease forwards; }
        .fade-out { animation: fade-out 0.3s ease forwards; }
      `}</style>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">📊 Profile Dashboard</h2>

      <div className="flex justify-center flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>{renderContent()}</div>

      <button
        onClick={() => navigate('/add-progress')}
        className="w-full mt-8 py-3 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
      >
        Submit Weekly Progress
      </button>
    </div>
  );
};

export default ProfileDashboard;
