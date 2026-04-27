import React from 'react';
import { Cpu, Globe, Database, ShieldCheck, Zap, Code2 } from 'lucide-react';

export default function TechStack() {
  const techs = [
    {
      name: "React & Vite",
      category: "Frontend Framework",
      description: "A modern, high-performance frontend stack for building a fast and responsive User Interface with optimized build times.",
      icon: <Globe size={32} color="#61dbfb" />,
      skills: ["React 18", "Vite", "React Router", "Lucide Icons"]
    },
    {
      name: "Playwright",
      category: "Automation Engine",
      description: "A powerful framework for Web Testing and Automation that enables cross-browser testing with a single API.",
      icon: <Zap size={32} color="#2e8b57" />,
      skills: ["Codegen", "Headless/Headful Mode", "Browser Contexts", "Screenshots"]
    },
    {
      name: "Node.js & Express",
      category: "Backend Engine",
      description: "Scalable server-side environment using Express for handling API requests and managing child processes for automation.",
      icon: <Cpu size={32} color="#68a063" />,
      skills: ["Node.js v20+", "Express", "Child Processes", "FileSystem API"]
    },
    {
      name: "Excel & Data Processing",
      category: "Data Management",
      description: "Advanced data-driven testing using Excel parsing to enable bulk test iterations with dynamic parameters.",
      icon: <Database size={32} color="#1d6f42" />,
      skills: ["XLSX Library", "Buffer Management", "JSON Mapping", "Multer Storage"]
    },
    {
      name: "Glassmorphism UI",
      category: "Design System",
      description: "A premium, modern design aesthetic featuring blurred backgrounds, vibrant gradients, and smooth transitions.",
      icon: <ShieldCheck size={32} color="#a855f7" />,
      skills: ["Vanilla CSS", "Backdrop Filters", "CSS Variables", "Responsive Design"]
    },
    {
      name: "Agentic Architecture",
      category: "Integration",
      description: "The application is built to bridge the gap between user intent and complex browser automation via an intuitive dashboard.",
      icon: <Code2 size={32} color="#f43f5e" />,
      skills: ["RESTful APIs", "Axios", "Error Handling", "Process Management"]
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Tools & Techniques</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          FlowPilot is powered by a stack of cutting-edge technologies and modern engineering practices to ensure reliability and speed.
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {techs.map((tech, index) => (
          <div key={index} className="card glass-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem' }}>
                {tech.icon}
              </div>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{tech.name}</h3>
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.5rem' }}>
                  {tech.category}
                </span>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
              {tech.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tech.skills.map(skill => (
                <span key={skill} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'var(--border)', color: 'var(--text-main)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card glass-panel" style={{ marginTop: '4rem', textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Engineering Philosophy</h2>
        <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
          We focus on **Vanilla implementation** where possible to reduce dependency bloat, ensuring that FlowPilot remains lightweight and maintainable while providing a state-of-the-art automation experience.
        </p>
      </div>
    </div>
  );
}
