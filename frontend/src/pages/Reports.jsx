import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
    // Poll for updates if there's a running test
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reports');
      // Sort by runId (timestamp) descending
      const sorted = response.data.sort((a, b) => Number(b.runId) - Number(a.runId));
      setReports(sorted);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Execution Reports</h1>
        <p className="text-muted">View the results of your automated test runs.</p>
      </div>

      {reports.length === 0 ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="text-muted">No test reports available yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reports.map((report) => (
            <div key={report.runId} className="card glass-panel">
              <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={20} className="text-muted" />
                    Run ID: {report.runId}
                  </h3>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {new Date(Number(report.runId)).toLocaleString()}
                  </span>
                </div>
                {report.status === 'running' ? (
                  <span className="badge running">In Progress</span>
                ) : (
                  <span className="badge passed">Completed</span>
                )}
              </div>

              {report.results && (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Iteration</th>
                      <th>Status</th>
                      <th>Input Data Snapshot</th>
                      <th>Error Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.results.map((res, idx) => (
                      <tr key={idx}>
                        <td>{res.iteration}</td>
                        <td>
                          {res.status === 'passed' ? (
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={16} /> Passed
                            </span>
                          ) : (
                            <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <XCircle size={16} /> Failed
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                            {JSON.stringify(res.data)}
                          </div>
                        </td>
                        <td style={{ color: 'var(--error)', fontSize: '0.85rem' }}>
                          {res.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
