import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // ✅ Check account already exists on page load
  useEffect(() => {
    const existingUser = localStorage.getItem('signupUser');
    if (existingUser) {
      alert("You have already signed up. Please log in.");
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const user = {
      name: form.name,
      email: form.email,
      password: form.password
    };

    localStorage.setItem('signupUser', JSON.stringify(user));
    localStorage.setItem('accountCreated', 'true');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('firstTimeLogin', 'true');

    alert("Signup successful! Please log in.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-md">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" required value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input type="password" name="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={form.confirmPassword} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Sign Up</button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
