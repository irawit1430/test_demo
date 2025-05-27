import React from 'react';
import LoginForm from '../components/auth/LoginForm';
// App.css is imported in App.js and provides global styling

const LoginPage = () => {
  return (
    // Using page-container for consistent padding and max-width, though form itself has max-width
    <div className="page-container">
      {/* Form title is handled within LoginForm using h2 and .form-container styling */}
      <LoginForm />
    </div>
  );
};

export default LoginPage;
