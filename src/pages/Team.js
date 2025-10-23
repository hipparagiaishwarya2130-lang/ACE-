import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltedCard from './TiltedCard';
import EashwarImg from '../Images/Eashwar.jpg';
import aniImg from '../Images/ani.jpg';

gsap.registerPlugin(ScrollTrigger);

function Team() {
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cardsRef.current.forEach((card, index) => {
      if (prefersReducedMotion) {
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
              toggleActions: 'play none none reverse',
            },
          }
        );
      } else {
        gsap.fromTo(
          card,
          { y: isMobile ? 20 : 40, opacity: 0, scale: isMobile ? 1 : 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: isMobile ? 0.5 : 0.8,
            ease: isMobile ? 'power2.out' : 'back.out(1.7)',
            delay: index * (isMobile ? 0.1 : 0.2),
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 95%' : 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const teamMembers = [
    { name: 'Anirudh K', role: 'Backend Developer', photo: aniImg },
    { name: 'Aishwarya H', role: 'Frontend Developer', photo: EashwarImg },
    { name: 'Eashwar D', role: 'Frontend Developer', photo: EashwarImg },
    { name: 'Godeshwari C', role: 'Product Designer', photo: EashwarImg },
  ];

  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '30px',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Our Team
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            justifyItems: 'center',
          }}
        >
          {teamMembers.map((member) => (
            <div
              ref={addToCardsRef}
              key={member.name}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '20px',
                textAlign: 'center',
                width: '100%',
                maxWidth: '300px',
                transition: 'transform 0.3s ease',
              }}
            >
              <TiltedCard
                imageSrc={member.photo}
                altText={member.name}
                captionText={member.name}
                containerHeight="260px"
                containerWidth="260px"
                imageHeight="260px"
                imageWidth="260px"
                rotateAmplitude={14}
                scaleOnHover={1.15}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 600,
                      textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    {member.name}
                  </div>
                }
              />

              <div style={{ fontWeight: 700, marginTop: '16px' }}>{member.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;