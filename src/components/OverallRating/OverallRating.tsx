import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './OverallRating.css';

const OverallRating = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const confettiContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Register ScrollTrigger plugin - moved inside useEffect for client-side only execution
    gsap.registerPlugin(ScrollTrigger);
    
    // Create GSAP timeline for overall rating animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });
    
    // Title animation
    tl.from(titleRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "back.out(1.7)"
    });
    
    // Rating counter animation
    const ratingElement = ratingRef.current;
    if (ratingElement) {
      const countTo = 100;
      let count = 0;
      
      tl.to(ratingElement, {
        duration: 2,
        onUpdate: function() {
          const progress = Math.round(this.progress() * countTo);
          if (progress !== count) {
            count = progress;
            ratingElement.textContent = `${count}%`;
          }
        },
        onComplete: function() {
          // Create confetti explosion
          createConfetti();
        }
      });
    }
    
    // Create confetti particles
    const createConfetti = () => {
      if (confettiContainerRef.current) {
        const container = confettiContainerRef.current;
        const colors = ['#ff00cc', '#3333ff', '#00f5a0', '#e100ff', '#7f00ff', '#00d9f5'];
        
        for (let i = 0; i < 150; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.left = `${Math.random() * 100}%`;
          confetti.style.top = `${Math.random() * 20}%`;
          confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
          
          // Random confetti shape
          const shapeType = Math.floor(Math.random() * 3);
          if (shapeType === 0) {
            confetti.style.borderRadius = '50%'; // Circle
          } else if (shapeType === 1) {
            confetti.style.width = '10px';
            confetti.style.height = '10px';
          } // Default is square
          
          container.appendChild(confetti);
          
          gsap.to(confetti, {
            y: `${500 + Math.random() * 200}px`,
            x: `${(Math.random() - 0.5) * 300}px`,
            rotation: `${Math.random() * 720 - 360}deg`,
            duration: 2 + Math.random() * 3,
            ease: "power1.out",
            onComplete: () => {
              confetti.remove();
            }
          });
        }
      }
    };
    
    // Pulse animation for conclusion text
    const conclusionText = document.querySelector('.conclusion-text');
    if (conclusionText) {
      gsap.to(conclusionText, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: conclusionText,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }
    
    return () => {
      // Cleanup
    };
  }, []);
  
  return (
    <div ref={sectionRef} className="rating-container">
      <div ref={confettiContainerRef} className="confetti-container"></div>
      
      <h2 ref={titleRef} className="section-title">Overall Rating</h2>
      
      <div className="rating-content">
        <div className="rating-circle">
          <div ref={ratingRef} className="rating-number">0%</div>
          <div className="rating-label">Compliance</div>
        </div>
        
        <div className="conclusion-text">
          <p>The Group 92 project is <span className="highlight">fully compliant</span> with all professor specifications, clarifications, and answers provided to student questions. All edge cases and requirements discussed in the Q&A are handled correctly in the implementation and tests.</p>
        </div>
        
        <div className="final-note">
          <p>If you have a specific question not covered here, please let us know!</p>
        </div>
      </div>
    </div>
  );
};

export default OverallRating;
