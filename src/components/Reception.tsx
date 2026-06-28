import { useState } from 'react'
import type { Doctor } from '../api'

interface ReceptionProps {
  onProceed: (selectedDoctor: string, symptoms: string) => void
  onBack: () => void
}

// Mock doctors data - replace with actual API call if needed
const DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Rajesh Kumar', specialty: 'Cardiology', available: true, waitingTime: 15, patientsInQueue: 3, patientsToday: 12 },
  { id: '2', name: 'Dr. Priya Singh', specialty: 'Neurology', available: true, waitingTime: 20, patientsInQueue: 5, patientsToday: 15 },
  { id: '3', name: 'Dr. Anil Patel', specialty: 'Orthopedics', available: true, waitingTime: 10, patientsInQueue: 2, patientsToday: 8 },
  { id: '4', name: 'Dr. Meera Sharma', specialty: 'General Medicine', available: true, waitingTime: 25, patientsInQueue: 7, patientsToday: 20 },
]

export function Reception({ onProceed, onBack }: ReceptionProps) {
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [error, setError] = useState('')

  const handleProceed = () => {
    if (!selectedDoctor || !symptoms.trim()) {
      setError('Please select a doctor and describe your symptoms')
      return
    }
    onProceed(selectedDoctor, symptoms)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">MP</div>
          <span>MedPulse</span>
        </div>
        <nav className="topnav">
          <button className="secondary-button" onClick={onBack}>
            Back
          </button>
        </nav>
      </header>

      <main className="appointment-page">
        <div className="dashboard-header">
          <div>
            <span className="eyebrow">Reception</span>
            <h1>Describe your symptoms</h1>
            <p className="confirmation-copy">
              Our reception staff will note your symptoms and assign you to the most suitable doctor.
            </p>
          </div>
        </div>

        <form className="appointment-form">
          <label className="form-field full-width">
            <span>Your main complaint or symptoms</span>
            <textarea
              value={symptoms}
              onChange={(e) => {
                setSymptoms(e.target.value)
                setError('')
              }}
              placeholder="Describe what brings you to the hospital today..."
            />
          </label>

          <div>
            <label className="form-field">
              <span>Preferred Doctor (Optional)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {DOCTORS.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor.name)
                    setError('')
                  }}
                  style={{
                    padding: '1rem',
                    border: selectedDoctor === doctor.name ? '2px solid #0f766e' : '1px solid rgba(15, 23, 42, 0.16)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedDoctor === doctor.name ? '#ecfdf5' : '#ffffff',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#0f172a' }}>
                    {doctor.name}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                    {doctor.specialty}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                    Wait: ~{doctor.waitingTime}min
                  </p>
                </div>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#991b1b', fontWeight: 600, marginTop: '1rem' }}>{error}</p>}

          <button
            className="patient-button"
            type="button"
            onClick={handleProceed}
            style={{ marginTop: '1.5rem' }}
          >
            Proceed to appointment booking
          </button>
        </form>
      </main>

      <footer className="app-footer">MedPulse - Designed for Indian hospitals - 2026</footer>
    </div>
  )
}
