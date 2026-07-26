import { useState, useEffect } from 'react';
import { FaAngleUp, FaPhone } from "react-icons/fa6";

function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <a
        href="tel:0901234567"
        className="floating-phone"
        aria-label="Gọi điện"
        id="floating-phone"
      >
        <FaPhone />
      </a>
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        id="scroll-to-top"
      >
        <FaAngleUp />
      </button>
    </>
  );
}

export default FloatingButtons;
