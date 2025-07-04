import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    birthdate: '',
    contact: '',
    photo: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [location]); // Important: reloads profile when route changes

  const fetchProfile = async () => {
    setLoading(true);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      navigate('/login');
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      const newProfile = {
        name: profileData.name || '',
        email: profileData.email || user.email || '',
        age: profileData.age || '',
        birthdate: profileData.birthdate || '',
        contact: profileData.contact || '',
        photo: profileData.photo || ''
      };

      setProfile(newProfile);

      const isComplete =
        newProfile.name &&
        newProfile.email &&
        newProfile.age &&
        newProfile.birthdate &&
        newProfile.contact;

      setShowForm(!isComplete);
      if (!isComplete) setMessage('⚠️ Please complete your profile.');
    }

    const { count: followers } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user.id);

    const { count: following } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', user.id);

    setFollowerCount(followers || 0);
    setFollowingCount(following || 0);
    setLoading(false);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;

    const updates = {
      id: user.id,
      name: profile.name,
      email: profile.email,
      age: profile.age === '' ? null : Number(profile.age),
      birthdate: profile.birthdate === '' ? null : profile.birthdate,
      contact: profile.contact,
      photo: profile.photo,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert('❌ Failed to save profile: ' + error.message);
    } else {
      alert('✅ Profile updated successfully!');
      setMessage('');
      setShowForm(false);
      fetchProfile(); // reload profile
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('⚠️ Are you sure you want to delete your account?');
    if (!confirmed || !user) return;

    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();

    alert('✅ Account deleted.');
    navigate('/signup');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  if (showForm) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">My Account</h2>

        {message && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <input type="text" name="name" placeholder="Name" value={profile.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input type="text" name="email" placeholder="Email" value={profile.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input type="number" name="age" placeholder="Age" value={profile.age} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input type="date" name="birthdate" value={profile.birthdate} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input type="text" name="contact" placeholder="Contact Number" value={profile.contact} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input type="text" name="photo" placeholder="Profile Photo URL" value={profile.photo} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Save & Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow bg-white relative">
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 hover:text-black text-2xl">⋮</button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 text-left">
            <button onClick={() => setShowForm(true)} className="block w-full px-4 py-2 hover:bg-gray-100">✏️ Edit Profile</button>
            <button onClick={handleLogout} className="block w-full px-4 py-2 hover:bg-gray-100">🔓 Log Out</button>
            <button onClick={handleDeleteAccount} className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100">🗑️ Delete Account</button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-green-600">Welcome, {profile.name} 👋</h2>

      <div className="flex justify-center mb-4">
        <img src={profile.photo || '/default-avatar.png'} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-green-500" />
      </div>

      <p className="text-lg mb-1">Email: <strong>{profile.email}</strong></p>

      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div>
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => navigate('/following')}>Following</button>
          <p className="text-sm text-gray-700 mt-1">{followingCount} following</p>
        </div>
        <div>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={() => navigate('/followers')}>Followers</button>
          <p className="text-sm text-gray-700 mt-1">{followerCount} followers</p>
        </div>
      </div>

      <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => navigate('/myposts')}>
        📌 Added Post Name
      </button>
    </div>
  );
};

export default MyAccount;
