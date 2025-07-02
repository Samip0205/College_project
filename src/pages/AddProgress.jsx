import React, { useState } from 'react';

const AddProgress = () => {
  const [progress, setProgress] = useState({
    skill: '',
    description: '',
    date: '',
    attachment: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'attachment' && files && files[0]) {
      const file = files[0];
      setProgress({ ...progress, attachment: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setProgress({ ...progress, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!progress.skill || !progress.description || !progress.date) {
      alert("Please fill all required fields.");
      return;
    }

    const stored = JSON.parse(localStorage.getItem('progressData')) || [];
    const newEntry = {
      ...progress,
      id: Date.now(),
      attachment: preview || null,
    };

    localStorage.setItem('progressData', JSON.stringify([...stored, newEntry]));
    alert("Progress added successfully!");

    setProgress({
      skill: '',
      description: '',
      date: '',
      attachment: null,
    });
    setPreview(null);
  };

  const handleClear = () => {
    setProgress({ skill: '', description: '', date: '', attachment: null });
    setPreview(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Add Skill Progress</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="skill"
            value={progress.skill}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
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
            name="description"
            value={progress.description}
            onChange={handleChange}
            placeholder="Describe what you practiced or learned..."
            rows="4"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="date"
            name="date"
            value={progress.date}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (optional):</label>
            <input
              type="file"
              name="attachment"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-100 file:text-green-700 file:rounded-md"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover border rounded shadow"
              />
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Save Progress
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgress;
