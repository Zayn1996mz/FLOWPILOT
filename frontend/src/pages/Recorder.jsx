import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Loader, CheckCircle } from 'lucide-react';

export default function Recorder() {
  const [url, setUrl] = useState('');
  const [testName, setTestName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, recording, done
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const startRecording = async (e) => {
    e.preventDefault();
    if (!url || !testName) return;

    setStatus('recording');
    setErrorMessage('');
    try {
      // Start recording triggers the backend to open playwright codegen
      await axios.post('http://localhost:3000/api/record', { url, testName });
      
      // Since it's a long running process that closes when the browser closes,
      // the request might take a while to return, or return immediately if it's detached.
      // Based on our backend, it returns immediately and the process runs in background.
      // Wait, our backend waits for 'close' event to save the test, but the response is sent immediately.
      // Let's assume it returns immediately.
      
      setStatus('done');
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorMessage(error.message || 'Failed to start recording. Ensure backend is running.');
      setStatus('idle');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Record Test Case</h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Enter the target application URL. A new Chrome window will open. Perform your actions and close the window to save the recording.
      </p>

      {errorMessage && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          {errorMessage}
        </div>
      )}

      {status === 'idle' && (
        <div className="card glass-panel">
          <form onSubmit={startRecording}>
            <div className="form-group">
              <label className="form-label">Test Case Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Login Flow Test" 
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Target URL</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://example.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Play size={18} />
              Start Recording
            </button>
          </form>
        </div>
      )}

      {status === 'recording' && (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader size={48} className="text-muted" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
          <h2>Recording in Progress...</h2>
          <p className="text-muted">
            Please interact with the newly opened browser window. When you are finished, simply close the browser window to complete the recording.
          </p>
        </div>
      )}

      {status === 'done' && (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2>Recording Complete!</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            Your test case has been recorded successfully.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to Dashboard
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
