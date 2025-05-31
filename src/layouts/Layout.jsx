import { useLenis } from '../hooks/useLenis';
import '../styles/global.css';

export default function Layout({ children }) {
  // Initialize Lenis for smooth scrolling
  useLenis();
  
  return (
    <div className="app-container">
      {children}
    </div>
  );
}
