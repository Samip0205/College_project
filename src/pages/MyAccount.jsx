import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MyAccount = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    birthdate: '',
    contact: '',
    photo: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      navigate('/login');
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      const profileData = {
        name: data.name || '',
        email: data.email || user.email || '',
        age: data.age || '',
        birthdate: data.birthdate || '',
        contact: data.contact || '',
        photo: data.photo || '',
      };

      setProfile(profileData);

      const isComplete =
        profileData.name &&
        profileData.email &&
        profileData.age &&
        profileData.birthdate &&
        profileData.contact;

      setStep(isComplete ? 2 : 1);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${user.id}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return;
    }

    const { data: publicURL } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const imageUrl = `${publicURL.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ photo: imageUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to save image to profile:', updateError.message);
    }

    await fetchProfile();
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ photo: '', updated_at: new Date().toISOString() })
      .eq('id', user.id);
    await fetchProfile();
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
      setStep(2);
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

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow bg-white relative">
        {/* 3-dot menu */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-black text-2xl"
            >
              &#x22EE;
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 text-left">
                <button
                  onClick={() => {
                    setStep(1);
                    setMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                >
                  🔓 Log Out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  🗑️ Delete Account
                </button>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-green-600">Welcome, {profile.name} 👋</h2>
        <img
          src={profile.photo || '/default-avatar.png'}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-green-500 mb-4"
        />
        <p className="text-lg mb-1">Email: <strong>{profile.email}</strong></p>

        {/* Followers and Following */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div>
            <button
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => navigate('/following')}
            >
              Following
            </button>
            <p className="text-sm text-gray-700 mt-1">{followingCount} following</p>
          </div>
          <div>
            <button
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => navigate('/followers')}
            >
              Followers
            </button>
            <p className="text-sm text-gray-700 mt-1">{followerCount} followers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">My Account</h2>

      {message && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          {message}
        </div>
      )}

      <div className="flex flex-col items-center mb-4">
        <img
          src={profile.photo || '/default-avatar.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
        />

        {!profile.photo ? (
          <label className="mt-2 text-blue-600 font-medium cursor-pointer">
            Add Photo
            <input
              type="text"
              onChange={handlePhotoUpload}
              className=""
            />
          </label>
        ) : (
          <div className="flex gap-4 mt-2">
            <label className="text-blue-600 font-medium cursor-pointer">
              Change Photo
              <input
                type="text"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleRemovePhoto}
              className="text-red-600 font-medium hover:underline"
            >
              Remove Photo
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={profile.age}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="date"
          name="birthdate"
          value={profile.birthdate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={profile.contact}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
