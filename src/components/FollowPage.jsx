import React, { useState } from 'react';

const FollowPage = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(120);
  const [following] = useState(75);
  const [comment, setComment] = useState('');
  const [reaction, setReaction] = useState(null);
  const [encouraged, setEncouraged] = useState(false);

  const toggleFollow = () => {
    setIsFollowing((prev) => {
      setFollowers((f) => f + (prev ? -1 : 1));
      return !prev;
    });
  };

  const handleEncouragement = () => {
    setEncouraged(true);
    setTimeout(() => setEncouraged(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-2xl text-center space-y-5 animate-fade-in">
        {/* Add Post */}
        <button className="absolute top-4 right-4 text-xs px-3 py-1 bg-black text-white rounded-full hover:scale-105 transition">
          + Add Post
        </button>

        {/* Username */}
        <h2 className="text-2xl font-bold text-gray-800">👤 John Doe</h2>

        {/* Followers / Following */}
        <div className="flex justify-around text-sm text-gray-600">
          <span><strong>{followers}</strong> Followers</span>
          <span><strong>{following}</strong> Following</span>
        </div>

        {/* Follow / Unfollow */}
        <button
          onClick={toggleFollow}
          className={`w-full py-2 rounded-full font-medium transition duration-300 shadow-sm border ${
            isFollowing
              ? 'bg-white text-black border-gray-400 hover:bg-gray-100'
              : 'bg-black text-white border-transparent hover:bg-gray-800'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        {/* Edit Profile */}
        {isFollowing && (
          <button className="text-sm text-blue-600 underline hover:text-blue-800">
            Edit Profile
          </button>
        )}

        {/* Emoji Reactions */}
        <div className="space-x-3 mt-2 text-xl">
          <span className="text-base text-gray-700">React:</span>
          {['❤️', '🔥', '👏', '😊'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setReaction(emoji)}
              className="hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {reaction && (
          <p className="text-sm text-gray-600 mt-1">You reacted: {reaction}</p>
        )}

        {/* Comment Input */}
        <textarea
          className="w-full border rounded-lg p-2 text-sm resize-none focus:ring focus:ring-blue-300"
          placeholder="💬 Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
        />

        {/* Encouragement */}
        <button
          onClick={handleEncouragement}
          className="w-full py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-full font-semibold hover:opacity-90 transition"
        >
          💌 Send Encouragement
        </button>

        {encouraged && (
          <div className="text-pink-600 text-sm font-medium animate-bounce mt-2">
            Encouragement Sent!
          </div>
        )}
      </div>

      {/* Tailwind custom animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default FollowPage;
