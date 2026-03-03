import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Background from './components/Background';
import CursorLight from './components/CursorLight';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ScrollReveal from './components/ScrollReveal';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Preloader from './components/Preloader';
import ProjectsPortal from './components/ProjectsPortal';
import './index.css';

function Portfolio() {
  const [portalOpen, setPortalOpen] = useState(false);

  return (
    <div className="app">
      <Background />
      <Preloader />
      <Navbar />
      <main>
        <Hero onPortalOpen={() => setPortalOpen(true)} />
        <ScrollReveal>
          <About />
        </ScrollReveal>
        <ScrollReveal delay={50}>
          <Skills />
        </ScrollReveal>
        <ScrollReveal>
          <Projects />
        </ScrollReveal>
        <ScrollReveal>
          <Contact />
        </ScrollReveal>
      </main>
      <BottomNav />
      <ProjectsPortal open={portalOpen} onClose={() => setPortalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminLayout />} />
    </Routes>
  );
}

