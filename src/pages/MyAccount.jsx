import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    birthdate: '',
    contact: '',
    photo: '',
    password: ''
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    const signupUser = JSON.parse(localStorage.getItem('signupUser'));

    if (!isLoggedIn) {
      alert("Please login first.");
      navigate('/login');
    } else {
      setProfile(prev => ({
        ...prev,
        name: signupUser?.name || '',
        email: signupUser?.email || '',
        ...(storedProfile || {})
      }));
      setIsProfileComplete(!!storedProfile);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProfile = { ...profile, photo: reader.result };
        setProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profile.age || !profile.birthdate || !profile.contact) {
      alert("Please fill all the fields to complete your profile.");
      return;
    }

    const { name, email, age, birthdate, contact, photo, password } = profile;
    localStorage.setItem('userProfile', JSON.stringify({ name, email, age, birthdate, contact, photo, password }));
    setIsProfileComplete(true);
    alert("Profile completed successfully!");
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    alert("Logged out.");
    navigate('/');
    window.location.reload();
  };

  const handleDelete = () => {
    localStorage.removeItem('signupUser');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accountCreated');
    localStorage.removeItem('firstTimeLogin');
    alert("Account deleted.");
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-md">
        {!isProfileComplete && (
          <h2 className="text-xl font-semibold text-center text-green-600 mb-4">Complete Your Profile</h2>
        )}
        {!isProfileComplete && (
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24">
              <img
                src={profile.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
              />
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                title="Upload profile photo"
              />
            </div>
            {profile.photo ? (
              <button
                type="button"
                onClick={() => {
                  const updatedProfile = { ...profile, photo: '' };
                  setProfile(updatedProfile);
                  localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                }}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Remove Photo
              </button>
            ) : (
              <label htmlFor="uploadPhoto" className="mt-2 text-sm text-blue-500 hover:underline cursor-pointer">
                Add Photo
                <input
                  id="uploadPhoto"
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {!isProfileComplete ? (
          <form onSubmit={handleSubmit} className="space-y-4">            <input
              type="text"
              name="name"
              value={profile.name}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
  type="date"
  name="birthdate"
  value={profile.birthdate}
  onChange={handleChange}
  className="w-full border px-3 py-2 rounded"
  required
/>
<input
  type="tel"
  name="contact"
  value={profile.contact}
  onChange={handleChange}
  placeholder="Contact Number"
  className="w-full border px-3 py-2 rounded"
  required
/>
            
<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="New Password"
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded pr-10"
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
  >
    {showPassword ? "Hide" : "Show"}
  </span>
</div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Save Profile & Continue
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center mb-4">
              <img
                src={profile.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
              />
            </div>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>

            <div className="space-y-2 mt-4">
              <button
                onClick={() => setIsProfileComplete(false)}
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={handleDelete}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
