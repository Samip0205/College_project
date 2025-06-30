import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('signupUser'));

    if (!storedUser) {
      alert("No account found. Please sign up first.");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      // ✅ Login success
      localStorage.setItem('isLoggedIn', 'true');

      const isFirstLogin = localStorage.getItem('firstTimeLogin') !== 'false';
      localStorage.setItem('firstTimeLogin', 'false');

      alert(`Welcome, ${storedUser.name}!`);

      if (isFirstLogin) {
        navigate('/account');
      } else {
        navigate('/');
      }

      // ✅ Refresh app to update Navbar
      window.location.reload();
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Log In</button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account? <a href="/signup" className="text-green-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
