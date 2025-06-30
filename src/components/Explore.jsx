import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate

const ExplorePage = () => {
  const [skillFilter, setSkillFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [entries, setEntries] = useState([]);

  const navigate = useNavigate(); // ✅ initialize navigate

  useEffect(() => {
    const fakeEntries = [
      { id: 1, title: '30 Days of Coding', user: 'Alice', skill: 'Coding', duration: '30', mood: 'Motivated', type: 'trending' },
      { id: 2, title: 'Guitar Journey 🎸', user: 'Bob', skill: 'Guitar', duration: '15', mood: 'Relaxed', type: 'local' },
      { id: 3, title: 'New Fitness Routine', user: 'Carla', skill: 'Fitness', duration: '7', mood: 'Energetic', type: 'new' },
      { id: 4, title: 'Cooking Challenge 🍳', user: 'Dave', skill: 'Cooking', duration: '21', mood: 'Focused', type: 'trending' },
    ];
    setEntries(fakeEntries);
  }, []);

  const filteredEntries = entries.filter(entry => {
    return (
      (!skillFilter || entry.skill === skillFilter) &&
      (!durationFilter || entry.duration === durationFilter) &&
      (!moodFilter || entry.mood === moodFilter)
    );
  });

  const handleSubmit = () => {
    navigate('/follow'); // ✅ navigate to Follow page
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🌍 Explore Journeys</h1>

      {/* Filter Bar */}
      <div style={styles.filters}>
        <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} style={styles.select}>
          <option value="">Filter by Skill</option>
          <option value="Coding">Coding</option>
          <option value="Guitar">Guitar</option>
          <option value="Fitness">Fitness</option>
          <option value="Cooking">Cooking</option>
        </select>

        <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} style={styles.select}>
          <option value="">Duration</option>
          <option value="7">7 days</option>
          <option value="15">15 days</option>
          <option value="21">21 days</option>
          <option value="30">30 days</option>
        </select>

        <select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)} style={styles.select}>
          <option value="">Mood</option>
          <option value="Motivated">Motivated</option>
          <option value="Relaxed">Relaxed</option>
          <option value="Energetic">Energetic</option>
          <option value="Focused">Focused</option>
        </select>
      </div>

      {/* Sections */}
      <Section title="🔥 Trending Journeys" entries={filteredEntries.filter(e => e.type === 'trending')} />
      <Section title="🧑‍🌾 Local Growers" entries={filteredEntries.filter(e => e.type === 'local')} />
      <Section title="🆕 New This Week" entries={filteredEntries.filter(e => e.type === 'new')} />

      {/* ✅ Submit Button */}
      <button onClick={handleSubmit} style={styles.submitBtn}>
        Continue to Follow ➡️
      </button>
    </div>
  );
};

const Section = ({ title, entries }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <div style={styles.cardContainer}>
      {entries.length ? (
        entries.map((entry) => (
          <div key={entry.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{entry.title}</h3>
            <p style={styles.cardMeta}>By {entry.user}</p>
            <p style={styles.cardMeta}>Skill: {entry.skill}</p>
            <p style={styles.cardMeta}>Mood: {entry.mood}</p>
          </div>
        ))
      ) : (
        <p style={styles.noData}>No journeys found.</p>
      )}
    </div>
  </div>
);

const styles = {
  page: {
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#111827',
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#1f2937',
  },
  cardContainer: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    flex: '1 1 220px',
  },
  cardTitle: {
    fontSize: '18px',
    marginBottom: '5px',
  },
  cardMeta: {
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '4px',
  },
  noData: {
    color: '#9ca3af',
  },
  submitBtn: {
    marginTop: '30px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#4F46E5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default ExplorePage;
