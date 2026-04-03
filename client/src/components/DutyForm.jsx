import React, { useState } from 'react';
import axios from 'axios';

const defaultDuties = [
    { vehicleNo: 'RJ14PF9610', time: '4:00 AM', route: 'SKR-DLH-SKR', driverName: 'मुकेश पुरी' },
    { vehicleNo: 'RJ20PB9613', time: '5:00 AM', route: 'SKR-DLH', driverName: 'mahendra singh' },
    { vehicleNo: 'RJ20PB2393', time: '06:20 AM', route: 'SKR-JPR-LDN', driverName: 'बाबू लाल' },
    { vehicleNo: 'RJ20PB2395', time: '06:30 AM', route: 'SKR-DLH-SKR', driverName: 'पंकज' },
    { vehicleNo: 'RJ20PB2398', time: '6:00 AM', route: 'SKR-LDN-JPR-LDN. NH', driverName: 'NH' },
    { vehicleNo: 'RJ20PB2400', time: '08:40 AM', route: 'SKR-DLH-SKR', driverName: 'दिनेश /महेश' },
    { vehicleNo: 'RJ20PB2403', time: '1:15 PM', route: 'SKR-DLH', driverName: 'प्रमोद /संदीप' },
    { vehicleNo: 'RJ20PB2404', time: '11:00 AM', route: 'SKR-DLH', driverName: 'मनीराम' },
    { vehicleNo: 'RJ20PB2407', time: '8:00 AM', route: 'JPR-SJN', driverName: 'प्रीतम' },
    { vehicleNo: 'RJ20PB2405', time: '7:30 AM', route: 'CHR-JPR', driverName: 'संदीप /' },
    { vehicleNo: 'RJ20PB2411', time: '4:30 AM', route: 'SKR-LDN-JPR-LDN. NH', driverName: 'Nh' },
    { vehicleNo: 'RJ20PB2415', time: '4:30 AM', route: 'SKR-LDN-JPR-LDN. NH', driverName: 'विमलेश' },
    { vehicleNo: 'RJ14PF2419', time: '10:30 AM', route: 'SKR-LDN-JPR-SKR', driverName: 'सिसराम' },
    { vehicleNo: 'RJ20PB2423', time: '4:45 AM', route: 'SKR-JPR-SJN', driverName: 'राजू' },
    { vehicleNo: 'RJ14PF9608', time: '7:30 AM', route: 'SKR-UDAIPUR', driverName: '' },
    { vehicleNo: 'RJ14PF9609', time: '07:30 AM', route: 'SKR-UDAIPUR CITY', driverName: 'बलवीर/महेश/मनोज' },
    { vehicleNo: 'RJ14PF9616', time: '05:20 AM', route: 'SKR-ALWAR', driverName: 'रामोतार' },
    { vehicleNo: 'RJ20PB9611', time: '7:30 AM', route: 'SKR-ALWAR', driverName: '' },
    { vehicleNo: 'RJ14PF9612', time: '05:20 AM', route: 'SKR-JPR-CHR', driverName: 'अजय सिंह' },
    { vehicleNo: 'RJ14PF2390', time: '07:15 AM', route: 'SKR-JPR-CHR', driverName: 'भंवर सिंह' },
    { vehicleNo: 'RJ14PF2421', time: '5:00 PM', route: 'SKR-DLH', driverName: 'प्रकाश/खनिया लाल' },
    { vehicleNo: 'RJ20PB2396', time: '6:00 AM', route: 'SKR-LDN-JPR-LDN. NH', driverName: 'सुभाष नहेरा' }
];

// Normalize drivers to individual names by splitting on '/'
const allRawDrivers = defaultDuties.map(d => d.driverName).filter(Boolean);
const allIndividualDrivers = [];
allRawDrivers.forEach(nameStr => {
    nameStr.split('/').forEach(n => {
        const clean = n.trim();
        if (clean) allIndividualDrivers.push(clean);
    });
});
// Ensure 'NH' is always explicitly available as an option
const uniqueDrivers = [...new Set([...allIndividualDrivers, 'NH'])];

const uniqueVehicles = [...new Set(defaultDuties.map(d => d.vehicleNo))];
const uniqueTimes = [...new Set(defaultDuties.map(d => d.time))];
const uniqueRoutes = [...new Set(defaultDuties.map(d => d.route))];

