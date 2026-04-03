import React, { useState } from 'react';

const DriverManagement = ({ globalDrivers, setGlobalDrivers }) => {
    const [newDriver, setNewDriver] = useState('');

    const handleAdd = () => {
        const clean = newDriver.trim();
        if (clean && !globalDrivers.includes(clean)) {
            setGlobalDrivers([...globalDrivers, clean]);
        }
        setNewDriver('');
    };

    const handleDelete = (driverToDelete) => {
        setGlobalDrivers(globalDrivers.filter(d => d !== driverToDelete));
    };

    return (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.4rem' }}>
                Manage Drivers
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Drivers added here will dynamically appear as selectable chips in the Duty Form.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <input 
                    type="text" 
                    placeholder="Enter new driver name..."
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    style={{ padding: '0.6rem', fontSize: '0.9rem', flex: 1, marginBottom: 0, borderRadius: '0.5rem' }}
                />
                <button onClick={handleAdd} style={{ padding: '0.5rem 1rem' }}>
                    Add
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {globalDrivers.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No custom drivers added yet.</p>
                ) : (
                    globalDrivers.map((driver, idx) => (
                        <div key={idx} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <span style={{ fontWeight: '600' }}>{driver}</span>
                            <button 
                                onClick={() => handleDelete(driver)}
                                style={{ background: '#ef4444', padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DriverManagement;
