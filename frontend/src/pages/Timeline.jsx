import React from 'react';
import { Video, FileSpreadsheet, PlayCircle, BarChart } from 'lucide-react';

export default function Timeline() {
  const steps = [
    {
      title: "1. Record Test Cases",
      description: "Launch the integrated Chromium browser and simply click through your web application. FlowPilot captures every interaction, click, and form fill, generating an automated Playwright script securely saved to your local environment.",
      icon: <Video size={24} color="#3b82f6" />,
      color: "#3b82f6"
    },
    {
      title: "2. Parameterize Data",
      description: "No more hardcoded data! Download a dynamically generated Excel template based on your script's inputs. Fill it with thousands of test data rows and upload it back. Map your spreadsheet columns to your test actions with our intuitive UI.",
      icon: <FileSpreadsheet size={24} color="#10b981" />,
      color: "#10b981"
    },
    {
      title: "3. Batch Execution & Looping",
      description: "Select multiple test scripts from your dashboard and define how many times you want the suite to loop. Hit run, and watch the bot take over your screen, autonomously injecting the Excel data into the test iterations.",
      icon: <PlayCircle size={24} color="#8b5cf6" />,
      color: "#8b5cf6"
    },
    {
      title: "4. Live Reporting",
      description: "Analyze the success and failure rates of your executions in real-time. Review detailed logs for each iteration and row of data to pinpoint exactly where and why a test case failed.",
      icon: <BarChart size={24} color="#f59e0b" />,
      color: "#f59e0b"
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How FlowPilot Works</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          The complete end-to-end timeline of our automated testing workflow.
        </p>
      </div>

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '35px',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'var(--border)'
        }}></div>

        {steps.map((step, index) => (
          <div key={index} style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-panel)',
              border: `2px solid ${step.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              marginTop: '4px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step.color }}></div>
            </div>

            <div className="card glass-panel" style={{ margin: 0, flex: 1 }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: step.color }}>
                {step.icon}
                {step.title}
              </h2>
              <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
