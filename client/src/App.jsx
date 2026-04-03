import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DutyForm from './components/DutyForm';
import DutyChart from './components/DutyChart';
import DriverManagement from './components/DriverManagement';
import './index.css';

function App() {
  const [duties, setDuties] = useState([]);
  const [view, setView] = useState('form'); // 'form', 'chart', or 'drivers'
  const [globalDrivers, setGlobalDrivers] = useState(() => {
    const saved = localStorage.getItem('sikar_drivers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sikar_drivers', JSON.stringify(globalDrivers));
  }, [globalDrivers]);

  const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

  const fetchDuties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/duties/all`);
      setDuties(response.data);
    } catch (error) {
      console.error('Error fetching duties:', error);
    }
  };

  useEffect(() => {
    fetchDuties();
  }, []);

  return (
    <div className="container">
      <h1>Sikar Duty Management</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setView('form')} 
          style={{ background: view === 'form' ? 'var(--primary-hover)' : 'var(--primary)', padding: '0.6rem 1rem' }}
        >
          Duty Form
        </button>
        <button 
          onClick={() => { setView('chart'); fetchDuties(); }} 
          style={{ background: view === 'chart' ? 'var(--primary-hover)' : 'var(--primary)', padding: '0.6rem 1rem' }}
        >
          View Chart
        </button>
        <button 
          onClick={() => setView('drivers')} 
          style={{ background: view === 'drivers' ? '#2563eb' : '#3b82f6', padding: '0.6rem 1rem' }}
        >
          Manage Drivers
        </button>
      </div>

      {view === 'form' ? (
        <DutyForm 
          onDutyAdded={() => { fetchDuties(); setView('chart'); }} 
          globalDrivers={globalDrivers}
          setGlobalDrivers={setGlobalDrivers}
        />
      ) : view === 'chart' ? (
        <DutyChart duties={duties} />
      ) : (
        <DriverManagement 
          globalDrivers={globalDrivers} 
          setGlobalDrivers={setGlobalDrivers} 
        />
      )}

      {/* Font loading for Hindi support */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />

      {/* Footer / Credits */}
      <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', opacity: 0.8, paddingBottom: '1rem' }}>
        Managed by Digvijay Singh (8209421290)
      </footer>
    </div>
  );
}

export default App;
