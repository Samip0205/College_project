import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ProgressPost = () => {
  const [skills, setSkills] = useState(['Coding', 'Guitar', 'Design', 'Cooking', 'Fitness']);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [entryType, setEntryType] = useState('text');
  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('');
  const [media, setMedia] = useState(null);
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

    let mediaUrl = null;

    if (media) {
      const fileExt = media.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, media);

      if (uploadError) {
        alert('Upload failed');
        return;
      }

      const { data: publicURL } = supabase.storage.from('posts').getPublicUrl(fileName);
      mediaUrl = publicURL.publicUrl;
    }

    const { error } = await supabase.from('posts').insert([
      {
        user_id: userId,
        skill: selectedSkill,
        entry_type: entryType,
        caption,
        mood,
        media_url: mediaUrl,
      },
    ]);

    if (!error) {
      alert('🎉 Post added successfully!');
      setCaption('');
      setMood('');
      setMedia(null);
      setSelectedSkill('');
    } else {
      alert('⚠️ Error adding post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Add Weekly Progress</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill Dropdown */}
          <div>
            <label className="block font-semibold mb-1">Skill</label>
            <select
              required
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a skill</option>
              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Entry Type */}
          <div>
            <label className="block font-semibold mb-1">Entry Type</label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
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
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
            />
          </div>

          {/* Mood */}
          <div>
            <label className="block font-semibold mb-1">Mood</label>
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="E.g., Excited, Struggling, Confident"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Media Upload */}
          {entryType !== 'text' && (
            <div>
              <label className="block font-semibold mb-1">Upload {entryType}</label>
              <input
                type="file"
                accept={entryType === 'image' ? 'image/*' : 'video/*'}
                onChange={(e) => setMedia(e.target.files[0])}
                className="w-full border p-2 rounded-md"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Post Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProgressPost;
