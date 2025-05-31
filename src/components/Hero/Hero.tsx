import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Hero.scss';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create particles
    if (particlesRef.current) {
      const particlesContainer = particlesRef.current;
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particlesContainer.appendChild(particle);
      }
    }

    // Create GSAP timeline for hero animations
    const tl = gsap.timeline();
    
    // Initial state - everything hidden
    gsap.set([titleRef.current, subtitleRef.current], { 
      opacity: 0,
      y: 100
    });
    
    // Explosive entrance animation
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      rotationX: 360,
      transformOrigin: "center center"
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=0.5");
    
    // Mouse movement effect for 3D rotation
    if (heroRef.current) {
      heroRef.current.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to(titleRef.current, {
          rotationY: xPos,
          rotationX: -yPos,
          duration: 0.5,
          ease: "power1.out"
        });
      });
    }
    
    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', () => {});
      }
    };
  }, []);
  
  return (
    <div ref={heroRef} className="hero-container">
      <div ref={particlesRef} className="particles-container"></div>
      <h1 ref={titleRef} className="hero-title">CS362 Group 92 Project</h1>
      <h2 ref={subtitleRef} className="hero-subtitle">Specification Compliance & Student Q&A Review</h2>
    </div>
  );
};

export default Hero;
