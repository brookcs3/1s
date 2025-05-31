import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './QASection.scss';

const QASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const qaItemsRef = useRef<HTMLDivElement[]>([]);
  const [activeQA, setActiveQA] = useState<number | null>(null);
  
  const qaItems = [
    {
      id: 1,
      question: "Should '0123' return 123 or None?",
      answer: "Returns 123. Leading zeros are accepted as valid input.",
      compliance: "✔️ Our implementation and tests accept leading zeros and return the correct integer."
    },
    {
      id: 2,
      question: "Will Gradescope accept line lengths up to 127?",
      answer: "If your workflow uses flake8 --max-line-length=127, lines up to 127 are valid.",
      compliance: "✔️ Our workflow matches this setting."
    },
    {
      id: 3,
      question: "Should small ints be padded to two hex digits (e.g., 2 → '02')? Should zero be '00'?",
      answer: "Yes, always pad to two digits per byte.",
      compliance: "✔️ Our implementation pads all bytes to two characters."
    },
    {
      id: 4,
      question: "Are type annotations allowed?",
      answer: "Yes, type annotations are allowed.",
      compliance: "✔️ Type annotations are optional and do not affect compliance."
    },
    {
      id: 5,
      question: "Is 'endian' case sensitive?",
      answer: "Only 'big' and 'little' (lowercase) are valid.",
      compliance: "✔️ Our implementation only accepts lowercase 'big' and 'little'."
    },
    {
      id: 6,
      question: "Should conv_num('123.') return 123.0 or 123?",
      answer: "Must return 123.0 (float), not int.",
      compliance: "✔️ Our implementation and tests require float type for this case."
    },
    {
      id: 7,
      question: "Should negative numbers be represented as a negative sign followed by the same hex as positive?",
      answer: "Yes, just add a '-' sign; do not use two's complement.",
      compliance: "✔️ Our implementation matches this."
    },
    {
      id: 8,
      question: "Can we use multiple test classes?",
      answer: "Yes, you may use separate classes for each function.",
      compliance: "✔️ Our tests use three classes, one per function."
    }
  ];
  
  useEffect(() => {
    // Register ScrollTrigger plugin - moved inside useEffect for client-side only execution
    gsap.registerPlugin(ScrollTrigger);
    
    // Create GSAP timeline for QA section animations
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
    
    // Floating icons animation
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
      gsap.to(icon, {
        y: `random(-20, 20)`,
        x: `random(-20, 20)`,
        rotation: `random(-15, 15)`,
        duration: `random(2, 4)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2
      });
    });
    
    // QA items staggered animation
    qaItemsRef.current.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
        y: 50,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });
      
      // Question text scramble effect
      const questionText = item.querySelector('.qa-question-text');
      if (questionText) {
        const originalText = questionText.textContent || '';
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        let currentText = '';
        let duration = 1.5;
        let startTime = 0;
        let progress = 0;
        
        const scrambleText = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          progress = (timestamp - startTime) / (duration * 1000);
          
          if (progress < 1) {
            currentText = '';
            for (let i = 0; i < originalText.length; i++) {
              if (i < originalText.length * progress) {
                currentText += originalText[i];
              } else {
                currentText += chars[Math.floor(Math.random() * chars.length)];
              }
            }
            questionText.textContent = currentText;
            requestAnimationFrame(scrambleText);
          } else {
            questionText.textContent = originalText;
          }
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startTime = 0;
              requestAnimationFrame(scrambleText);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(item);
      }
    });
    
    return () => {
      // Cleanup
    };
  }, []);
  
  // Helper function to add items to the ref array
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !qaItemsRef.current.includes(el)) {
      qaItemsRef.current.push(el);
    }
  };
  
  const toggleQA = (id: number) => {
    setActiveQA(activeQA === id ? null : id);
    
    // Animate answer reveal
    const qaItem = qaItemsRef.current.find(item => item.getAttribute('data-id') === id.toString());
    const answer = qaItem?.querySelector('.qa-answer');
    
    if (answer) {
      if (activeQA === id) {
        // Close animation
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        // Open animation
        gsap.fromTo(answer, 
          { height: 0, opacity: 0 },
          { 
            height: 'auto', 
            opacity: 1, 
            duration: 0.5, 
            ease: "power2.out",
            onComplete: () => {
              // Page turn effect
              const pages = answer.querySelectorAll('.page');
              pages.forEach((page, index) => {
                gsap.fromTo(page,
                  { rotationY: -90, opacity: 0 },
                  { 
                    rotationY: 0, 
                    opacity: 1, 
                    duration: 0.5, 
                    delay: index * 0.2,
                    ease: "back.out(1.7)" 
                  }
                );
              });
            }
          }
        );
      }
    }
  };
  
  return (
    <div ref={sectionRef} className="qa-container">
      <div className="floating-icons-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="floating-icon">✔️</div>
        ))}
      </div>
      
      <h2 ref={titleRef} className="section-title">Student Questions and Project Compliance Review</h2>
      
      <div className="qa-intro">
        This section reviews common student questions from the course discussion and rates how the Group 92 project aligns with the clarifications and answers provided by the instructor.
      </div>
      
      <div className="qa-list">
        {qaItems.map((item) => (
          <div 
            key={item.id} 
            ref={addToRefs} 
            data-id={item.id}
            className={`qa-item ${activeQA === item.id ? 'active' : ''}`}
            onClick={() => toggleQA(item.id)}
          >
            <div className="qa-question">
              <div className="qa-number">{item.id}</div>
              <div className="qa-question-text">{item.question}</div>
              <div className="qa-toggle">
                {activeQA === item.id ? '−' : '+'}
              </div>
            </div>
            
            <div className="qa-answer" style={{ height: activeQA === item.id ? 'auto' : 0, opacity: activeQA === item.id ? 1 : 0 }}>
              <div className="page answer-text">
                <strong>A:</strong> {item.answer}
              </div>
              <div className="page compliance-text">
                <strong>Project Compliance:</strong> {item.compliance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QASection;
