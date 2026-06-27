import { useState } from 'react'
import './Reception.css'

type Doctor = {
  id: string
  name: string
  specialty: string
  available: boolean
  waitingTime: number
  patientsInQueue: number
}

export function Reception({ onProceed, onBack }: { onProceed: (selectedDoctor: string, symptoms: string) => void; onBack?: () => void }) {
  const [symptoms, setSymptoms] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [step, setStep] = useState<'welcome' | 'symptoms' | 'doctor'>('welcome')

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Ananya Rao',
      specialty: 'General Medicine',
      available: true,
      waitingTime: 15,
      patientsInQueue: 5,
    },
    {
      id: '2',
      name: 'Dr. Siddharth Nair',
      specialty: 'Cardiology',
      available: false,
      waitingTime: 0,
      patientsInQueue: 0,
    },
    {
      id: '3',
      name: 'Dr. Priya Kulkarni',
      specialty: 'Pediatrics',
      available: true,
      waitingTime: 25,
      patientsInQueue: 8,
    },
    {
      id: '4',
      name: 'Dr. Amit Deshmukh',
      specialty: 'Orthopedics',
      available: true,
      waitingTime: 10,
      patientsInQueue: 3,
    },
    {
      id: '5',
      name: 'Dr. Neha Singh',
      specialty: 'Dermatology',
      available: true,
      waitingTime: 20,
      patientsInQueue: 6,
    },
  ]

  const selectedDoctorInfo = doctors.find((d) => d.id === selectedDoctor)
  const isFormValid = symptoms.trim().length > 0 && selectedDoctor

  const handleProceed = () => {
    if (isFormValid && selectedDoctorInfo) {
      onProceed(selectedDoctorInfo.name, symptoms)
    }
  }

  return (
    <div className="reception-wrapper">
      {step === 'welcome' && (
        <div className="reception-welcome">
          <div className="welcome-content">
            <div className="welcome-header">
              <div className="welcome-logo">❤️</div>
              <h1>Welcome to MedPulse</h1>
              <p className="welcome-subtitle">Hospital Reception System</p>
            </div>

            <div className="welcome-message">
              <p>We're here to help you get the right care. Let's get you started with a quick consultation form.</p>
            </div>

            <div className="welcome-steps">
              <div className="step-indicator">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-text">Describe your symptoms</div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-text">Choose your doctor</div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-text">Complete registration</div>
                </div>
              </div>
            </div>

            <button className="welcome-button" onClick={() => setStep('symptoms')}>
              Get Started
            </button>

            {onBack && (
              <button className="welcome-link" onClick={onBack}>
                Back to Home
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'symptoms' && (
        <div className="reception-step">
          <div className="step-container">
            <div className="step-header">
              <button className="step-back" onClick={() => setStep('welcome')}>
                ← Back
              </button>
              <h2>Tell us about your symptoms</h2>
              <p className="step-subtext">Describe what brings you to the hospital today</p>
            </div>

            <div className="symptom-section">
              <textarea
                className="symptom-input"
                placeholder="e.g., I have been experiencing chest pain for the past 2 days, difficulty breathing, and occasional dizziness..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={8}
              />
              <div className="character-count">
                <span>{symptoms.length}</span> / 500 characters
              </div>
            </div>

            <div className="step-actions">
              <button className="action-btn secondary" onClick={() => setStep('welcome')}>
                Back
              </button>
              <button
                className="action-btn primary"
                onClick={() => setStep('doctor')}
                disabled={symptoms.trim().length === 0}
              >
                Next: Select Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'doctor' && (
        <div className="reception-step">
          <div className="step-container">
            <div className="step-header">
              <button className="step-back" onClick={() => setStep('symptoms')}>
                ← Back
              </button>
              <h2>Choose your preferred doctor</h2>
              <p className="step-subtext">Select based on specialization and availability</p>
            </div>

            <div className="doctor-section">
              <div className="doctor-grid">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`doctor-card-new ${selectedDoctor === doctor.id ? 'selected' : ''} ${!doctor.available ? 'unavailable' : ''}`}
                    onClick={() => doctor.available && setSelectedDoctor(doctor.id)}
                  >
                    <div className="doctor-card-content">
                      <h3>{doctor.name}</h3>
                      <p className="specialty">{doctor.specialty}</p>

                      {doctor.available && (
                        <div className="doctor-stats">
                          <div className="stat">
                            <div className="stat-label">Wait</div>
                            <div className="stat-value">{doctor.waitingTime}m</div>
                          </div>
                          <div className="stat">
                            <div className="stat-label">Queue</div>
                            <div className="stat-value">{doctor.patientsInQueue}</div>
                          </div>
                        </div>
                      )}

                      <div className={`doctor-status ${doctor.available ? 'available' : 'unavailable'}`}>
                        {doctor.available ? '✓ Available' : '✗ Unavailable'}
                      </div>

                      {selectedDoctor === doctor.id && (
                        <div className="selected-checkmark">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="step-actions">
              <button className="action-btn secondary" onClick={() => setStep('symptoms')}>
                Back
              </button>
              <button
                className="action-btn primary"
                onClick={handleProceed}
                disabled={!selectedDoctor}
              >
                Complete Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
