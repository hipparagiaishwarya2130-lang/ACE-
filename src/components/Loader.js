import React, { useEffect } from 'react';
import './Loader.css';
import ScrollFloat from './ScrollFloat';

const Loader = ({ onComplete }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      onComplete && onComplete();
    }, 4000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="loader-container">
      <div className="loader-content">
        <ScrollFloat
          animationDuration={1}
          ease={'back.inOut(2)'}
          scrollStart={'center bottom+=50%'}
          scrollEnd={'bottom bottom-=40%'}
          stagger={0.03}
          useScroll={false}
          textClassName="loader-title"
        >
          ACE AI BASED COGNITIVE EDUCATION
        </ScrollFloat>
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
