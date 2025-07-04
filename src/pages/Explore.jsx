// src/pages/Explore.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ skill: '', mood: '', duration: '' });

  const skills = ['Coding', 'Guitar', 'Design', 'Cooking', 'Fitness', 'Photography', 'Music'];
  const moods = ['Motivated', 'Chill', 'Focused'];
  const durations = ['7', '14', '30'];

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getDurationDate = () => {
    const now = new Date(); 
    if (filters.duration) {
      now.setDate(now.getDate() - parseInt(filters.duration));
    }
    return now.toISOString();
  };

  const fetchFilteredPosts = async () => {
    let query = supabase
      .from('posts')
      .select('*, profiles(name, photo)')
      .eq('is_public', true);

    if (filters.skill) query = query.eq('skill', filters.skill);
    if (filters.mood) query = query.eq('mood', filters.mood);
    if (filters.duration) query = query.gte('created_at', getDurationDate());

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error) setPosts(data);
    else console.error('Error fetching filtered posts:', error);
  };

  useEffect(() => {
    fetchFilteredPosts();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">🔍 Explore Progress Posts</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          name="skill"
          value={filters.skill}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Skill</option>
          {skills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>

        <select
          name="mood"
          value={filters.mood}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Mood</option>
          {moods.map((mood) => (
            <option key={mood} value={mood}>{mood}</option>
          ))}
        </select>

        <select
          name="duration"
          value={filters.duration}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Duration</option>
          {durations.map((duration) => (
            <option key={duration} value={duration}>{duration} Days</option>
          ))}
        </select>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts found matching filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg shadow bg-white">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={post.profiles?.photo || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold text-gray-800">{post.profiles?.name}</span>
              </div>

              {/* Post Content */}
              <h3 className="text-green-600 font-semibold">{post.skill}</h3>
              <p className="text-sm text-gray-700 mb-2">{post.caption}</p>

              {post.media_url && (
                post.media_url.includes('.mp4') ? (
                  <video src={post.media_url} controls className="w-full rounded" />
                ) : (
                  <img src={post.media_url} alt="Media" className="w-full rounded" />
                )
              )}

              <p className="text-xs text-gray-500 mt-2">Mood: {post.mood}</p>
              <p className="text-xs text-gray-500">Posted: {new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
