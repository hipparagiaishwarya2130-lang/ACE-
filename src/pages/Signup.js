import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Stepper, { Step } from '../components/Stepper';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleComplete = () => {
    const emailValid = /.+@.+\..+/.test(email);
    if (!emailValid) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    const userData = { name: email.split('@')[0] || 'User', email, level: 'Beginner', streak: 0 };
    login(userData);
    navigate('/features');
  };

  return (
    <section className="section">
      <div className="container">
        <Stepper
          initialStep={1}
          onStepChange={(step) => {
            console.log(step);
          }}
          onFinalStepCompleted={handleComplete}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <h2>Enter your email</h2>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com" 
            />
          </Step>
          <Step>
            <h2>Create a password</h2>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="At least 6 characters" 
            />
          </Step>
          <Step>
            <h2>Confirm password</h2>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Re-enter your password" 
            />
          </Step>
          <Step>
            <h2>Finish</h2>
            <p>Click Complete to create your account.</p>
          </Step>
        </Stepper>
      </div>
    </section>
  );
}

export default Signup;
