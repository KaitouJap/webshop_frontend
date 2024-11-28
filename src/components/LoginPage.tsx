// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom'; // Use useNavigate for routing
import { baseUrl, apiRequest, authUrl } from '../services/api'; // Function to call your login API
import { useAuth } from '../AuthContext';
import NavBar from './NavbarComponent'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call your API to authenticate the user and get the token
      const { token } = await apiRequest(authUrl,{
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }); // Assuming the response contains just a token
      
      // Store the token in localStorage
      setAuthToken(token);
      setUsername('');
      setPassword('');
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
        <NavBar/>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <div>
            <label>Username: </label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            </div>
            <div>
            <label>Password: </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            <button type="submit">Login</button>
        </form>
        {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default LoginPage;
