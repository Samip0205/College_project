import React from 'react';

const Home = ({ searchQuery }) => {
  const allSkills = ['Cooking', 'Guitar', 'Coding', 'Fitness', 'Design', 'Photography', 'Music'];


  const filteredSkills = searchQuery
    ? allSkills.filter(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSkills;

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-6">
        Welcome to Grow With Me
      </h1>
      <p className="text-gray-700 text-lg mb-8">
        Track your skills, share your journey, and grow with the community.
      </p>

      {filteredSkills.length === 0 ? (
        <p className="text-red-500 font-medium">
          No skills matched your search. Try another keyword like <strong>“Coding”</strong> or <strong>“Guitar”</strong>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredSkills.map(skill => (
            <div
              key={skill}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">{skill}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
