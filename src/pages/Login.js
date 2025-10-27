import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';


gsap.registerPlugin(ScrollTrigger);

function Login () {
  const cardRef = useRef(null);
  const bannerRef = useRef(null);
  const bannerBtnsRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [showDomainSelection, setShowDomainSelection] = useState(false);
  const [showCourseRecommendations, setShowCourseRecommendations] = useState(false);
  const [selectedDomainData, setSelectedDomainData] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const animationsRef = useRef([]);

  useEffect(() => {
    // Validate element before animating
    const validateElement = (element) => {
      return element && 
             element.parentNode && 
             element.isConnected && 
             document.contains(element);
    };

    // Clean up previous animations
    animationsRef.current.forEach(animation => {
      if (animation && typeof animation.kill === 'function') {
        animation.kill();
      }
    });
    animationsRef.current = [];

    const card = cardRef.current;
    if (validateElement(card)) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Banner intro animations
      const banner = bannerRef.current;
      const bannerBtns = bannerBtnsRef.current ? bannerBtnsRef.current.querySelectorAll('a, button') : [];
      if (validateElement(banner)) {
        const bannerTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        bannerTl.fromTo(banner, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
        if (bannerBtns && bannerBtns.length) {
          bannerTl.fromTo(
            bannerBtns,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
            '<0.05'
          );
        }
        animationsRef.current.push(bannerTl);
      }

      const mainAnim = tl.fromTo(card, 
        { y: 24, opacity: 0, rotateX: -6 }, 
        { y: 0, opacity: 1, rotateX: 0, duration: 0.7 }
      );
      
      // Validate stagger elements before animating
      const staggerElements = card.querySelectorAll('[data-stagger]');
      const validStaggerElements = Array.from(staggerElements).filter(validateElement);
      
      if (validStaggerElements.length > 0) {
        const staggerAnim = tl.fromTo(validStaggerElements, 
          { y: 16, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, 
          '<0.05'
        );
        animationsRef.current.push(staggerAnim);
      }
      
      animationsRef.current.push(mainAnim);
    }

    // ScrollTrigger for below-the-fold feature items with validation
    const featureItems = document.querySelectorAll('[data-feature-item]');
    const validFeatureItems = Array.from(featureItems).filter(validateElement);
    
    validFeatureItems.forEach((el) => {
      if (validateElement(el)) {
        const scrollAnim = gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
        animationsRef.current.push(scrollAnim);
      }
    });

    // Cleanup function
    return () => {
      animationsRef.current.forEach(animation => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
        }
      });
      animationsRef.current = [];
      
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger && typeof trigger.kill === 'function') {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        name: email.split('@')[0] || 'User',
        email: email,
        level: 'Intermediate',
        streak: 7
      };
      
      login(userData);
      
      // Check if user has already selected a domain
      const existingDomainSelection = localStorage.getItem('userDomainSelection');
      
      if (existingDomainSelection) {
        // User has already selected domain, go to home
        navigate('/');
      } else {
        // New user, show domain selection popup
        setShowDomainSelection(true);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleDomainSelect = (domainData) => {
    // Save domain selection to localStorage
    localStorage.setItem('userDomainSelection', JSON.stringify(domainData));
    setSelectedDomainData(domainData);
    setShowDomainSelection(false);
    setShowCourseRecommendations(true);
  };

  const handleCourseSelect = (course) => {
    // Save selected course and redirect to dashboard
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    navigate('/');
  };

  const handleSkipCourseSelection = () => {
    // Skip course selection and go to home
    navigate('/');
  };

  return (
    <div className="authWrap">
      <form ref={cardRef} className="authCard" onSubmit={handleLogin}>
        <h2 className="authTitle">Login</h2>
        <p className="authSubtitle">Access your learning dashboard</p>

        <div className="field" data-stagger>
          <label htmlFor="email">Username or Email</label>
          <input 
            id="email" 
            type="text" 
            className="input" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field" data-stagger>
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password" 
            className="input" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="authActions" data-stagger>
          <button 
            className="btn btnPrimary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
