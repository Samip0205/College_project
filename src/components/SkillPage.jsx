import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import cookingImg from '../assets/images/cooking.png';
import guitarImg from '../assets/images/guitar.png';
import codingImg from '../assets/images/coding.png';
import fitnessImg from '../assets/images/fitness.png';
import designImg from '../assets/images/design.png';
import photographyImg from '../assets/images/photography.png';
import musicImg from '../assets/images/music.png';

const skillContent = {
  coding: {
    title: 'Learn to Code',
    description: 'Master web development, data structures, and algorithms.',
    image: codingImg,
    tips: ['Practice daily on LeetCode', 'Build full-stack projects', 'Contribute to open source'],
    youtube: ['https://www.youtube.com/watch?v=PoRJizFvM7s']
  },
  cooking: {
    title: 'Cooking Skills',
    description: 'Explore cuisines and improve your kitchen techniques.',
    image: cookingImg,
    tips: ['Start with basics', 'Watch YouTube recipes', 'Try weekly meal plans'],
    youtube: ['https://youtu.be/P6W8kwmwcno']
  },
  guitar: {
    title: 'Play the Guitar',
    description: 'Learn chords, rhythm, and melodies.',
    image: guitarImg,
    tips: ['Practice 15 min daily', 'Use a metronome', 'Record your progress'],
    youtube: ['https://www.youtube.com/shorts/cHHUs9aQd-M?feature=share']
  },
  fitness: {
    title: 'Stay Fit',
    description: 'Improve your health with consistent exercise.',
    image: fitnessImg,
    tips: ['Bodyweight workouts', 'Track calories', 'Drink water'],
    youtube: ['https://www.youtube.com/watch?v=UBMk30rjy0o']
  },
  design: {
    title: 'Design Skills',
    description: 'Learn UI/UX principles and design tools.',
    image: designImg,
    tips: ['Use Figma', 'Analyze great UI', 'Join design communities'],
    youtube: ['https://www.youtube.com/watch?v=j6Ule7GXaRs']
  },
  photography: {
    title: 'Photography',
    description: 'Capture moments with better composition and lighting.',
    image: photographyImg,
    tips: ['Use natural light', 'Understand framing', 'Edit in Lightroom'],
    youtube: ['https://www.youtube.com/shorts/Dlr3vbUKF_I']
  },
  music: {
    title: 'Music',
    description: 'Explore instruments, vocals, and production.',
    image: musicImg,
    tips: ['Practice scales', 'Use recording tools', 'Write your own songs'],
    youtube: ['https://www.youtube.com/watch?v=n2z02J4fJwg&pp=ygUcbXVzaWMgdHV0b3JpYWwgZm9yIGJlZ2lubmVycw%3D%3D']
  },
};

const SkillPage = () => {
  const { skillName } = useParams();
  const navigate = useNavigate();
  const content = skillContent[skillName.toLowerCase()];

  if (!content) {
    return (
      <div className="text-center p-8 text-red-600">
        Skill not found. <br />
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">{content.title}</h1>
      <p className="text-gray-700 text-lg mb-6">{content.description}</p>

      <img
        src={content.image}
        alt={skillName}
        className="w-full h-130 object-cover rounded shadow mb-6"
      />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Watch Tutorial:</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {(Array.isArray(content.youtube) ? content.youtube : [content.youtube]).map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white text-lg font-medium rounded-full hover:bg-red-700 transition"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play Video {index + 1}</span>
            </a>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tips:</h2>
      <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
        {content.tips.map((tip, index) => (
          <li key={index}>✔️ {tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default SkillPage;
