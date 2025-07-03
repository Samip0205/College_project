import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

const Explore = () => {
  const [userId, setUserId] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
    };

    fetchPosts();
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

  const filteredPosts = posts.filter((post) => {
    const skillMatch = filters.skill ? post.skill?.includes(filters.skill) : true;
    const moodMatch = filters.mood ? post.mood?.includes(filters.mood) : true;
    const durationMatch = filters.duration
      ? new Date(post.created_at) >= new Date(Date.now() - filters.duration * 24 * 60 * 60 * 1000)
      : true;
    return skillMatch && moodMatch && durationMatch;
  });

  const renderPostCard = (post) => {
    const profile = profiles.find((p) => p.id === post.user_id);
    if (!profile) return null;

    const isFollowing = followingIds.includes(profile.id);

    return (
      <div key={post.id} className="border rounded-lg p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src={profile.photo || '/default-avatar.png'}
            alt={profile.name}
            className="w-14 h-14 object-cover rounded-full border border-green-400"
          />
          <div>
            <h3 className="font-bold text-lg">{profile.name}</h3>
            <p className="text-sm text-gray-600">{post.skill || 'No Skill'}</p>
            <p className="text-xs italic text-gray-500">{post.mood || 'No Mood'}</p>
          </div>
        </div>

        <div className="mt-4 border-t pt-2 text-sm">
          <p><strong>📝 Caption:</strong> {post.caption}</p>
          {post.media_url && post.entry_type === 'image' && (
            <img
              src={post.media_url}
              alt="post"
              className="mt-2 rounded w-full h-48 object-cover"
            />
          )}
          {post.media_url && post.entry_type === 'video' && (
            <video
              src={post.media_url}
              controls
              className="mt-2 rounded w-full"
            />
          )}
        </div>

        <button
          onClick={() => handleFollow(profile.id)}
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
          <option value="">Select a skill</option>
          <option value="Coding">Coding</option>
          <option value="Design">Design</option>
          <option value="Cooking">Cooking</option>
          <option value="Photography">Photography</option>
          <option value="Music">Music</option>
          <option value="Guitar">Guitar</option>
          <option value="Fitness">Fitness</option>
        </select>

        <select name="mood" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Select mood</option>
          <option value="Motivated">Motivated</option>
          <option value="Chill">Chill</option>
          <option value="Focused">Focused</option>
        </select>

        <select name="duration" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Select duration</option>
          <option value="7">1 week</option>
          <option value="14">2 weeks </option>
          <option value="30">1 mo </option>
        </select>
      </div>

      <div ref={filterSectionRef} className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">🔍 Filtered Progress Posts</h2>
        {filteredPosts.length === 0 ? (
          <p className="text-gray-500">No matches found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map(renderPostCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
