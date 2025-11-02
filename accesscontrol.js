import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const role = localStorage.getItem('role');
  return (
    <div className="text-center mt-10">
      <h2 className="text-xl mb-4">Welcome to your Dashboard</h2>
      {role === 'Admin' && <p className="text-green-600">You have full access (Admin)</p>}
      {role === 'Moderator' && <p className="text-yellow-600">You can review and manage content (Moderator)</p>}
      {role === 'User' && <p className="text-blue-600">You can view and interact (User)</p>}
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function Unauthorized() {
  return <h2 className="text-center text-red-600 mt-20">Access Denied: You are not authorized to view this page.</h2>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Moderator', 'User']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
