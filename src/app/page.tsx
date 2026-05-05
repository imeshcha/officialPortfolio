'use client';

import React, { useState, useEffect, useRef } from 'react';

const SPOTLIGHT_COLORS = [
  'rgba(255, 89, 94, 0.6)',   // Vibrant Red
  'rgba(138, 201, 38, 0.6)',  // Vibrant Green
  'rgba(25, 130, 196, 0.6)',  // Vibrant Blue
  'rgba(255, 202, 58, 0.6)',  // Vibrant Yellow
  'rgba(106, 76, 147, 0.6)',  // Vibrant Purple
  'rgba(255, 146, 76, 0.6)',  // Vibrant Orange
  'rgba(0, 255, 153, 0.6)',   // Neon Green
  'rgba(0, 204, 255, 0.6)',   // Cyan
];

const SpotlightCard = ({ children, className, delay, style, bgImage }: { children: React.ReactNode, className?: string, delay?: string, style?: React.CSSProperties, bgImage?: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [color, setColor] = useState(SPOTLIGHT_COLORS[0]);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');

    // Observe theme changes
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    const target = e.target as HTMLElement;
    const isOverBtn = !!target.closest('.btn');
    setIsHoveringButton(isOverBtn);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
    setIsHovered(true);
    setColor(SPOTLIGHT_COLORS[Math.floor(Math.random() * SPOTLIGHT_COLORS.length)]);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setIsHovered(false);
    setIsHoveringButton(false);
  };

  return (
    <div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        position: 'relative',
        transitionDelay: delay,
        overflow: 'hidden'
      }}
    >
      {/* Background Image Effect */}
      {bgImage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) brightness(0.8)',
          opacity: isHovered && !isHoveringButton ? 0.15 : 0,
          transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
      )}

      {/* Torch Border Effect (Dark Mode only) */}
      {isDarkMode && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1.5px',
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.35), transparent 40%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 3,
          opacity: isHoveringButton ? 0 : opacity,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease'
        }} />
      )}



      {/* Spotlight Circle */}
      <div
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x,
          width: isHoveringButton ? '0px' : (isDarkMode ? '450px' : '200px'),
          height: isHoveringButton ? '0px' : (isDarkMode ? '450px' : '200px'),
          transform: 'translate(-50%, -50%)',
          background: isDarkMode
            ? `radial-gradient(circle, ${color} 0%, transparent 65%)`
            : color,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: isHoveringButton ? 0 : (isDarkMode ? opacity * 0.45 : opacity),
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease, background 0.3s ease',
        }}
      />
      <div style={{ position: 'relative', zIndex: 4, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};



export default function Home() {
  const [glitchImage, setGlitchImage] = useState(0);
  const glitchImages = [
    '/videography_abstract_1777827407954.png',
    '/coding_abstract_1777827427484.png',
    '/editing_abstract_1777827445465.png',
    '/tools_abstract_1777827461283.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchImage((prev) => (prev + 1) % glitchImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [projectCategory, setProjectCategory] = useState<'it' | 'creative'>('it');
  const [certCategory, setCertCategory] = useState<'certificates' | 'badges'>('certificates');

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // scrolling down
          setIsVisible(false);
        } else { // scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Show navbar if mouse is near the top of the screen (within 60px)
      if (e.clientY < 60) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollY]);

  // Dark Mode Logic
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [externalVideoLink, setExternalVideoLink] = useState<string | null>(null);
  const [showCVWarning, setShowCVWarning] = useState(false);

  // Contact Form State
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setFormStatus('sending');

    const formData = new FormData(formRef.current);
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE"); // Replace with your Web3Forms Access Key

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
        formRef.current.reset();
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        console.error("Error", data);
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (error) {
      console.error("Submit Error", error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dark for first time visit
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [projectCategory, certCategory]);

  return (
    <div className="standard-view">
      {/* Navigation */}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 1000,
          width: '50px',
          height: '50px',
          borderRadius: '15px',
          background: 'var(--card-bg)',
          border: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          color: 'var(--text-main)',
          transition: 'transform 0.3s ease'
        }}
        className="reveal"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {theme === 'light' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        )}
      </button>

      <nav style={{
        position: 'fixed',
        top: isVisible ? '2rem' : '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '900px',
        padding: '0.8rem 2.5rem',
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(15px)',
        borderRadius: '100px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid var(--nav-border)',
        boxShadow: theme === 'light' ? '0 10px 30px rgba(0,0,0,0.05)' : '0 10px 40px rgba(0,0,0,0.4)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Imesh.
        </a>

        {/* Desktop Nav Links */}
        <div className="nav-links-container" style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="#about" className="nav-link" style={{ '--hover-bg': 'rgba(255, 154, 162, 0.5)' } as React.CSSProperties}>About</a>
          <a href="#education" className="nav-link" style={{ '--hover-bg': 'rgba(202, 255, 191, 0.5)' } as React.CSSProperties}>Education</a>
          <a href="#certifications" className="nav-link" style={{ '--hover-bg': 'rgba(160, 196, 255, 0.5)' } as React.CSSProperties}>Certifications</a>
          <a href="#skills" className="nav-link" style={{ '--hover-bg': 'rgba(189, 178, 255, 0.5)' } as React.CSSProperties}>Skills</a>
          <a href="#projects" className="nav-link" style={{ '--hover-bg': 'rgba(200, 230, 255, 0.5)' } as React.CSSProperties}>Projects</a>
          <a href="#contact" className="nav-link" style={{ '--hover-bg': 'rgba(215, 204, 255, 0.5)' } as React.CSSProperties}>Contact</a>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none', /* Shown via CSS on mobile */
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            marginTop: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            border: '1px solid var(--nav-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>About</a>
            <a href="#education" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>Education</a>
            <a href="#certifications" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>Certifications</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>Skills</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>Projects</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--cream-bg)',
        padding: '8% 8% 2% 8%',
        position: 'relative'
      }}>
        {/* Animated Background Elements */}
        <div className="hero-bg-animation" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, rgba(196, 181, 165, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float-slow 20s infinite alternate ease-in-out'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '35vw',
            height: '35vw',
            background: 'radial-gradient(circle, rgba(196, 181, 165, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            animation: 'float-slow 25s infinite alternate-reverse ease-in-out'
          }}></div>
        </div>

        {/* Logic & Vision Sidebar Animation */}
        <div style={{
          position: 'absolute',
          left: '12%',
          top: '15%',
          bottom: '15%',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '2rem',
          opacity: 0.25,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          overflow: 'hidden'
        }}>
          {/* Dual Glitching Image Strips */}
          <div className="glitch" data-text="" style={{ width: '100%', height: '500px', position: 'relative' }}>
            {/* Primary Strip */}
            <img
              key={`primary-${glitchImage}`}
              src={glitchImages[glitchImage]}
              alt="Creative Vision"
              style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                clipPath: 'inset(0 40% 0 0)',
                filter: 'grayscale(60%) contrast(120%)',
                animation: 'glitch-image 0.2s infinite',
                display: 'block'
              }}
            />
            {/* Secondary Smaller Strip */}
            <img
              key={`secondary-${glitchImage}`}
              src={glitchImages[glitchImage]}
              alt="Creative Vision"
              style={{
                position: 'absolute',
                left: '80%',
                top: '15%',
                width: '100%',
                height: '70%',
                objectFit: 'cover',
                clipPath: 'inset(0 70% 0 0)',
                filter: 'grayscale(40%) contrast(140%) opacity(0.6)',
                animation: 'glitch-image 0.3s infinite reverse',
                display: 'block'
              }}
            />
            {/* Supporting Text Overlay */}
            <div style={{ position: 'absolute', top: '10%', left: '40%', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '0.2em' }}>
              <div style={{ marginBottom: '0.5rem', whiteSpace: 'nowrap' }}>DATA_STREAM: ACTIVE</div>
              <div style={{ opacity: 0.5 }}>FRAME_SCAN: 00:00:{Math.floor(Math.random() * 60)}</div>
            </div>
          </div>
        </div>

        {/* Top Content: Info & Tagline */}
        <div className="reveal" style={{ zIndex: 10, maxWidth: '600px', position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1.2rem',
            background: 'var(--cream-surface)',
            borderRadius: '50px',
            marginBottom: '2rem',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
            <span style={{ color: 'var(--text-main)', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Available for work
            </span>
          </div>

          <p style={{ fontSize: 'max(1.5rem, 2vw)', color: 'var(--text-muted)', lineHeight: '1.3', marginBottom: '3rem', fontWeight: '500' }}>
            <span className="glitch" data-text="Capturing Logic.">Capturing Logic.</span> <br />
            <span className="glitch" data-text="Editing Reality." style={{ color: 'var(--text-main)', fontWeight: '800' }}>Editing Reality.</span>
          </p>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn"
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              View Work
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn"
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: '1.5px solid var(--text-main)',
                padding: '1rem 2.5rem',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Content: Massive Name */}
        <div className="reveal hero-name-container" style={{ zIndex: 1, transitionDelay: '0.3s' }}>
          <h1 className="hero-title" style={{
            fontWeight: '900',
            color: 'var(--text-main)',
            margin: 0,
            textTransform: 'uppercase',
            opacity: 1
          }}>
            IMESH<br />
            <span style={{ color: 'var(--accent)' }}>CHATHURA</span>
          </h1>
        </div>

      </section>

      <section id="about" className="section" style={{
        backgroundColor: 'var(--about-bg)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 8% 8% 8%'
      }}>
        <div className="container">
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="glitch" data-text="About Me">About Me</span>
          </h2>
          <div className="about-content" style={{
            display: 'flex',
            gap: '5rem',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: '2rem'
          }}>
            {/* Left Side: Image */}
            <div className="reveal" style={{ flex: '0 0 40%', position: 'relative', display: 'flex', alignItems: 'center', transitionDelay: '0.3s' }}>
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                width: '100%',
                aspectRatio: '4/5',
                background: 'var(--cream-surface)'
              }}>
                <img
                  src="/my.jpg"
                  alt="Imesh Chathura"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right Side: Details */}
            <div className="reveal" style={{ flex: '1', textAlign: 'left', transitionDelay: '0.5s' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                Blending Technical Logic with Visual Excellence
              </h3>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Hello! I am Imesh Chathra, a forward-thinking developer and visual storyteller based in Ratnapura, Sri Lanka. Currently, I am an undergraduate pursuing a BICT (Hons) degree at the South Eastern University of Sri Lanka.
              </p>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                I sit at the intersection of code and creativity. My technical focus is dedicated to the world of Decentralized Technologies (Web3) and Artificial Intelligence, where I build purposeful, consumer-centric web applications designed to solve real-world problems.
              </p>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                When I am not architecting digital solutions, I am behind the lens. As a cinematographer and video editor, I combine technical precision with artistic vision to craft compelling visual narratives. Whether through a lines of code or a cinematic sequence, I am driven by the desire to innovate and create impactful experiences.
              </p>
              <a
                href="#education"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                My Journey
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="education" className="section" style={{ backgroundColor: 'var(--education-bg)', paddingTop: '5%' }}>
        <div className="container">
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s', '--glitch-bg': 'var(--education-bg)' } as React.CSSProperties}>
            <span className="glitch" data-text="Educational Journey">Educational Journey</span>
          </h2>
          <div className="grid" style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            display: 'grid'
          }}>

            {/* University */}
            <SpotlightCard className="card reveal" delay="0.2s">
              <div className="card-content" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', display: 'block' }}>
                  Higher Education
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                  BICT (Hons) Undergraduate
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                  South Eastern University of Sri Lanka
                </p>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    Specializing in Software Engineering and Information Systems. Focusing on building scalable digital architectures and exploring decentralized technologies.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                      Software Engineering Focus
                    </li>
                    <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                      Data Structures & Algorithms
                    </li>
                  </ul>
                </div>
              </div>
            </SpotlightCard>

            {/* A/L */}
            <SpotlightCard className="card reveal" delay="0.4s">
              <div className="card-content" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', display: 'block' }}>
                  Advanced Level
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                  Technology Stream
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                  St.Aloysius College, Ratnapura
                </p>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    Completed GCE A/L in the Technology stream, gaining a comprehensive understanding of engineering principles and information communication technology.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                      Information & Communication Tech
                    </li>
                    <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                      Engineering Technology Focus
                    </li>
                  </ul>
                </div>
              </div>
            </SpotlightCard>

            {/* O/L */}
            <SpotlightCard className="card reveal" delay="0.6s">
              <div className="card-content" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', display: 'block' }}>
                  Ordinary Level
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                  GCE Ordinary Level
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                  St.Aloysius College, Ratnapura
                </p>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    Achieved 9 A-Grade passes including Mathematics, Science, and Information Technology, setting the stage for a career in engineering.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                      4 'A' & 5 'B' Passes Achievement
                    </li>
                    <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                      Early Interest in Tech
                    </li>
                  </ul>
                </div>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </section>

      <section id="certifications" className="section" style={{ backgroundColor: 'var(--cert-bg)', paddingTop: '5%' }}>
        <div className="container">
          <h2 className="section-title reveal" style={{
            transitionDelay: '0.1s',
            color: 'var(--text-main)',
            '--glitch-bg': 'var(--cert-bg)'
          } as React.CSSProperties}>
            <span className="glitch" data-text="Certifications">Certifications</span>
          </h2>

          {/* Certification Toggle */}
          <div className="reveal" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '4rem'
          }}>
            <button
              onClick={() => setCertCategory('certificates')}
              className="btn"
              style={{
                backgroundColor: certCategory === 'certificates' ? 'var(--text-main)' : 'transparent',
                color: certCategory === 'certificates' ? 'var(--cream-bg)' : 'var(--text-main)',
                border: '1px solid var(--text-main)',
                padding: '0.8rem 2rem'
              }}
            >
              Certificates
            </button>
            <button
              onClick={() => setCertCategory('badges')}
              className="btn"
              style={{
                backgroundColor: certCategory === 'badges' ? 'var(--text-main)' : 'transparent',
                color: certCategory === 'badges' ? 'var(--cream-bg)' : 'var(--text-main)',
                border: '1px solid var(--text-main)',
                padding: '0.8rem 2rem'
              }}
            >
              Badges
            </button>
          </div>

          <div key={certCategory} className="grid animate-fade-in" style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            display: 'grid'
          }}>

            {certCategory === 'certificates' ? (
              <>
                <SpotlightCard className="card reveal" delay="0.1s">
                  <div
                    className="card-image"
                    style={{ cursor: 'zoom-in' }}
                    onClick={() => setSelectedCert("/certificates/cert01.png")}
                  >
                    <img src="/certificates/cert01.png" alt="Simplilearn Certified Blockchain Developer" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Blockchain Development
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                      Certified Blockchain Developer
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1rem' }}>
                      Simplilearn Academy
                    </p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      In-depth mastery of blockchain development and decentralized application architecture.
                    </p>
                    <a href="https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiI4OTgiLCJjZXJ0aWZpY2F0ZV91cmwiOiJodHRwczpcL1wvY2VydGlmaWNhdGVzLnNpbXBsaWNkbi5uZXRcL3NoYXJlXC90aHVtYl80NTQyMDU1XzE2OTU4NzA1MzkucG5nIiwidXNlcm5hbWUiOiJJbWVzaCBDaGF0aHVyYSBLdW1hcmEifQ%3D%3D&referrer=https%3A%2F%2Flms.simplilearn.com%2Fdashboard%2Fcertificate&%24web_only=true" target="_blank" rel="noopener noreferrer" className="btn project-btn">
                      View certificate
                    </a>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="card reveal" delay="0.2s">
                  <div
                    className="card-image"
                    style={{ cursor: 'zoom-in' }}
                    onClick={() => setSelectedCert("/certificates/cert02.png")}
                  >
                    <img src="/certificates/cert02.png" alt="Binance BNB Chain Developer Specialization" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Blockchain Development
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                      BNB Chain Developer Specialization
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1rem' }}>
                      Binance Academy
                    </p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      This equips me with practical skills in smart contract development, dApp creation, and ecosystem integration on BNBChain.
                    </p>
                    <a href="https://www.binance.com/en/academy/courses/certificate/df9cdd766e3801f51bb773d9a14f6d68c963f44ec217497b15bbbff060396957" target="_blank" rel="noopener noreferrer" className="btn project-btn">
                      View certificate
                    </a>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="card reveal" delay="0.3s">
                  <div
                    className="card-image"
                    style={{ cursor: 'zoom-in' }}
                    onClick={() => setSelectedCert("/certificates/cert03.png")}
                  >
                    <img src="/certificates/cert03.png" alt="FreeCodeCamp Responsive Web Design" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Front-End Development
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                      Responsive Web Design
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1rem' }}>
                      FreeCodeCamp
                    </p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Expertise in Responsive and Modern Front-End Development.
                    </p>
                    <a href="https://www.freecodecamp.org/certification/s_a_imesh_chathura_kumara/responsive-web-design" target="_blank" rel="noopener noreferrer" className="btn project-btn">
                      View certificate
                    </a>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="card reveal" delay="0.4s">
                  <div
                    className="card-image"
                    style={{ cursor: 'zoom-in' }}
                    onClick={() => setSelectedCert("/certificates/cert04.jpg")}
                  >
                    <img src="/certificates/cert04.jpg" alt="Bitget Blockchain and Web3 Essentials" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Blockchain Development
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                      Blockchain and Web3 Essentials
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1rem' }}>
                      Blockchain4Youth | Bitget
                    </p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      This program gave me a strong foundation in blockchain technology and its applications, including cryptography, consensus algorithms, and smart contracts.
                    </p>
                    <a href="https://www.bitget.com/promotion/blockchain4youth/completion" target="_blank" rel="noopener noreferrer" className="btn project-btn">
                      View certificate
                    </a>
                  </div>
                </SpotlightCard>
              </>
            ) : (
              <>
                {/* Placeholder Badges */}
                <SpotlightCard className="card reveal" delay="0.1s">
                  <div className="card-image" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/badges/solidity.png" alt="Solidity Badge" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                  </div>
                  <div className="card-content" style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Blockchain</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Smart Contract Master</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Verified proficiency in Solidity and Smart Contract security.</p>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="card reveal" delay="0.2s">
                  <div className="card-image" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/badges/react.png" alt="React Badge" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                  </div>
                  <div className="card-content" style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Frontend</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Advanced React Developer</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Mastery of React hooks, context, and performance optimization.</p>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="card reveal" delay="0.3s">
                  <div className="card-image" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/badges/github.png" alt="GitHub Badge" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                  </div>
                  <div className="card-content" style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Open Source</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Top Contributor</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Recognized for significant contributions to the open source community.</p>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="card reveal" delay="0.4s">
                  <div className="card-image" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/badges/ai.png" alt="AI Badge" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                  </div>
                  <div className="card-content" style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI & ML</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>AI Solutions Architect</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Expertise in designing and deploying AI-driven application logic.</p>
                  </div>
                </SpotlightCard>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section" style={{ backgroundColor: 'var(--cream-surface)' }}>
        <div className="container">
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="glitch" data-text="Skills">Skills</span>
          </h2>

          {/* Technical Skills */}
          <div style={{ marginBottom: '5rem' }}>
            <h3 className="reveal" style={{ fontSize: '1.75rem', marginBottom: '2.5rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-main)' }}>Technical Skills</h3>
            <div className="grid" style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              display: 'grid'
            }}>
              {[
                {
                  name: 'Frontend Development',
                  description: 'Specializing in crafting highly interactive, responsive, and performance-optimized user interfaces using modern JavaScript frameworks and animation libraries.',
                  tools: 'React, Next.js, Tailwind CSS, Framer Motion',
                  points: ['Develop responsive user interfaces', 'Implement complex animations', 'Optimize performance and SEO'],
                  bgImage: '/skills/frontend.png'
                },
                {
                  name: 'Blockchain Development',
                  description: 'Designing and implementing secure, scalable decentralized architectures and robust smart contracts for the evolving Web3 ecosystem.',
                  tools: 'Solidity, Hardhat, Ethers.js, MetaMask',
                  points: ['Write and audit smart contracts', 'Integrate Web3 wallets', 'Build DeFi solutions'],
                  bgImage: '/skills/blockchain.png'
                },
                {
                  name: 'Prompt Engineering',
                  description: 'Mastering the art of AI communication to automate complex workflows and generate high-precision, creative outputs using advanced LLM techniques.',
                  tools: 'OpenAI API, Claude, LangChain, Midjourney',
                  points: ['Design high-accuracy AI prompts', 'Automate workflows using LLMs', 'Fine-tune models for use cases'],
                  bgImage: '/skills/prompt.png'
                },
                {
                  name: 'Java Development',
                  description: 'Engineering enterprise-grade backend solutions with a focus on distributed systems, data integrity, and high-availability server architecture.',
                  tools: 'Java, Spring Boot, Hibernate, MySQL',
                  points: ['Build backend microservices', 'Manage database architecture', 'Develop enterprise solutions'],
                  bgImage: '/skills/java.png'
                }
              ].map((skill, index) => (
                <SpotlightCard key={index} className="card reveal" delay={`${index * 0.1 + 0.2}s`} bgImage={skill.bgImage}>
                  <div className="card-content" style={{ padding: '2rem', textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Top Section: Header & Description */}
                    <div>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                        {skill.name}
                      </h3>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        {skill.description}
                      </p>
                    </div>

                    {/* Middle Section: Impact Points */}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#60a5fa', display: 'block', marginBottom: '0.6rem' }}>Impact</span>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {skill.points.map((point, i) => (
                          <li key={i} style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            marginBottom: '0.4rem',
                            paddingLeft: '1rem',
                            position: 'relative',
                            lineHeight: '1.4'
                          }}>
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: '0.6rem',
                              width: '6px',
                              height: '1px',
                              background: 'var(--accent)'
                            }}></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Section: Stack (Tools) */}
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(196, 181, 165, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2dd4bf' }}>Stack & Tools</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {skill.tools.split(',').map((tool, i) => (
                          <span key={i} style={{
                            fontSize: '0.8rem',
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(196, 181, 165, 0.1)',
                            borderRadius: '4px',
                            color: 'var(--text-main)',
                            fontWeight: '600'
                          }}>
                            {tool.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Creative Skills */}
          <div>
            <h3 className="reveal" style={{ fontSize: '1.75rem', marginBottom: '2.5rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-main)' }}>Creative Skills</h3>
            <div className="grid" style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              display: 'grid'
            }}>
              {[
                {
                  name: 'Video Editing',
                  description: 'Crafting compelling visual narratives through advanced pacing, seamless transitions, and professional-grade post-production storytelling techniques.',
                  tools: 'DaVinci Resolve, Premiere Pro, After Effects',
                  points: ['Cinematic color grading', 'Motion graphics design', 'High-impact narrative assembly'],
                  bgImage: '/skills/video.png'
                },
                {
                  name: 'Photo Editing',
                  description: 'Transforming raw imagery into high-end professional visual assets through meticulous color science and advanced digital manipulation.',
                  tools: 'Photoshop, Lightroom, Capture One',
                  points: ['High-end skin retouching', 'Advanced color grading', 'Digital compositing'],
                  bgImage: '/skills/photo.png'
                },
                {
                  name: 'Cinematography',
                  description: 'Capturing high-fidelity visual stories with a deep understanding of lighting, composition, and cinematic camera movement.',
                  tools: 'Blackmagic Design, Sony Alpha, DJI Ecosystem',
                  points: ['Professional lighting design', 'Camera rig management', 'Complex shot execution'],
                  bgImage: '/skills/cinema.png'
                },
                {
                  name: 'Content Writing',
                  description: 'Developing high-impact content strategies that blend technical accuracy with engaging storytelling to reach global audiences.',
                  tools: 'Notion, Grammarly, SEO Surfer',
                  points: ['Technical blog writing', 'Scriptwriting for media', 'Brand voice development'],
                  bgImage: '/skills/writing.png'
                }
              ].map((skill, index) => (
                <SpotlightCard key={index} className="card reveal" delay={`${index * 0.1 + 0.3}s`} bgImage={skill.bgImage}>
                  <div className="card-content" style={{ padding: '2rem', textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Top Section: Header & Description */}
                    <div>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                        {skill.name}
                      </h3>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        {skill.description}
                      </p>
                    </div>

                    {/* Middle Section: Impact Points */}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#60a5fa', display: 'block', marginBottom: '0.6rem' }}>Impact</span>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {skill.points.map((point, i) => (
                          <li key={i} style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            marginBottom: '0.4rem',
                            paddingLeft: '1rem',
                            position: 'relative',
                            lineHeight: '1.4'
                          }}>
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: '0.6rem',
                              width: '6px',
                              height: '1px',
                              background: 'var(--accent)'
                            }}></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Section: Stack (Tools) */}
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(196, 181, 165, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fb923c' }}>Creative Stack</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {skill.tools.split(',').map((tool, i) => (
                          <span key={i} style={{
                            fontSize: '0.8rem',
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(196, 181, 165, 0.1)',
                            borderRadius: '4px',
                            color: 'var(--text-main)',
                            fontWeight: '600'
                          }}>
                            {tool.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section" style={{ backgroundColor: 'var(--cream-bg)' }}>
        <div className="container">
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="glitch" data-text="Selected Projects">Selected Projects</span>
          </h2>

          {/* Category Toggle */}
          <div className="reveal" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '4rem'
          }}>
            <button
              onClick={() => setProjectCategory('it')}
              className="btn"
              style={{
                backgroundColor: projectCategory === 'it' ? 'var(--text-main)' : 'transparent',
                color: projectCategory === 'it' ? 'var(--cream-bg)' : 'var(--text-main)',
                border: '1px solid var(--text-main)',
                padding: '0.8rem 2rem'
              }}
            >
              Technical Products
            </button>
            <button
              onClick={() => setProjectCategory('creative')}
              className="btn"
              style={{
                backgroundColor: projectCategory === 'creative' ? 'var(--text-main)' : 'transparent',
                color: projectCategory === 'creative' ? 'var(--cream-bg)' : 'var(--text-main)',
                border: '1px solid var(--text-main)',
                padding: '0.8rem 2rem'
              }}
            >
              Creative Products
            </button>
          </div>

          <div key={projectCategory} className="grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>

            {projectCategory === 'it' ? (
              <>
                {/* IT Project 1 */}
                <SpotlightCard className="card" delay="0.1s">
                  <div className="card-image">
                    <img src="/ZingPay.png" alt="DeFi Dashboard" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Blockchain & Web3</span>
                    <h3 style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>ZingPay Agentic Payment Gateway</h3>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                      An AI-powered payment gateway that streamlines transactions and automates financial workflows.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Next.js</span>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Ethereum</span>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Solidity</span>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Groq API</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <a href="https://agent-pay-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '0.9rem', padding: '0.8rem 2rem' }}>View Live Demo</a>
                      <a href="https://github.com/imeshcha/agentPay" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '0.9rem', padding: '0.8rem 2rem' }}>Github</a>
                    </div>
                  </div>
                </SpotlightCard>

                {/* IT Project 2 */}
                <SpotlightCard className="card" delay="0.2s">
                  <div className="card-image">
                    <img src="/pro2_promptstudio.png" alt="AI Automator" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Artificial Intelligence</span>
                    <h3 style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>Prompt Engineering Studio</h3>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                      The studio that makes quality and productive prompts for your desired works like Video, Image and Document generation.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Gemini API</span>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Next.js</span>
                    </div>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="btn project-btn" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>Github</a>
                  </div>
                </SpotlightCard>


              </>
            ) : (
              <>
                {/* Creative Project 1 */}
                <SpotlightCard className="card" delay="0.1s">
                  <div className="card-image">
                    <img src="https://pbs.twimg.com/amplify_video_thumb/2003020364872560641/img/pm1QWDnkqzlqGFrK.jpg" alt="Dynamic Typography Motion Preview" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cinematography</span>
                    <h3 style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>Dynamic Typography Motion</h3>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                      A high-impact motion graphics piece utilizing kinetic typography to elevate brand identity and community engagement through cinematic storytelling.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>DaVinci Resolve</span>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Motion Design</span>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Blackmagic Fusion</span>
                    </div>
                    <button
                      onClick={() => setExternalVideoLink("https://x.com/imesh_chathura/status/2003020875965329459/video/1")}
                      className="btn project-btn"
                      style={{ marginTop: '2rem', fontSize: '0.9rem', border: 'none' }}
                    >
                      Watch Animation
                    </button>
                  </div>
                </SpotlightCard>

                {/* Creative Project 2 */}
                <SpotlightCard className="card" delay="0.2s">
                  <div className="card-image">
                    <img src="/ProjectPreviews/creative02.png" alt="Awurudu Intro Video" />
                  </div>
                  <div className="card-content">
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Motion Graphic Video</span>
                    <h3 style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>Awurudu Intro Video</h3>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                      Animated Intro video for New Year greetings. Created for the University Media Unit.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>DaVinci Resolve</span>
                      <span className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>DaVinci Fusion</span>
                    </div>
                    <button
                      onClick={() => setExternalVideoLink("https://mega.nz/file/hvwm1IaI#f8Zr-9_naAF1ePGMRUH48yFTh10uEZt44Lyfoptzx38")}
                      className="btn project-btn"
                      style={{ marginTop: '2rem', fontSize: '0.9rem', border: 'none' }}
                    >
                      View Animation
                    </button>
                  </div>
                </SpotlightCard>


              </>
            )}

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ backgroundColor: 'var(--cream-surface)', padding: '120px 0' }}>
        <div className="container">
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s', marginBottom: '5rem' }}>
            <span className="glitch" data-text="Get In Touch">Get In Touch</span>
          </h2>

          <div className="contact-container" style={{ display: 'flex', gap: '6rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Left Side: Form */}
            <div className="reveal contact-form-card" style={{
              flex: '1 1 500px',
              transitionDelay: '0.2s',
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '3rem',
              borderRadius: '40px',
              boxShadow: theme === 'dark' ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.05)',
              minWidth: '0'
            }}>
              <form ref={formRef} onSubmit={sendEmail} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input type="hidden" name="from_name" value="Portfolio Contact" />
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <input type="text" name="name" placeholder="Full Name" className="input-field" style={{ flex: '1 1 240px', padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.08)', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', fontSize: '1rem', color: 'var(--text-main)' }} required />
                  <input type="email" name="email" placeholder="Email Address" className="input-field" style={{ flex: '1 1 240px', padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.08)', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', fontSize: '1rem', color: 'var(--text-main)' }} required />
                </div>
                <input type="text" name="subject" placeholder="Project Title / Subject" className="input-field" style={{ padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.08)', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', fontSize: '1rem', color: 'var(--text-main)' }} required />
                <textarea name="message" placeholder="Your Message" className="input-field" rows={6} style={{ padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.08)', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', fontSize: '1rem', resize: 'none', color: 'var(--text-main)' }} required></textarea>
                <button
                  type="submit"
                  className="btn"
                  disabled={formStatus === 'sending'}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '15px',
                    border: 'none',
                    cursor: formStatus === 'sending' ? 'not-allowed' : 'pointer',
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: formStatus === 'sending' ? 0.7 : 1
                  }}
                >
                  {formStatus === 'idle' && 'Send Message'}
                  {formStatus === 'sending' && 'Sending...'}
                  {formStatus === 'success' && 'Message Sent!'}
                  {formStatus === 'error' && 'Error! Try Again'}
                </button>
              </form>
            </div>

            {/* Right Side: Info & Socials */}
            <div className="reveal contact-info-card" style={{ flex: '1 1 400px', transitionDelay: '0.4s', minWidth: '0' }}>
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-0.03em' }}>
                  Let's create something extraordinary together.
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
                  Thank you for taking the time to explore my portfolio! I'm always open to new opportunities, collaborations, or even just a friendly tech chat. Drop me a message and I'll get back to you as soon as possible.
                </p>

                <div style={{ marginBottom: '3rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>Direct Mail</span>
                  <a href="mailto:saimeshchathurak@gmail.com" style={{ fontSize: '1.5rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '700', transition: 'color 0.3s' }}>
                    saimeshchathurak@gmail.com
                  </a>
                </div>

                <div style={{ marginBottom: '4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', display: 'block', marginBottom: '1.5rem' }}>Connect With Me</span>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {[
                      { name: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, url: '#' },
                      { name: 'GitHub', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>, url: '#' },
                      { name: 'X', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, url: '#' },
                      { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, url: '#' },
                      { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, url: '#' },
                      { name: 'TikTok', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>, url: '#' },
                      { name: 'YouTube', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>, url: '#' }
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'var(--text-main)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          borderRadius: '15px',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.background = 'var(--accent)';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                          e.currentTarget.style.color = 'var(--text-main)';
                        }}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowCVWarning(true)}
                  className="btn click-animation"
                  style={{
                    padding: '1.2rem 3rem',
                    borderRadius: '15px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    background: 'transparent',
                    border: '2px solid var(--text-main)',
                    color: 'var(--text-main)',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--text-main)';
                    e.currentTarget.style.color = 'var(--cream-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 0', textAlign: 'center', backgroundColor: 'var(--cream-surface)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Imesh Chathura. All rights reserved.
        </p>
      </footer>
      {/* External Video Warning Modal */}
      {externalVideoLink && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(15px)',
            padding: '2rem'
          }}
        >
          <div style={{
            background: theme === 'dark' ? '#111' : '#fff',
            border: '1px solid rgba(196, 181, 165, 0.2)',
            padding: '2.5rem 2rem',
            borderRadius: '32px',
            maxWidth: '440px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle corner accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}></div>

            <div style={{
              width: '70px',
              height: '70px',
              background: 'rgba(196, 181, 165, 0.1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--accent)',
              transform: 'rotate(-10deg)'
            }}>
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
              </svg>
            </div>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Transitioning to <br /> <span style={{ color: 'var(--accent)' }}>External Screen</span>
            </h3>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1rem' }}>
              You are moving to a third-party platform to view this production. <br />
              <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>Note:</span> This video can contains audio. Please adjust your volume based on your environment before proceeding.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setExternalVideoLink(null)}
                className="click-animation"
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '14px',
                  background: 'transparent',
                  border: '1px solid rgba(196, 181, 165, 0.3)',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-main)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(196, 181, 165, 0.3)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Go Back
              </button>
              <a
                href={externalVideoLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setExternalVideoLink(null)}
                className="click-animation"
                style={{
                  padding: '0.8rem 2rem',
                  borderRadius: '14px',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: '800',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 10px 20px rgba(196, 181, 165, 0.2)',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Proceed
              </a>
            </div>
          </div>
        </div>
      )}
      {/* CV Warning Modal */}
      {showCVWarning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(15px)',
            padding: '2rem'
          }}
        >
          <div style={{
            background: theme === 'dark' ? '#111' : '#fff',
            border: '1px solid rgba(196, 181, 165, 0.2)',
            padding: '2.5rem 2rem',
            borderRadius: '32px',
            maxWidth: '440px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle corner accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}></div>

            <div style={{
              width: '70px',
              height: '70px',
              background: 'rgba(196, 181, 165, 0.1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--accent)'
            }}>
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Resume <br /> <span style={{ color: 'var(--accent)' }}>Under Maintenance</span>
            </h3>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1rem' }}>
              My comprehensive CV is currently being updated to include my latest projects and achievements. <br />
              <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>Available soon!</span>
            </p>

            <button
              onClick={() => setShowCVWarning(false)}
              className="click-animation"
              style={{
                padding: '0.8rem 2.5rem',
                borderRadius: '14px',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(196, 181, 165, 0.2)',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
      {/* Certificate Modal */}
      {selectedCert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedCert(null)}
        >
          <div style={{
            position: 'relative',
            width: 'min(1000px, 90vw)',
            aspectRatio: '1.4 / 1',
            animation: 'fadeIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedCert(null); }}
              style={{
                position: 'absolute',
                top: '-3.5rem',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '2.5rem',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'opacity 0.3s',
                zIndex: 2001
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              &times;
            </button>
            <img
              src={selectedCert}
              alt="Certificate"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 0 60px rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
