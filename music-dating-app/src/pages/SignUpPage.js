import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
// App.css is imported in App.js and provides global styling

const SignUpPage = () => {
  return (
    // Using page-container for consistent padding and max-width, though form itself has max-width
    <div className="page-container">
      {/* Form title is handled within SignUpForm using h2 and .form-container styling */}
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
