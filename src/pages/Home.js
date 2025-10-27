import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import { useAuth } from '../context/AuthContext';
import CourseRecommendations from '../components/CourseRecommendations';
import skillImg from '../Images/skill.jpg';
import interviewImg from '../Images/interview.png';
import reactImg from '../Images/react.png';
import nodejsImg from '../Images/nodejs.jpeg';
import nextImg from '../Images/next.jpeg';
import mongoImg from '../Images/mangodb.png';
import machineImg from '../Images/machine.jpeg';
gsap.registerPlugin(ScrollTrigger);

// Minimal inline LogoLoop (marquee) component powered by requestAnimationFrame
function LogoLoop({ logos, speed = 120, logoHeight = 28, gap = 32, ariaLabel = 'Partner logos' }) {
  const containerRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const seqRef = React.useRef(null);
  const [seqWidth, setSeqWidth] = React.useState(0);
  const [copies, setCopies] = React.useState(2);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);
  const offsetRef = React.useRef(0);

  React.useEffect(() => {
    const update = () => {
      const cw = containerRef.current?.clientWidth || 0;
      const sw = seqRef.current?.getBoundingClientRect?.().width || 0;
      if (sw > 0) {
        setSeqWidth(Math.ceil(sw));
        setCopies(Math.max(2, Math.ceil(cw / sw) + 2));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const animate = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.max(0, ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      if (seqWidth > 0) {
        offsetRef.current = (offsetRef.current + speed * dt) % seqWidth;
        const tx = -offsetRef.current;
        if (trackRef.current) trackRef.current.style.transform = `translate3d(${tx}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastTsRef.current = null; };
  }, [seqWidth, speed]);

  const itemStyle = { height: logoHeight, width: 'auto', display: 'block', objectFit: 'contain', borderRadius: '25%' };

  return (
    <div ref={containerRef} role="region" aria-label={ariaLabel} style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
      <div ref={trackRef} style={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
        {Array.from({ length: copies }).map((_, copyIdx) => (
          <ul key={copyIdx} ref={copyIdx === 0 ? seqRef : undefined} style={{ display: 'flex', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}>
            {logos.map((l, i) => (
              <li key={`${copyIdx}-${i}`} style={{ marginRight: gap, display: 'flex', alignItems: 'center' }}>
                <img src={l.src} alt={l.alt || ''} style={itemStyle} draggable={false} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

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
                }}>WELCOME </div>
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
            alignItems: 'start'
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
              className="heroMock enhancedHeroMock"
              style={{
                width: '100%',
                aspectRatio: '16/9',
                /* removed duplicate background key */
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
              <div className="heroParticles" aria-hidden>
                <span className="heroParticle" />
                <span className="heroParticle" />
                <span className="heroParticle" />
                <span className="heroParticle" />
                <span className="heroParticle" />
                <span className="heroParticle" />
                <span className="heroParticle" />
                <span className="heroParticle" />
              </div>
              <div className="heroMockContent">
                <div className="heroMockTitle animatedText">Interactive Learning</div>
                <div className="heroMockSubtitle">AI-powered curriculum</div>
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


      <section ref={addToSectionsRef} style={{ padding: '80px 0', position: 'relative', background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)' }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '24px', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Browse Categories</h2>
          <div className="categories-grid">
            {[
              { title: 'AI & ML', link: '/features' },
              { title: 'Web Development', link: '/courses' },
              { title: 'Data Science', link: '/features' },
              { title: 'Cybersecurity', link: '/features' },
              { title: 'Cloud', link: '/features' },
              { title: 'Interview Prep', link: '/interview-practice' },
            ].map((c) => (
              <Link key={c.title} to={c.link} className="category-card">
                <div className="category-bg" />
                <div className="category-title">{c.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section ref={addToSectionsRef} style={{ padding: '80px 0', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '24px', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Featured Collections</h2>
          <div className="collections-grid">
            <Link to="/courses" className="collection-card large" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'center' }}>
                <LogoLoop 
                  logos={[
                    { src: reactImg, alt: 'React' },
                    { src: nodejsImg, alt: 'Node.js' },
                    { src: nextImg, alt: 'Next.js' },
                    { src: mongoImg, alt: 'MongoDB' },
                    { src: machineImg, alt: 'ML' },
                  ]}
                  speed={80}
                  logoHeight={32}
                  gap={28}
                  ariaLabel="Starter Tracks technologies"
                />
              </div>
              <div className="collection-overlay">
                <div className="collection-title">Starter Tracks</div>
                <div className="collection-sub">Kickstart your journey</div>
              </div>
            </Link>
            <Link 
              to="/features" 
              className="collection-card small"
              style={{ 
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${skillImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="collection-overlay">
                <div className="collection-title">Skill Boosters</div>
              </div>
            </Link>
            <Link 
              to="/interview-practice" 
              className="collection-card small"
              style={{ 
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${interviewImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="collection-overlay">
                <div className="collection-title">Mock Interviews</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section ref={addToSectionsRef} style={{ padding: '80px 0', position: 'relative', background: 'radial-gradient(800px at 50% 100%, rgba(108, 140, 255, 0.08), transparent)' }}>
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Stay in the loop</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Get new tracks, mock interviews, and learning tips straight to your inbox.</p>
          <form onSubmit={(e)=> e.preventDefault()} className="newsletter-form">
            <input aria-label="Email" type="email" required placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="trust-badges">
            <span>Secure</span>
            <span>No spam</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </section>

    </>
  );
}

export function AuthHome() {
  const [enrolled, setEnrolled] = React.useState([]);

  React.useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      setEnrolled(Array.isArray(data) ? data : []);
    } catch {
      setEnrolled([]);
    }
  }, []);

  return (
    <div style={{ padding: '60px 0' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'stretch' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
            <h1 style={{ fontSize: '2rem', margin: 0, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome back 👋</h1>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Pick up where you left off or explore new tracks.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 16 }}>
              <Link to="/courses" className="btn btnPrimary btnAnimated" style={{ textAlign: 'center' }}>Browse Courses</Link>
              <Link to="/interview-practice" className="btn btnGhost" style={{ textAlign: 'center' }}>AI Interview</Link>
              <Link to="/features" className="btn btnGhost" style={{ textAlign: 'center' }}>Features</Link>
            </div>

            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: '0 0 10px', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Continue learning</h3>
              {enrolled.length === 0 ? (
                <div style={{ color: 'var(--muted)' }}>
                  You haven't enrolled in any courses yet.
                  <div style={{ marginTop: 8 }}>
                    <Link to="/courses" className="nav-link" style={{ display: 'inline-block' }}>Browse courses</Link>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  {enrolled.slice(0, 6).map((c) => (
                    <Link key={c.id} to={`/course-detail/${c.id}`} className="card" style={{ padding: 16, textDecoration: 'none' }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>{c.title}</div>
                      {c.description && (
                        <div style={{ color: 'var(--muted)', fontSize: '.95rem' }}>
                          {c.description.length > 120 ? c.description.slice(0, 120) + '…' : c.description}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                        {c.difficulty && <span style={{ padding: '6px 10px', background: 'rgba(108,140,255,0.12)', borderRadius: 8, fontSize: 12 }}>{c.difficulty}</span>}
                        {c.duration && <span style={{ padding: '6px 10px', background: 'rgba(108,140,255,0.12)', borderRadius: 8, fontSize: 12 }}>{c.duration}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ background: 'linear-gradient(180deg, rgba(23,210,194,0.08), rgba(108,140,255,0.08))', border: '1px solid rgba(108,140,255,0.25)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Quick actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Link to="/domain-selection" className="btn btnGhost" style={{ textAlign: 'center' }}>Choose Domain</Link>
                <Link to="/profile" className="btn btnGhost" style={{ textAlign: 'center' }}>My Profile</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <CourseRecommendations />
      </div>
    </div>
  );
}

export default Home;
