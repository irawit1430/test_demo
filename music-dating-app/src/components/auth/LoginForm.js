import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
// App.css is imported in App.js and provides global form styling via .form-container etc.

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User is logged in. App.js will detect currentUser change and redirect if on /login.
      // No need to clear form here as the component might unmount or user navigates away.
      // setEmail('');
      // setPassword('');
      // console.log("User logged in successfully");
    } catch (error) {
      console.error("Error logging in:", error.code, error.message);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to log in. Please try again later.');
      }
    }
  };

  return (
    // Using form-container for consistent form styling
    <div className="form-container"> 
      <form onSubmit={handleSubmit}>
        <h2>Login</h2> {/* Default h2 styling from App.css */}
        {error && <p className="form-error">{error}</p>}
        
        <div>
          <label htmlFor="email-login">Email:</label>
          <input
            type="email"
            id="email-login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password-login">Password:</label>
          <input
            type="password"
            id="password-login"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {/* Using btn class for consistent button styling */}
        <button type="submit" className="btn">Login</button> 
      </form>
    </div>
  );
};

export default LoginForm;
