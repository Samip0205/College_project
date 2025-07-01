import React, { useState } from 'react';

const AddProgress = () => {
  const [skill, setSkill] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Progress added for: ${skill}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Add Progress</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Skill</option>
          <option value="Cooking">Cooking</option>
          <option value="Guitar">Guitar</option>
          <option value="Coding">Coding</option>
          <option value="Fitness">Fitness</option>
          <option value="Design">Design</option>
          <option value="Photography">Photography</option>
          <option value="Music">Music</option>

        </select>

        <textarea
          placeholder="Write your progress..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProgress;
