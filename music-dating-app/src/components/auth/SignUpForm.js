import React, { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
// App.css is imported in App.js and provides global form styling via .form-container etc.

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success message

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: displayName,
        email: user.email,
        createdAt: Timestamp.fromDate(new Date())
      });
      
      setSuccessMessage('Sign up successful! You can now log in.');
      setEmail('');
      setPassword('');
      setDisplayName('');
      // User will be redirected by App.js logic if currentUser state changes and they are on /signup
      
    } catch (error) {
      console.error("Error signing up:", error.code, error.message);
      // More user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('The password is too weak.');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    // Using form-container for consistent form styling
    <div className="form-container"> 
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2> {/* Default h2 styling from App.css */}
        {error && <p className="form-error">{error}</p>}
        {successMessage && <p className="form-success">{successMessage}</p>}
        
        <div>
          <label htmlFor="displayName-signup">Display Name:</label>
          <input
            type="text"
            id="displayName-signup"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email-signup">Email:</label>
          <input
            type="email"
            id="email-signup"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password-signup">Password:</label>
          <input
            type="password"
            id="password-signup"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        
        {/* Using btn class for consistent button styling */}
        <button type="submit" className="btn">Sign Up</button> 
      </form>
    </div>
  );
};

export default SignUpForm;
