import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Play, Settings2, FileSpreadsheet, Download } from 'lucide-react';

export default function Parameterization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [mapping, setMapping] = useState({});
  const [loopCount, setLoopCount] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [scheduling, setScheduling] = useState({ enabled: false, time: '' });
  
  const testIds = id ? id.split(',') : [];

  useEffect(() => {
    fetchTestDetails();
  }, [id]);

  const fetchTestDetails = async () => {
    try {
      // Just fetch the first one for mapping preview
      const response = await axios.get(`http://localhost:3000/api/tests/${testIds[0]}`);
      setTestDetails(response.data);
    } catch (error) {
      console.error('Error fetching test details:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExcelData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMappingChange = (lineNumber, column) => {
    setMapping(prev => ({
      ...prev,
      [lineNumber]: column
    }));
  };

  const downloadTemplate = () => {
    // Navigate to the download URL directly to prompt save
    window.open(`http://localhost:3000/api/tests/${testIds[0]}/template`, '_blank');
  };

  const runTest = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post('http://localhost:3000/api/run', {
        testIds: testIds,
        dataFile: excelData ? excelData.filePath : null,
        parameterMapping: mapping,
        loopCount: loopCount,
        scheduling: scheduling
      });
      if (scheduling.enabled) {
        alert('Test scheduled successfully for ' + new Date(scheduling.time).toLocaleString());
      }
      navigate('/reports');
    } catch (error) {
      console.error('Error running test:', error);
      setIsRunning(false);
    }
  };

  if (!testDetails) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Parameterize & Run</h1>
          <p className="text-muted">
            {testIds.length > 1 
              ? `Running batch of ${testIds.length} scripts sequentially.`
              : `Configure and execute your test case.`
            }
          </p>
        </div>
        <button className="btn btn-primary" onClick={runTest} disabled={isRunning}>
          <Play size={18} />
          {isRunning ? 'Running...' : 'Execute Test Run'}
        </button>
      </div>

      <div className="grid-2">
        {/* Upload Section */}
        <div className="card glass-panel">
          <h2><FileSpreadsheet size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}/> 1. Test Data</h2>
          
          {!excelData ? (
            <div style={{ marginTop: '1.5rem', border: '2px dashed var(--border)', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <input type="file" id="excel-upload" accept=".xlsx, .csv" style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor="excel-upload" className="btn btn-outline" style={{ cursor: 'pointer' }}>
                  <Upload size={18} />
                  {isUploading ? 'Uploading...' : 'Upload Excel Data'}
                </label>
                <button className="btn btn-outline" onClick={downloadTemplate}>
                  <Download size={18} />
                  Download Template
                </button>
              </div>
              <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>Upload .xlsx or .csv containing test parameters.</p>
            </div>
          ) : (
            <div style={{ marginTop: '1.5rem' }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <span className="badge passed">File Uploaded: {excelData.rowCount} rows found</span>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setExcelData(null)}>Change File</button>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Detected Columns:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {excelData.columns.map(col => (
                  <span key={col} className="badge" style={{ background: 'var(--border)' }}>{col}</span>
                ))}
              </div>
            </div>
          )}

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem' }}>Loop Configuration</h3>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Number of times to repeat this test suite</label>
            <input 
              type="number" 
              className="form-input" 
              value={loopCount}
              onChange={(e) => setLoopCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem' }}>3. Execution Scheduling</h3>
          <div className="card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={scheduling.enabled} 
                  onChange={(e) => setScheduling({...scheduling, enabled: e.target.checked})}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontWeight: '500' }}>Enable Scheduling</span>
              </label>
              {scheduling.enabled && <span className="badge" style={{ background: 'var(--accent)' }}>Scheduled Mode</span>}
            </div>
            
            {scheduling.enabled && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Run at Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-input" 
                  value={scheduling.time}
                  onChange={(e) => setScheduling({...scheduling, time: e.target.value})}
                  required={scheduling.enabled}
                  style={{ colorScheme: 'dark' }}
                />
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>
                  The test will execute automatically at the specified time. Ensure the server stays running.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mapping Section */}
        <div className="card glass-panel" style={{ gridRow: 'span 2' }}>
          <h2><Settings2 size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}/> 2. Input Mapping</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            We detected the following input actions in your recorded script. Map them to your Excel columns.
          </p>

          {testDetails.inputs.length === 0 ? (
            <p className="text-muted">No explicit text inputs detected in the script.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {testDetails.inputs.map((input, index) => (
                <div key={index} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                  <code style={{ display: 'block', marginBottom: '0.75rem', color: '#a8b2d1', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                    {input.code}
                  </code>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>Replace with:</span>
                    <select 
                      className="form-select" 
                      style={{ flex: 1, padding: '0.5rem' }}
                      value={mapping[input.line] || ''}
                      onChange={(e) => handleMappingChange(input.line, e.target.value)}
                      disabled={!excelData}
                    >
                      <option value="">-- Select Excel Column --</option>
                      {excelData && excelData.columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Script Preview */}
        <div className="card glass-panel">
          <h2>Script Preview</h2>
          <div className="code-block" style={{ maxHeight: '300px', fontSize: '0.8rem' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{testDetails.script}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
