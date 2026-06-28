import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { api, type DashboardStats, type Doctor, type QueueItem, type SurgeryItem } from './api'
import { AdminPanel } from './components/AdminPanel'
import { Reception } from './components/Reception'

function App() {
  const [page, setPage] = useState<'landing' | 'doctor' | 'reception' | 'appointment' | 'confirmation' | 'admin'>('landing')
  const [appointment, setAppointment] = useState({
    name: '',
    age: '',
    sex: '',
    history: '',
    time: '',
    preferredDoctor: '',
    symptoms: '',
  })
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [opdQueue, setOpdQueue] = useState<QueueItem[]>([])
  const [surgeryQueue, setSurgeryQueue] = useState<SurgeryItem[]>([])
  const [summary, setSummary] = useState<DashboardStats>({
    totalDoctors: 0,
    availableDoctors: 0,
    totalPatients: 0,
    totalAppointmentsToday: 0,
    patientsInQueue: 0,
    today: 0,
    waiting: 0,
    surgeries: 0,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [formError, setFormError] = useState('')

  const loadHospitalData = async () => {
    const [dashboard, queue, surgeries, doctorList] = await Promise.all([
      api.getDashboard(),
      api.getQueue(),
      api.getSurgeries(),
      api.getDoctors(),
    ])

    setSummary(dashboard)
    setOpdQueue(queue)
    setSurgeryQueue(surgeries)
    setDoctors(doctorList)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHospitalData().catch((error) => setFormError(error.message))
  }, [])

  const filteredQueue = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return opdQueue
    }

    return opdQueue.filter((patient) =>
      [patient.name, patient.patientId, patient.token].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    )
  }, [opdQueue, searchTerm])

  const handleCallNext = async (token: string) => {
    await api.callNext(token)
    await loadHospitalData()
  }

  const handleReceptionComplete = (selectedDoctor: string, symptoms: string) => {
    setAppointment((prev) => ({
      ...prev,
      preferredDoctor: selectedDoctor,
      symptoms,
    }))
    setPage('appointment')
  }

  const handleBookAppointment = async () => {
    setFormError('')

    try {
      await api.createAppointment(appointment)
      await loadHospitalData()
      setPage('confirmation')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not book appointment')
    }
  }



  if (page === 'appointment') {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div className="brand"><div className="brand-mark">MP</div><span>MedPulse</span></div>
          <nav className="topnav"><button className="secondary-button" onClick={() => setPage('landing')}>Back</button></nav>
        </header>
        <main className="appointment-page">
          <div className="dashboard-header"><div><span className="eyebrow">Book appointment</span><h1>Patient details</h1></div></div>
          <form className="appointment-form">
            <label className="form-field"><span>Name</span><input type="text" value={appointment.name} onChange={(e) => setAppointment({ ...appointment, name: e.target.value })} placeholder="Enter name" /></label>
            <label className="form-field"><span>Age</span><input type="number" value={appointment.age} onChange={(e) => setAppointment({ ...appointment, age: e.target.value })} placeholder="Enter age" /></label>
            <label className="form-field"><span>Sex</span><select value={appointment.sex} onChange={(e) => setAppointment({ ...appointment, sex: e.target.value })}><option value="">Select sex</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></label>
            <label className="form-field full-width"><span>Medical history</span><textarea value={appointment.history} onChange={(e) => setAppointment({ ...appointment, history: e.target.value })} placeholder="Brief medical history" /></label>
            <label className="form-field full-width"><span>Preferred doctor</span><select value={appointment.preferredDoctor} onChange={(e) => setAppointment({ ...appointment, preferredDoctor: e.target.value })}><option value="">Select preferred doctor</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.name}>{doctor.name}</option>)}</select></label>
            <label className="form-field full-width"><span>Symptoms & Chief Complaint</span><textarea value={appointment.symptoms} onChange={(e) => setAppointment({ ...appointment, symptoms: e.target.value })} placeholder="Your symptoms as described in reception" /></label>
            <label className="form-field full-width"><span>Preferred time for appointment</span><input type="time" value={appointment.time} onChange={(e) => setAppointment({ ...appointment, time: e.target.value })} /></label>
            {formError && <p className="confirmation-copy">{formError}</p>}
            <button className="patient-button" type="button" onClick={handleBookAppointment}>Confirm booking</button>
          </form>
        </main>
        <footer className="app-footer">MedPulse - Designed for Indian hospitals - 2026</footer>
      </div>
    )
  }

  if (page === 'confirmation') {
    return (
      <div className="app-shell">
        <header className="topbar"><div className="brand"><div className="brand-mark">MP</div><span>MedPulse</span></div><nav className="topnav"><button className="secondary-button" onClick={() => setPage('landing')}>Back to Home</button></nav></header>
        <main className="appointment-page"><div className="dashboard-header"><div><span className="eyebrow">Appointment booked</span><h1>Your appointment is confirmed</h1><p className="confirmation-copy">We have received your appointment request and added it to the hospital queue.</p></div></div><section className="confirmation-actions"><button className="patient-button" type="button" onClick={() => setPage('landing')}>Back to home</button></section></main>
        <footer className="app-footer">MedPulse - Designed for Indian hospitals - 2026</footer>
      </div>
    )
  }

  if (page === 'doctor') {
    return (
      <div className="app-shell">
        <header className="topbar"><div className="brand"><div className="brand-mark">MP</div><span>MedPulse</span></div><nav className="topnav"><button className="secondary-button" onClick={() => setPage('landing')}>Back to Home</button></nav></header>
        <main className="doctor-page">
          <div className="dashboard-header"><div><span className="eyebrow">Doctor dashboard</span><h1>Daily summary & queues</h1></div></div>
          <section className="summary-card"><div className="summary-item"><p>Patients today</p><strong>{summary.today}</strong></div><div className="summary-item"><p>Patients waiting</p><strong>{summary.waiting}</strong></div><div className="summary-item"><p>Surgeries today</p><strong>{summary.surgeries}</strong></div></section>
          <section className="queue-section"><div className="queue-title-row"><div><span className="eyebrow queue-label">Live OPD queue</span></div></div><div style={{ marginBottom: '1rem' }}><input type="text" placeholder="Search by patient name, ID, or token..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} /></div><div className="table-wrap"><table className="queue-table"><thead><tr><th>Token</th><th>Patient ID</th><th>Patient</th><th>Priority</th><th></th></tr></thead><tbody>{filteredQueue.map((item) => <tr key={item.token}><td>{item.token}</td><td>{item.patientId}</td><td>{item.name}</td><td><span className={`priority-pill ${item.priority.toLowerCase()}`}><span className="priority-dot" />{item.priority}</span></td><td><button className="action-button" onClick={() => handleCallNext(item.token)}>Call next</button></td></tr>)}{opdQueue.length === 0 && <tr><td colSpan={5} className="no-data">No patients in queue</td></tr>}</tbody></table></div></section>
          <section className="queue-section"><div className="queue-title-row"><div><span className="eyebrow">Surgery queue</span></div></div><div className="table-wrap"><table className="queue-table"><thead><tr><th>Time</th><th>Patient</th><th>Surgery</th></tr></thead><tbody>{surgeryQueue.map((item) => <tr key={`${item.time}-${item.name}`}><td>{item.time}</td><td>{item.name}</td><td>{item.type}</td></tr>)}</tbody></table></div></section>
        </main>
        <footer className="app-footer">MedPulse - Designed for Indian hospitals - 2026</footer>
      </div>
    )
  }

  if (page === 'admin') {
    return <AdminPanel onBack={() => setPage('landing')} />
  }

  if (page === 'reception') {
    return <Reception onProceed={handleReceptionComplete} onBack={() => setPage('landing')} />
  }

  return (
    <div className="app-shell landing-page">
      <header className="topbar"><div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}><div className="brand-mark">MP</div><span>MedPulse</span></div><nav className="topnav"><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}>About</a><a href="#help" onClick={(e) => { e.preventDefault(); document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' }) }}>Help</a><button className="sign-in">Sign in</button></nav></header>
      <main className="hero">
        <div className="hero-copy"><span className="eyebrow">Hospital intelligence, unified</span><h1 className="one-line-title">Welcome to <span className="brand-green">MedPulse</span></h1><p>One system for every person inside the hospital - patients, doctors, and staff.</p></div>
        <section className="role-grid" aria-label="Choose your role"><p className="section-label">Choose your role</p><div className="cards"><article className="role-card"><div className="role-icon">DR</div><h2>Doctor</h2><p>Patient records, queue, and prescriptions</p><button className="card-link" onClick={() => setPage('doctor')}>Open</button></article><article className="role-card"><div className="role-icon">PT</div><h2>Patient</h2><p>Appointments, results, and billing</p><button className="card-link" onClick={() => setPage('reception')}>Open</button></article><article className="role-card"><div className="role-icon dark">AD</div><h2>Administrative staff</h2><p>Beds, billing, and operations</p><button className="card-link" onClick={() => setPage('admin')}>Open</button></article></div></section>
        <section id="about" className="info-section about-section"><div className="info-container"><h2>About MedPulse</h2><p>MedPulse is a comprehensive hospital management system designed for Indian hospitals. It streamlines patient care, doctor management, and administrative tasks through one connected interface.</p><div className="features-grid"><div className="feature-card"><div className="feature-icon">PM</div><h3>Patient Management</h3><p>Appointment booking, health records, and medical history tracking</p></div><div className="feature-card"><div className="feature-icon">DD</div><h3>Doctor Dashboard</h3><p>Real-time patient queues, prescriptions, and daily schedules</p></div><div className="feature-card"><div className="feature-icon">AT</div><h3>Admin Tools</h3><p>Bed management, billing, operations, and hospital analytics</p></div></div></div></section>
        <section id="help" className="info-section help-section"><div className="info-container"><h2>Help & Support</h2><div className="help-grid"><div className="help-card"><h3>Getting Started</h3><ul><li>Choose your role: Patient, Doctor, or Admin</li><li>Fill in your details and verify information</li><li>Start managing appointments or operations</li></ul></div><div className="help-card"><h3>For Patients</h3><ul><li>Book appointments with your preferred doctor</li><li>Check your medical records</li><li>View appointment history and billing</li></ul></div><div className="help-card"><h3>For Doctors</h3><ul><li>View daily patient queues</li><li>Access patient records and prescriptions</li><li>Manage your schedule and availability</li></ul></div><div className="help-card"><h3>Contact Us</h3><ul><li><strong>Helpline:</strong> 1800-985-4500</li><li><strong>Email:</strong> MedPulse.support@gmail.com</li><li><strong>Hours:</strong> 24/7 Available</li></ul></div></div></div></section>
      </main>
      <footer className="app-footer">MedPulse - Designed for Indian hospitals - 2026</footer>
    </div>
  )
}

export default App
