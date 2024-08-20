import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import 'react-toastify/dist/ReactToastify.css';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save login info to localStorage if needed
        localStorage.setItem('authToken', data.token);
        navigate('/home');
      } else {
        
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

  };
  return (
    <div className="container">
      <div className="log-in-form">
        <h2 className='heading'>Log In</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Example@gmail.com"
            onChange={handleInputChange}
            value={email}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Eg: 59gx5TY30"
            onChange={handleInputChange}
            value={password}
            required
          />
          <div className="actions">
            <button type="submit">Submit</button>
          </div>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
