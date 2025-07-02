import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

const Explore = () => {
  const [userId, setUserId] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [filters, setFilters] = useState({ skill: '', mood: '', duration: '' });
  const filterSectionRef = useRef(null);

  useEffect(() => {
    const fetchExploreData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      setProfiles(allProfiles || []);

      const { data: following } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id)
        .eq('status', 'pending');

      setFollowingIds(following.map((f) => f.following_id));
    };

    fetchExploreData();
  }, []);

  useEffect(() => {
    const fetchFollowers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: followers, error } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', user.id)
        .eq('status', 'pending');

      if (!error && followers) {
        setFollowers(followers.map(f => f.follower_id));
      }
    };

    fetchFollowers();
  }, []);

  const handleFollow = async (targetId) => {
    if (!userId || followingIds.includes(targetId)) return;

    const { error } = await supabase.from('follows').insert([
      {
        follower_id: userId,
        following_id: targetId,
        status: 'pending',
        message: 'You have a new follow request.',
      },
    ]);

    if (!error) {
      setFollowingIds((prev) => [...prev, targetId]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    setTimeout(() => {
      filterSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newThisWeek = profiles.filter((p) => new Date(p.created_at) > oneWeekAgo);
  const trending = profiles.slice(0, 5);
  const localGrowers = profiles;

  const filteredProfiles = profiles.filter((p) => {
    const skillMatch = filters.skill ? p.skill?.includes(filters.skill) : true;
    const moodMatch = filters.mood ? p.mood?.includes(filters.mood) : true;
    const durationMatch = filters.duration
      ? new Date(p.created_at) >= new Date(Date.now() - filters.duration * 24 * 60 * 60 * 1000)
      : true;
    return skillMatch && moodMatch && durationMatch;
  });

  const renderUserCard = (user) => {
    const isFollowing = followingIds.includes(user.id);

    return (
      <div key={user.id} className="border rounded-lg p-4 bg-white shadow-md">
        <img
          src={user.photo || '/default-avatar.png'}
          alt={user.name}
          className="w-full h-36 object-cover rounded"
        />
        <h3 className="mt-3 font-bold text-lg">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.skill || 'No Skill'}</p>
        <p className="text-xs italic text-gray-500">{user.mood || 'No Mood'}</p>
        <button
          onClick={() => handleFollow(user.id)}
          className={`mt-3 w-full py-1 rounded ${
            isFollowing
              ? 'bg-gray-300 text-gray-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow +'}
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">🌱 Explore</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select name="skill" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Skills</option>
          <option value="Coding">Coding</option>
          <option value="Design">Design</option>
          <option value="Cooking">Cooking</option>
          <option value="Photography">Photography</option>
          <option value="Music">Music</option>
          <option value="Guitar">Guitar</option>
          <option value="Fitness">Fitness</option>
        </select>

        <select name="mood" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Moods</option>
          <option value="Motivated">Motivated</option>
          <option value="Chill">Chill</option>
          <option value="Focused">Focused</option>
        </select>

        <select name="duration" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Any Duration</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      {filters.skill || filters.mood || filters.duration ? (
        <>
          <div ref={filterSectionRef} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🔍 Filtered Results</h2>
            {filteredProfiles.length === 0 ? (
              <p className="text-gray-500">No matches found for selected filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map(renderUserCard)}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🌿 Local Growers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localGrowers.map(renderUserCard)}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🆕 New This Week</h2>
            {newThisWeek.length === 0 ? (
              <p className="text-gray-500">No new users this week.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {newThisWeek.map(renderUserCard)}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🔥 Trending Journeys</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.map(renderUserCard)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;
