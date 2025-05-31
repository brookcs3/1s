import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './SummaryTable.scss';

const SummaryTable = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const cellRefs = useRef<HTMLTableCellElement[]>([]);
  
  useEffect(() => {
    // Register ScrollTrigger plugin - moved inside useEffect for client-side only execution
    gsap.registerPlugin(ScrollTrigger);
    
    // Create GSAP timeline for summary table animations
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
    
    // Table header animation
    const tableHeader = tableRef.current?.querySelector('thead');
    if (tableHeader) {
      tl.from(tableHeader, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");
    }
    
    // Cell-by-cell animation
    cellRefs.current.forEach((cell, index) => {
      gsap.from(cell, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        delay: 0.05 * index,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: tableRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      
      // Status indicator animation for "Compliant" cells
      if (cell.textContent?.includes('Compliant')) {
        const statusIndicator = cell.querySelector('.status-indicator');
        if (statusIndicator) {
          gsap.to(statusIndicator, {
            backgroundColor: '#00f5a0',
            boxShadow: '0 0 15px #00f5a0',
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: tableRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });
        }
      }
    });
    
    // Row hover effect
    const mouseEnterHandlers: Record<number, (event: MouseEvent) => void> = {};
    const mouseLeaveHandlers: Record<number, () => void> = {};
    
    const rows = tableRef.current?.querySelectorAll('tbody tr');
    rows?.forEach((row, index) => {
      mouseEnterHandlers[index] = (event: MouseEvent) => {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        row.appendChild(ripple);
        
        gsap.to(ripple, {
          scale: 20,
          opacity: 0,
          duration: 1,
          ease: "power1.out",
          onComplete: () => {
            ripple.remove();
          }
        });
        
        // Highlight row
        gsap.to(row, {
          backgroundColor: 'rgba(0, 245, 160, 0.2)',
          duration: 0.3,
          ease: "power1.out"
        });
      };
      
      mouseLeaveHandlers[index] = () => {
        gsap.to(row, {
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: "power1.out"
        });
      };
      
      row.addEventListener('mouseenter', mouseEnterHandlers[index]);
      row.addEventListener('mouseleave', mouseLeaveHandlers[index]);
    });
    
    return () => {
      // Cleanup
      rows?.forEach((row, index) => {
        if (mouseEnterHandlers[index]) {
          row.removeEventListener('mouseenter', mouseEnterHandlers[index]);
        }
        if (mouseLeaveHandlers[index]) {
          row.removeEventListener('mouseleave', mouseLeaveHandlers[index]);
        }
      });
    };
  }, []);
  
  // Helper function to add cells to the ref array
  const addToCellRefs = (el: HTMLTableCellElement | null) => {
    if (el && !cellRefs.current.includes(el)) {
      cellRefs.current.push(el);
    }
  };
  
  return (
    <div ref={sectionRef} className="summary-container">
      <h2 ref={titleRef} className="section-title">Summary Table</h2>
      
      <table ref={tableRef} className="summary-table">
        <thead>
          <tr>
            <th>Requirement</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td ref={addToCellRefs}>No built-in conversion in task.py</td>
            <td ref={addToCellRefs}>
              <span className="status">
                <span className="status-indicator"></span>
                Compliant
              </span>
            </td>
          </tr>
          <tr>
            <td ref={addToCellRefs}>Built-ins allowed in tests.py</td>
            <td ref={addToCellRefs}>
              <span className="status">
                <span className="status-indicator"></span>
                Compliant
              </span>
            </td>
          </tr>
          <tr>
            <td ref={addToCellRefs}>No datetime in task.py</td>
            <td ref={addToCellRefs}>
              <span className="status">
                <span className="status-indicator"></span>
                Compliant
              </span>
            </td>
          </tr>
          <tr>
            <td ref={addToCellRefs}>Manual leap year/date calculation</td>
            <td ref={addToCellRefs}>
              <span className="status">
                <span className="status-indicator"></span>
                Compliant
              </span>
            </td>
          </tr>
          <tr>
            <td ref={addToCellRefs}>Comprehensive test coverage</td>
            <td ref={addToCellRefs}>
              <span className="status">
                <span className="status-indicator"></span>
                Compliant
              </span>
            </td>
          </tr>
          <tr>
            <td ref={addToCellRefs}>No trivializing libraries</td>
            <td ref={addToCellRefs}>
              <span className="status">
                <span className="status-indicator"></span>
                Compliant
              </span>
            </td>
          </tr>
          <tr>
            <td ref={addToCellRefs}>Boolean/None/Unicode/Endian handling</td>
            <td ref={addToCellRefs}>
              <span className="status">
                <span className="status-indicator"></span>
                Compliant
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
