import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const skillsList = ['Coding', 'Writing', 'Design', 'Guitar', 'Photography'];

const ProgressPost = () => {
  const [skill, setSkill] = useState('');
  const [entryType, setEntryType] = useState('text');
  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('');
  const [media, setMedia] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [animationClass, setAnimationClass] = useState('fade-in');

  const navigate = useNavigate();

  useEffect(() => {
    setAnimationClass('fade-in');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      skill,
      entryType,
      caption,
      mood,
      media,
      isPublic,
    };

    console.log('Weekly Progress Submitted:', postData);
    navigate('/explore');
  };

  return (
    <div className={`max-w-xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md font-sans ${animationClass}`}>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fade-in 0.5s ease forwards;
        }
      `}</style>

      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">📝 Add Weekly Progress</h2>

      <form onSubmit={handleSubmit}>
        {/* Skill */}
        <label className="block font-semibold mb-1">Select Skill</label>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        >
          <option value="">-- Choose Skill --</option>
          {skillsList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Entry Type */}
        <label className="block font-semibold mb-1">Entry Type</label>
        <select
          value={entryType}
          onChange={(e) => setEntryType(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>

        {/* Caption */}
        <label className="block font-semibold mb-1">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What did you do or achieve?"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Mood */}
        <label className="block font-semibold mb-1">Mood (optional emoji or words)</label>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g. 😊 Focused"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Upload */}
        {(entryType === 'image' || entryType === 'video') && (
          <>
            <label className="block font-semibold mb-1">Upload {entryType}</label>
            <input
              type="file"
              accept={entryType === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => setMedia(e.target.files[0])}
              className="w-full mb-4"
            />
          </>
        )}

        {/* Public / Private */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            {isPublic ? 'Visible to everyone' : 'Private entry'}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Submit Progress
        </button>
      </form>
    </div>
  );
};

export default ProgressPost;
