import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Calendar, ExternalLink, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tests');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Delete button clicked for ID:", id);
    
    if (!window.confirm('Delete this test case permanently?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/tests/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log("Delete successful");
        fetchTests();
      } else {
        const error = await response.json();
        console.error("Delete failed:", error);
        alert('Error: ' + (error.error || 'Failed to delete'));
      }
    } catch (error) {
      console.error('Network error during delete:', error);
      alert('Network error. Check if backend is running.');
    }
  };

  const toggleSelection = (id) => {
    const newSet = new Set(selectedTests);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedTests(newSet);
  };

  const runSelected = () => {
    if (selectedTests.size > 0) {
      navigate(`/parameterize/${Array.from(selectedTests).join(',')}`);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Test Cases</h1>
          <p className="text-muted">Manage and execute your automated test cases.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {selectedTests.size > 0 && (
            <button className="btn btn-accent" onClick={runSelected}>
              <Play size={18} />
              Run Selected ({selectedTests.size})
            </button>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/record')}>
            <Play size={18} />
            New Recording
          </button>
        </div>
      </div>

      <div className="grid-2">
        {tests.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p className="text-muted">No test cases recorded yet.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/record')}>
              Start Recording
            </button>
          </div>
        ) : (
          tests.map(test => (
            <div key={test.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{test.name}</h3>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.has(test.id)} 
                    onChange={() => toggleSelection(test.id)}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <ExternalLink size={14} className="text-muted" />
                  <a href={test.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    {test.url}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }} className="text-muted">
                  <Calendar size={14} />
                  <span>{new Date(test.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate(`/parameterize/${test.id}`)}>
                  Run / Parameterize
                </button>
                <button 
                  className="btn btn-outline" 
                  style={{ color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.3)' }} 
                  onClick={(e) => handleDelete(test.id, e)}
                  title="Delete Test Case"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
