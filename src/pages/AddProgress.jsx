import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AddProgress = () => {
  const [skills] = useState(['Coding', 'Guitar', 'Design', 'Cooking', 'Fitness', 'Photography', 'Music']);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [entryType, setEntryType] = useState('text');
  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mediaUrl = entryType === 'url' ? mediaUrlInput : null;

    const { error } = await supabase.from('posts').insert([
      {
        user_id: userId,
        skill: selectedSkill,
        entry_type: entryType,
        caption,
        mood,
        duration,
        media_url: mediaUrl,
        is_public: true, // 👈 Explore માટે જરૂરી છે
      },
    ]);

    if (!error) {
      alert('🎉 Progress posted!');
      setCaption('');
      setMood('');
      setMediaUrlInput('');
      setSelectedSkill('');
      setDuration('');
      setEntryType('text');
    } else {
      alert('⚠️ Error adding post');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Add Weekly Progress</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill */}
          <div>
            <label className="block font-semibold mb-1">Skill</label>
            <select
              required
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select a skill</option>
              {skills.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Mood */}
          <div>
            <label className="block font-semibold mb-1">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Mood</option>
              <option value="Motivated">Motivated</option>
              <option value="Chill">Chill</option>
              <option value="Focused">Focused</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block font-semibold mb-1">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Duration</option>
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
              <option value="30">1 month</option>
            </select>
          </div>

          {/* Entry Type */}
          <div>
            <label className="block font-semibold mb-1">Entry Type</label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="text">Text</option>
              <option value="url">Image/Video (via URL)</option>
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block font-semibold mb-1">Caption</label>
            <textarea
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your progress..."
              className="w-full border border-gray-300 p-3 rounded-md"
              rows={4}
            />
          </div>

          {/* Media URL input */}
          {entryType === 'url' && (
            <div>
              <label className="block font-semibold mb-1">Media URL</label>
              <input
                type="url"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                className="w-full border p-2 rounded-md"
                placeholder="Paste image or video URL here"
              />
              {mediaUrlInput && (
                <div className="mt-2">
                  {mediaUrlInput.includes('.mp4') ? (
                    <video src={mediaUrlInput} controls className="w-full rounded" />
                  ) : (
                    <img src={mediaUrlInput} alt="Preview" className="w-full rounded" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700"
          >
            Post Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProgress;
