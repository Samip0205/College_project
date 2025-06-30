import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const skillsList = ['Coding', 'Writing', 'Guitar', 'Cooking', 'Design', 'Photography'];

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [goal, setGoal] = useState('');
  const [skills, setSkills] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();

  const handleSkillChange = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else if (skills.length < 3) {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
      displayName,
      goal,
      skills,
      profilePic: profilePic ? profilePic.name : null,
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    console.log('User Signed Up:', user);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="w-full mb-4"
        />

        <textarea
          placeholder="Enter a short goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Choose up to 3 skills:</label>
          <div className="flex flex-wrap mt-2 gap-2">
            {skillsList.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillChange(skill)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  skills.includes(skill)
                    ? 'bg-green-400 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                } transition`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

       
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
