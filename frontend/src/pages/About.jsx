import React from 'react';
import { ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';

export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>About FlowPilot</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          At FlowPilot, we believe software testing should be fast, reliable, and effortless. Built with a focus on modern development needs, FlowPilot is a powerful SQA automation tool designed to streamline testing workflows and improve software quality with precision.
        </p>
      </div>

      <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          FlowPilot helps teams eliminate repetitive manual testing by enabling seamless automation, intelligent execution, and clear reporting. Whether you're working on small applications or large-scale systems, our platform empowers QA engineers and developers to maintain high standards without slowing down delivery.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card glass-panel" style={{ margin: 0 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
            <Zap size={24} /> Our Mission
          </h2>
          <p style={{ lineHeight: '1.6' }}>
            Our mission is simple: to make software testing smarter, faster, and more efficient through automation. We aim to reduce the complexity of QA processes while increasing confidence in every release.
          </p>
        </div>
        <div className="card glass-panel" style={{ margin: 0 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Users size={24} /> Our Vision
          </h2>
          <p style={{ lineHeight: '1.6' }}>
            We envision a future where software testing is fully integrated, intelligent, and effortless — allowing teams to focus more on innovation and less on repetitive tasks.
          </p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>What We Offer</h2>
      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        <div className="card glass-panel" style={{ margin: 0, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--primary)' }}>
            <Zap size={20} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Automated Test Workflows</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Easily design and execute automated test cases</p>
          </div>
        </div>
        <div className="card glass-panel" style={{ margin: 0, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--primary)' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Scalable Testing Solutions</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Built to support growing applications and teams</p>
          </div>
        </div>
        <div className="card glass-panel" style={{ margin: 0, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--primary)' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Accurate Reporting</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Clear insights to identify issues quickly</p>
          </div>
        </div>
        <div className="card glass-panel" style={{ margin: 0, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>User-Friendly Interface</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Designed for both beginners and experienced QA engineers</p>
          </div>
        </div>
      </div>

      <div className="card glass-panel" style={{ textAlign: 'center', background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Developed By</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          <strong>FlowPilot</strong> is proudly developed by <strong>Zain Shahid</strong>, a passionate software engineer dedicated to building efficient and scalable solutions in the field of Software Quality Assurance and automation.
        </p>
        <p className="text-muted" style={{ lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          With a strong focus on innovation and usability, Zain Shahid created FlowPilot to address real-world challenges faced by QA teams and developers in modern software environments.
        </p>
        <h3 style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
          "Because testing shouldn’t slow you down — it should move you forward."
        </h3>
      </div>
    </div>
  );
}
