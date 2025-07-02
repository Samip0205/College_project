import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    birthdate: '',
    contact: '',
    photo: '',
  });

  useEffect(() => {
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

      if (error) {
        console.log('Profile fetch error:', error.message);
      }

      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email ||'',
          age: data.age || '',
          birthdate: data.birthdate || '',
          contact: data.contact || '',
          photo: data.photo || '',
        });

        if (!data.name || !data.age || !data.birthdate || !data.contact) {
          setMessage('⚠️ Please complete your profile.');
        } else {
          setMessage('');
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const fileName = `${user.id}-${file.name}`;

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

    setProfile({ ...profile, photo: publicURL.publicUrl });
  };

  const handleSave = async () => {
    if (!user) return;

    const updates = {
      id: user.id,
      name: profile.name,
      email:profile.email,
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
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">My Account</h2>

      {message && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          {message}
        </div>
      )}

      {(
        <div className="flex justify-center mb-4">
          <img
            src={profile.photo || '/default-avatar.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}

      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="block w-full"
        />
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
          placeholder="email"
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
