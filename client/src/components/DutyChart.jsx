import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const DutyChart = ({ duties }) => {
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const handleDownload = async () => {
        if (!tableRef.current) return;
        try {
            setLoading(true);
            const canvas = await html2canvas(tableRef.current, {
                scale: 4, // Ultra-high resolution
                backgroundColor: '#0f172a',
                useCORS: true,
                logging: false,
                width: 1200,
                windowWidth: 1200
            });
            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.href = image;
            link.download = `Sikar_Duty_Chart_${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (error) {
            console.error('Error taking screenshot:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button 
                    onClick={handleDownload} 
                    style={{ background: '#10b981', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {loading ? 'Capturing High-Res Image...' : 'Download Chart'}
                </button>
            </div>
            <div className="duty-table-container" ref={tableRef} style={{ padding: '1rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ background: '#f59e0b', color: '#000', padding: '0.5rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
                    Date - {today}
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Vehicle No.</th>
                        <th>Time</th>
                        <th>Route</th>
                        <th>Driver Name</th>
                    </tr>
                </thead>
                <tbody>
                    {duties.length > 0 ? (
                        duties.map((duty, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: 'bold', color: '#fff' }}>{duty.vehicleNo}</td>
                                <td>{duty.time}</td>
                                <td>{duty.route}</td>
                                <td>{duty.driverName}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No duties recorded yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default DutyChart;
