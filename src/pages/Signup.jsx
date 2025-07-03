import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Please check your email.");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-md">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="w-full border px-3 py-2 rounded" />
          <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" />
          <input name="password" value={form.password} onChange={handleChange} required type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" />
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
