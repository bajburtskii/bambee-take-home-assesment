import React, { useState } from 'react';
import api from '../api';
import { setToken } from '../auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log(res.data)
      setToken(res.data.accessToken);
      navigate('/tasks');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
