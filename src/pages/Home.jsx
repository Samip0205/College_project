
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import cookingImg from '../assets/images/cooking.png';
import guitarImg from '../assets/images/guitar.png';
import codingImg from '../assets/images/coding.png';
import fitnessImg from '../assets/images/fitness.png';
import designImg from '../assets/images/design.png';
import photographyImg from '../assets/images/photography.png';
import musicImg from '../assets/images/music.png';
import communityImg from '../assets/images/community.png';

const skillImages = {
  Cooking: cookingImg,
  Guitar: guitarImg,
  Coding: codingImg,
  Fitness: fitnessImg,
  Design: designImg,
  Photography: photographyImg,
  Music: musicImg,
};

const Home = ({ searchQuery }) => {
  const navigate = useNavigate();

  const allSkills = ['Cooking', 'Guitar', 'Coding', 'Fitness', 'Design', 'Photography', 'Music'];

  const normalizedQuery = searchQuery?.toLowerCase().trim() || '';

  const matchedSkills =
    normalizedQuery === '' || normalizedQuery === 'all'
      ? allSkills
      : allSkills.filter(skill =>
          normalizedQuery
            .split(' ')
            .some(word => skill.toLowerCase().includes(word))
        );

  useEffect(() => {
    if (
      normalizedQuery &&
      normalizedQuery !== 'all' &&
      matchedSkills.length > 1 &&
      matchedSkills.length < allSkills.length
    ) {
      let index = 0;

      const interval = setInterval(() => {
        const nextSkill = matchedSkills[index].toLowerCase();
        navigate(`/skills/${nextSkill}`);
        index++;

        if (index >= matchedSkills.length) {
          clearInterval(interval); 
        }
      }, 2000); 

      return () => clearInterval(interval); 
    }

    
    if (
      normalizedQuery &&
      matchedSkills.length === 1 &&
      matchedSkills.length !== allSkills.length
    ) {
      const matchedSkill = matchedSkills[0].toLowerCase();
      navigate(`/skills/${matchedSkill}`);
    }
  }, [normalizedQuery, matchedSkills, navigate]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-6">
        Welcome to Grow With Me
      </h1>
      <p className="text-gray-700 text-lg mb-8">
        Track your skills, share your journey, and grow with the community.
      </p>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-8">
        <img
          src={communityImg}
          alt="Community"
          className="w-full h-[100vh] object-cover"
        />
      </div>

      {matchedSkills.length === 0 ? (
        <p className="text-red-500 font-medium">
          No skills matched your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {matchedSkills.map(skill => (
            <div
              key={skill}
              className="border p-4 rounded shadow hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/skills/${skill.toLowerCase()}`)}
            >
              <img
                src={skillImages[skill]}
                alt={skill}
                className="w-full h-60 object-cover rounded mb-4 transform transition duration-300 hover:scale-105 hover:brightness-110"
              />
              <h2 className="text-xl font-semibold text-gray-800">{skill}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
