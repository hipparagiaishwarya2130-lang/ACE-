import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import { useAuth } from '../context/AuthContext';
import EashwarImg from '../Images/Eashwar.jpg';
import aniImg from '../Images/ani.jpg';
gsap.registerPlugin(ScrollTrigger);

function Home() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  const heroMockRef = useRef(null);
  const cardsRef = useRef([]);
  const bannerRef = useRef(null);
  const bannerBtnsRef = useRef(null);
  const heroTitleRef = useRef(null);
  sectionsRef.current = [];

  const addToSectionsRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const hero = heroRef.current;
    const heroMock = heroMockRef.current;
    const banner = bannerRef.current;
    const bannerBtns = bannerBtnsRef.current ? bannerBtnsRef.current.querySelectorAll('a, button') : [];
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Banner intro animations (appear before hero)
    if (banner) {
      const bannerTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      bannerTl.fromTo(banner, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      if (bannerBtns && bannerBtns.length) {
        bannerTl.fromTo(bannerBtns, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 }, '<0.05');
      }
    }

    // Intro animation - simplified for mobile
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      hero.querySelectorAll('[data-hero-fade]'),
      { y: isMobile ? 20 : 30, opacity: 0 },
      { y: 0, opacity: 1, duration: isMobile ? 0.6 : 0.9, stagger: isMobile ? 0.08 : 0.12 }
    );

    // Character-level reveal for main hero title (desktop only)
    if (!prefersReducedMotion && heroTitleRef.current) {
      const titleEl = heroTitleRef.current;
      const raw = titleEl.textContent;
      titleEl.innerHTML = '';
      raw.split('').forEach((ch) => {
        const s = document.createElement('span');
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        s.style.display = 'inline-block';
        s.style.opacity = '0';
        s.style.transform = 'translateY(20px)';
        titleEl.appendChild(s);
      });
      gsap.to(titleEl.children, {
        opacity: 1,
        y: 0,
        duration: 0.04,
        stagger: 0.02,
        ease: 'power2.out'
      });
    }

    // Hero mock animations - reduced for mobile performance
    if (heroMock && !prefersReducedMotion) {
      if (!isMobile) {
        // Full parallax effect for desktop
        gsap.to(heroMock, {
          y: -50,
          scale: 1.05,
          scrollTrigger: {
            trigger: heroMock,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        });

        // 3D rotation for desktop only
        gsap.to(heroMock, {
          rotateY: 5,
          rotateX: 2,
          scrollTrigger: {
            trigger: heroMock,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 2,
          }
        });
      } else {
        // Simplified mobile animation
        gsap.to(heroMock, {
          y: -20,
          scrollTrigger: {
            trigger: heroMock,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          }
        });
      }
    }

    // Enhanced scroll reveal for sections - mobile optimized
    sectionsRef.current.forEach((section, index) => {
      if (prefersReducedMotion) {
        // Simple fade for reduced motion
        gsap.fromTo(
          section,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
        return;
      }

      const animationType = isMobile ? 0 : index % 3; // Use only slide up on mobile
      const duration = isMobile ? 0.6 : 1;
      const distance = isMobile ? 30 : 60;
      
      switch(animationType) {
        case 0:
          // Slide up from bottom
          gsap.fromTo(
            section,
            { y: distance, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: duration,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: isMobile ? 'top 95%' : 'top 85%',
                end: isMobile ? 'top 70%' : 'top 50%',
                toggleActions: 'play none none reverse'
              }
            }
          );
          break;
        case 1:
          // Slide in from left (desktop only)
          gsap.fromTo(
            section,
            { x: -distance, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: duration,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
              }
            }
          );
          break;
        case 2:
          // Scale and fade in (desktop only)
          gsap.fromTo(
            section,
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: duration,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
              }
            }
          );
          break;
        default:
          // Default animation - slide up from bottom
          gsap.fromTo(
            section,
            { y: distance, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: duration,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: isMobile ? 'top 95%' : 'top 85%',
                end: isMobile ? 'top 70%' : 'top 50%',
                toggleActions: 'play none none reverse'
              }
            }
          );
          break;
      }
    });

    // Staggered card animations - mobile optimized + hover tilt
    cardsRef.current.forEach((card, index) => {
      if (prefersReducedMotion) {
        // Simple fade for reduced motion
        gsap.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      } else {
        gsap.fromTo(
          card,
          { 
            y: isMobile ? 20 : 40, 
            opacity: 0, 
            rotateY: isMobile ? 0 : -15,
            scale: isMobile ? 1 : 0.9 
          },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: isMobile ? 0.5 : 0.8,
            ease: isMobile ? 'power2.out' : 'back.out(1.7)',
            delay: index * (isMobile ? 0.1 : 0.2),
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 95%' : 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Card hover 3D tilt - desktop only
      if (!isMobile && !prefersReducedMotion) {
        const reset = () => gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const cx = e.clientX - rect.left;
          const cy = e.clientY - rect.top;
          const rx = ((cy / rect.height) - 0.5) * -8; // tilt X
          const ry = ((cx / rect.width) - 0.5) * 12;  // tilt Y
          gsap.to(card, { rotateX: rx, rotateY: ry, y: -6, scale: 1.03, duration: 0.2, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', reset);
        card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, scale: 1.03, duration: 0.2 }));
      }
    });

    // Floating animation for feature icons
    if (!prefersReducedMotion) {
      document.querySelectorAll('[data-feature-icon]')?.forEach((icon, i) => {
        gsap.to(icon, { y: -6, repeat: -1, yoyo: true, duration: 1.6 + i * 0.1, ease: 'power1.inOut' });
      });
    }

    // Text reveal animation - simplified for mobile
    if (!prefersReducedMotion) {
      const headings = document.querySelectorAll('h2, h3');
      headings.forEach(heading => {
        if (isMobile) {
          // Simple fade for mobile
          gsap.fromTo(heading, 
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        } else {
          // Character animation for desktop
          const text = heading.textContent;
          heading.innerHTML = '';
          
          text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            heading.appendChild(span);
          });

          gsap.to(heading.children, {
            opacity: 1,
            y: 0,
            duration: 0.05,
            stagger: 0.03,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      });
    }

    // Floating animation for stat card icon - reduced on mobile
    const statIcon = document.querySelector('.statIcon');
    if (statIcon && !prefersReducedMotion) {
      gsap.to(statIcon, {
        y: isMobile ? -3 : -5,
        duration: isMobile ? 1.5 : 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }

    // Progress bar animation - mobile optimized
    ScrollTrigger.create({
      trigger: '.statCard',
      start: isMobile ? 'top 90%' : 'top 80%',
      onEnter: () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: var(--gradient);
          border-radius: 0 0 14px 14px;
          width: 0%;
        `;
        
        const statCard = document.querySelector('.statCard');
        if (statCard && !statCard.querySelector('div[style*="position: absolute"]')) {
          statCard.style.position = 'relative';
          statCard.appendChild(progressBar);
          
          gsap.to(progressBar, {
            width: '100%',
            duration: isMobile ? 1.5 : 2,
            ease: 'power2.out'
          });
        }
      }
    });

    // Handle orientation change on mobile
    const handleOrientationChange = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', ScrollTrigger.refresh);

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', ScrollTrigger.refresh);
    };
  }, []);

  return (
    <>
      {/* ACE-AI Cognitive Banner */}
      <section ref={bannerRef} className="cognitive-hero section">
        <div className="container">
          <div className="cognitive-inner">
            <h1 className="cognitive-title">ACE-AI BASED COGNITIVE EDUCATION</h1>
            <p className="cognitive-subtitle">Adaptive, personalized, and engaging learning powered by AI.</p>
            <div ref={bannerBtnsRef} className="hero-actions">
              {isAuthenticated ? (
                <div style={{
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  fontSize: '1.25rem',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}>WELCOME BACK</div>
              ) : (
                <>
                  <Link to="/login" className="btn btnPrimary btnAnimated" aria-label="Go to Login">Login</Link>
                  <Link to="/signup" className="btn btnSecondary btnAnimated" aria-label="Go to Signup">Sign Up</Link>
                  <Link
                    to="/team"
                    className="btn btnSecondary btnAnimated"
                    style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)' }}
                    aria-label="Go to Team Members page"
                  >
                    Team Members
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={heroRef} 
        style={{
          padding: '80px 0 60px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          <div style={{ maxWidth: '540px' }}>
            <h1 
              ref={heroTitleRef}
              data-hero-fade
              style={{
                fontSize: '2.5rem',
                lineHeight: '1.2',
                marginBottom: '20px',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700'
              }}
            >
              Accelerate learning with AI‑powered study & interview practice
            </h1>
            <p 
              data-hero-fade
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'var(--muted)',
                marginBottom: '32px'
              }}
            >
              Curated content, personalized journeys, and realistic interview proctoring—designed to bridge learning and job‑readiness.
            </p>
            <div 
              data-hero-fade
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              {isAuthenticated ? (
                <div style={{
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  fontSize: '1.15rem',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}>Ace Your Classes, Own Your Future</div>
              ) : (
                <>
                  <Link 
                    to="/signup" 
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gradient)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'var(--text)',
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  >
                    I already have an account
                  </Link>
                </>
              )}
            </div>

            <div 
              data-hero-fade
              style={{ 
                marginTop: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  content: '"AI"',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >AI</span>
              <div>
                <strong>AI‑Powered E‑Learning & Interview Proctor System</strong>
                <div style={{ color: 'var(--muted)' }}>Personalized, structured, and assessment‑ready.</div>
              </div>
            </div>
          </div>
          <div>
            <div 
              ref={heroMockRef} 
              style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 80px rgba(108, 140, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                background: 'linear-gradient(135deg, rgba(108, 140, 255, 0.1) 0%, rgba(23, 210, 194, 0.1) 100%)'
              }}
            >
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div 
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    background: 'var(--gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Interactive Learning
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                  AI-powered curriculum
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={addToSectionsRef} 
        style={{
          padding: '80px 0',
          position: 'relative'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '30px',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}>Introduction</h2>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            <p>
              Our website, AI-Powered E-Learning & Interview Proctor System, is an intelligent platform designed to make learning and skill evaluation easier, smarter, and more effective. It helps users explore various domains such as Artificial Intelligence, Machine Learning, Web Development, Cybersecurity, and more all in one place.
The platform automatically gathers high-quality learning materials from trusted online sources and organizes them into structured modules. Learners can easily access tutorials, articles, and videos related to their chosen field. Personalized recommendations help users continue learning efficiently based on their progress and interests.
A key highlight of the website is its AI Interview Proctor feature. This smart system conducts mock interviews by asking domain-specific questions, evaluating responses, and providing instant scores and feedback. It helps learners improve their technical knowledge, communication skills, and confidence before facing real interviews
            </p>
            <p>
              This domain bridges the gap between online learning and job readiness by ensuring learners are equipped with knowledge and practical competencies.
            </p>
          </div>
        </div>
      </section>

      <section 
        ref={addToSectionsRef} 
        style={{
          padding: '80px 0',
          position: 'relative',
          background: 'radial-gradient(800px at 50% 100%, rgba(108, 140, 255, 0.08), transparent)'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '30px',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            display: 'block'
          }}>Key Features</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '40px'
          }}>
            <div 
              ref={addToCardsRef} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient)',
                position: 'relative',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }} data-feature-icon>A</div>
              <h3 style={{
                marginTop: '0',
                marginBottom: '16px',
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Motivation</h3>
              <p>
                Bridge the gap between self‑learning and job readiness. Learners need structured, reliable content and realistic interview practice to validate their skills.
              </p>
            </div>
            <div 
              ref={addToCardsRef} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient)',
                position: 'relative',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }} data-feature-icon>C</div>
              <h3 style={{
                marginTop: '0',
                marginBottom: '16px',
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Problem Statement</h3>
              <p>
                Scattered resources and lack of practical evaluation make it hard to measure progress. Our system delivers curated content, simulated interviews, and personalized feedback.
              </p>
            </div>
            <div 
              ref={addToCardsRef} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient)',
                position: 'relative',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }} data-feature-icon>E</div>
              <h3 style={{
                marginTop: '0',
                marginBottom: '16px',
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>What You Get</h3>
              <p>
                AI‑guided study paths, topic recommendations, progress tracking, and interview simulations that assess technical expertise and communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section 
        id="team-section"
        ref={addToSectionsRef}
        style={{
          padding: '80px 0',
          position: 'relative'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '30px',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            display: 'block'
          }}>Our Team</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '20px'
          }}>
            {[
              { name: 'Anirudh K', role: 'Backend Developer', photo: aniImg},
              { name: 'Aishwarya H', role: 'Frontend Developer', photo:  EashwarImg },
              { name: 'Eashwar D', role: 'Frontend Developer', photo:  EashwarImg},
              { name: 'Godeshwari C', role: 'Product Designer', photo:  EashwarImg },
            ].map((m) => (
              <div ref={addToCardsRef} key={m.name} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center', 
                willChange: 'transform',
                transformStyle: 'preserve-3d'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(108, 140, 255, 0.25), rgba(23,210,194,0.25))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontWeight: 700 }}>{m.name.split(' ').map(p => p[0]).join('').slice(0,2)}</span>
                  )}
                </div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