const DutyForm = ({ onDutyAdded, globalDrivers = [], setGlobalDrivers }) => {
    const [duties, setDuties] = useState(defaultDuties.map(d => ({ ...d })));
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // Custom drivers added from the form interface
    const [customDriverInput, setCustomDriverInput] = useState('');

    const currentDuty = duties[currentStep];

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newDuties = [...duties];
        newDuties[currentStep] = { ...currentDuty, [name]: value };
        setDuties(newDuties);
    };

    const handleNext = () => {
        if (currentStep < duties.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
        try {
            // Bulk insert via single API endpoint to avoid network spam
            await axios.post(`${API_URL}/api/duties/add-bulk`, duties);

            alert('All ' + duties.length + ' bus duties generated successfully!');
            // Reset to step 1 (keep current user-edited defaults for UX, or full reset)
            setCurrentStep(0);
            onDutyAdded();
        } catch (error) {
            console.error('Error adding duties:', error);
            alert('Failed to generate final duty chart.');
        } finally {
            setLoading(false);
        }
    };

    const progressPercentage = ((currentStep + 1) / duties.length) * 100;

    return (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '0.2rem', fontSize: '1.4rem' }}>
                Bus {currentStep + 1} of {duties.length}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Review or edit details for {currentDuty.vehicleNo}</p>

            {/* Progress Bar */}
            <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercentage}%`, backgroundColor: 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Vehicle Number</label>
                    <select name="vehicleNo" value={currentDuty.vehicleNo} onChange={handleChange} className="premium-select">
                        {uniqueVehicles.map((opt, i) => <option key={opt + i} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time</label>
                    <select name="time" value={currentDuty.time} onChange={handleChange} className="premium-select">
                        {uniqueTimes.map((opt, i) => <option key={opt + i} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Route</label>
                    <select name="route" value={currentDuty.route} onChange={handleChange} className="premium-select">
                        {uniqueRoutes.map((opt, i) => <option key={opt + i} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Driver Name(s)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[...new Set([...uniqueDrivers, ...globalDrivers])].map((driver, i) => {
                            const currentSelected = currentDuty.driverName
                                ? currentDuty.driverName.split('/').map(d => d.trim()).filter(Boolean)
                                : [];
                            const isSelected = currentSelected.includes(driver);

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        let newSelected = [...currentSelected];
                                        if (isSelected) {
                                            newSelected = newSelected.filter(d => d !== driver);
                                        } else {
                                            newSelected.push(driver);
                                        }
                                        handleChange({ target: { name: 'driverName', value: newSelected.join(' / ') } });
                                    }}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '2rem',
                                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'}`,
                                        background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: isSelected ? 'white' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {driver}
                                </button>
                            );
                        })}
                    </div>
                    {/* Custom Driver Input Layer */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <input 
                            type="text" 
                            placeholder="+ Type Custom Driver Name..."
                            value={customDriverInput}
                            onChange={(e) => setCustomDriverInput(e.target.value)}
                            style={{ padding: '0.6rem', fontSize: '0.85rem', flex: 1, marginBottom: 0, borderRadius: '0.5rem' }}
                        />
                        <button 
                            type="button"
                            onClick={() => {
                                const clean = customDriverInput.trim();
                                if (clean) {
                                    if (!globalDrivers.includes(clean) && !uniqueDrivers.includes(clean)) {
                                        setGlobalDrivers([...globalDrivers, clean]);
                                    }
                                    
                                    // Auto-select the newly added driver
                                    const currentSelected = currentDuty.driverName 
                                        ? currentDuty.driverName.split('/').map(d => d.trim()).filter(Boolean) 
                                        : [];
                                    if (!currentSelected.includes(clean)) {
                                        currentSelected.push(clean);
                                        handleChange({ target: { name: 'driverName', value: currentSelected.join(' / ') } });
                                    }
                                    setCustomDriverInput('');
                                }
                            }}
                            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '0.5rem' }}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    style={{ background: 'transparent', border: '1px solid var(--glass-border)', opacity: currentStep === 0 ? 0.3 : 1 }}
                >
                    Back
                </button>
                <button onClick={handleNext} style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                    {currentStep === duties.length - 1 ? (loading ? 'Generating...' : 'Finish & Generate Chart') : 'Next Bus'}
                </button>
            </div>

            <style>{`
                .premium-select {
                    width: 100%;
                    padding: 0.6rem;
                    border-radius: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    color: white;
                    font-size: 0.95rem;
                    appearance: none;
                    cursor: pointer;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .premium-select:focus {
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
                }
                .premium-select option {
                    background: #1e293b;
                    color: white;
                    padding: 10px;
                }
            `}</style>
        </div>
    );
};

export default DutyForm;
