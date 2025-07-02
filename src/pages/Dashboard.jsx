import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const tabs = ['Timeline', 'My Journal', 'Milestones', 'Skill Stats'];

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('Timeline');
  const [entries, setEntries] = useState([]);
  const [journal, setJournal] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [stats, setStats] = useState({ totalHours: 0, streak: 0 });
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: posts } = await supabase
        .from('progress_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: journalEntries } = await supabase
        .from('journal')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: milestoneData } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id);

      const { data: skillLogs } = await supabase
        .from('skill_logs')
        .select('*')
        .eq('user_id', user.id);

      setEntries(posts || []);
      setJournal(journalEntries || []);
      setMilestones(milestoneData || []);

      const totalHours = skillLogs?.reduce((sum, log) => sum + (log.hours || 0), 0) || 0;
      const streak = skillLogs?.filter((log) => {
        const logDate = new Date(log.date);
        const today = new Date();
        return logDate.toDateString() === today.toDateString();
      }).length > 0
        ? 1
        : 0;

      setStats({ totalHours, streak });
    };

    fetchData();
  }, []);

  // New useEffect to fetch followers with 'pending' status
  useEffect(() => {
    const fetchFollowers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: followers, error } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', user.id)
        .eq('status', 'pending'); // or use 'accepted' based on logic

      if (!error && followers) {
        setFollowers(followers.map((f) => f.follower_id));
      }
    };

    fetchFollowers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">👤 My Profile</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === tab
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-green-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 rounded shadow">
        {activeTab === 'Timeline' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">📅 Timeline View</h2>
            {entries.length === 0 ? (
              <p>No progress entries yet.</p>
            ) : (
              <ul className="space-y-4">
                {entries.map((entry) => (
                  <li key={entry.id} className="border p-3 rounded">
                    <h3 className="font-bold">{entry.skill}</h3>
                    <p>{entry.caption}</p>
                    {entry.media && <img src={entry.media} alt="entry media" className="mt-2 rounded" />}
                    <p className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'My Journal' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">📔 My Journal</h2>
            {journal.length === 0 ? (
              <p>No journal entries yet.</p>
            ) : (
              <ul className="space-y-3">
                {journal.map((j) => (
                  <li key={j.id} className="border p-3 rounded">
                    <h4 className="font-semibold">{j.title}</h4>
                    <p>{j.content}</p>
                    <p className="text-xs text-gray-400">Tags: {j.tags?.join(', ')}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'Milestones' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">🏆 Milestones</h2>
            {milestones.length === 0 ? (
              <p>No milestones yet.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestones.map((m) => (
                  <li key={m.id} className="border p-4 rounded bg-gray-50">
                    <h4 className="font-bold text-lg">{m.title}</h4>
                    <p>{m.description}</p>
                    <p className="text-xs text-gray-400">Achieved: {new Date(m.achieved_on).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'Skill Stats' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">📊 Skill Stats</h2>
            <p>Total Hours Invested: <strong>{stats.totalHours} hrs</strong></p>
            <p>Current Streak: <strong>{stats.streak} day(s)</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
