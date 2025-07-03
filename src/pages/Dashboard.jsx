import React, { useState } from 'react';

const tabs = ['Timeline', 'My Journal', 'Milestones', 'Skill Stats'];

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('Timeline');

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex gap-4 mb-6 border-b pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`font-semibold ${activeTab === tab ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'Timeline' && <p>Weekly entries with media & badges</p>}
        {activeTab === 'My Journal' && <p>Long-form or short entries with tags</p>}
        {activeTab === 'Milestones' && <p>Auto-generated milestones</p>}
        {activeTab === 'Skill Stats' && <p>Time invested, streaks, charts</p>}
      </div>
    </div>
  );
};

export default ProfileDashboard;
