import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = ({ onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const words = ["ACE", "AI", "BASED", "COGNITIVE", "EDUCATION"];
  
  useEffect(() => {
    // Start animation sequence
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const wordInterval = setInterval(() => {
      setCurrentWordIndex(prev => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else {
          clearInterval(wordInterval);
          // Wait before completing
          setTimeout(() => {
            onComplete?.();
          }, 2000);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(wordInterval);
  }, [isVisible, words.length, onComplete]);

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className={`loader-logo ${isVisible ? 'animate' : ''}`}>
          <div className="logo-text">ACE</div>
        </div>
        
        <div className="words-container">
          {words.map((word, index) => (
            <div
              key={word}
              className={`word ${index <= currentWordIndex ? 'visible' : ''} ${index === currentWordIndex ? 'current' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {word}
            </div>
          ))}
        </div>
        
        <div className={`loader-subtitle ${isVisible ? 'fade-in' : ''}`}>
          Empowering minds through intelligent learning
        </div>
        
        <div className={`loading-bar ${isVisible ? 'animate' : ''}`}>
          <div className="bar-fill"></div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="bg-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>
    </div>
  );
};

export default Loader;
