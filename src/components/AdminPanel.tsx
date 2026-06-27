import { useState } from 'react'
import './AdminPanel.css'

type Doctor = {
  id: string
  name: string
  specialty: string
  available: boolean
  patientsToday: number
}

type Patient = {
  id: string
  name: string
  email: string
  age: number
  sex: string
}

type Appointment = {
  id: string
  patientName: string
  doctorName: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

type QueueItem = {
  token: string
  name: string
  priority: string
  assignedDoctor: string
}

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'appointments' | 'queue' | 'availability' | 'analytics'>('dashboard')

  // Sample data
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: '1', name: 'Dr. Ananya Rao', specialty: 'General Medicine', available: true, patientsToday: 12 },
    { id: '2', name: 'Dr. Siddharth Nair', specialty: 'Cardiology', available: false, patientsToday: 8 },
    { id: '3', name: 'Dr. Priya Kulkarni', specialty: 'Pediatrics', available: true, patientsToday: 15 },
    { id: '4', name: 'Dr. Amit Deshmukh', specialty: 'Orthopedics', available: true, patientsToday: 10 },
  ])

  const [patients, _setPatients] = useState<Patient[]>([
    { id: 'P001', name: 'Rohit Sharma', email: 'rohit@mail.com', age: 35, sex: 'Male' },
    { id: 'P002', name: 'Geeta Patel', email: 'geeta@mail.com', age: 28, sex: 'Female' },
    { id: 'P003', name: 'Anjali Mehta', email: 'anjali@mail.com', age: 42, sex: 'Female' },
    { id: 'P004', name: 'Vikram Singh', email: 'vikram@mail.com', age: 55, sex: 'Male' },
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'A001', patientName: 'Rohit Sharma', doctorName: 'Dr. Ananya Rao', time: '09:30', status: 'confirmed' },
    { id: 'A002', patientName: 'Geeta Patel', doctorName: 'Dr. Priya Kulkarni', time: '10:00', status: 'pending' },
    { id: 'A003', patientName: 'Anjali Mehta', doctorName: 'Dr. Amit Deshmukh', time: '11:00', status: 'confirmed' },
  ])

  const [queue, setQueue] = useState<QueueItem[]>([
    { token: 'A102', name: 'Rohit Sharma', priority: 'High', assignedDoctor: 'Dr. Ananya Rao' },
    { token: 'A103', name: 'Geeta Patel', priority: 'Medium', assignedDoctor: 'Dr. Priya Kulkarni' },
    { token: 'A104', name: 'Anjali Mehta', priority: 'Low', assignedDoctor: 'Dr. Amit Deshmukh' },
  ])

  // Statistics
  const stats = {
    totalDoctors: doctors.length,
    availableDoctors: doctors.filter(d => d.available).length,
    totalPatients: patients.length,
    totalAppointmentsToday: appointments.filter(a => a.status === 'confirmed').length,
    patientsInQueue: queue.length,
  }

  const handleToggleDoctorAvailability = (doctorId: string) => {
    setDoctors(doctors.map(d => 
      d.id === doctorId ? { ...d, available: !d.available } : d
    ))
  }

  const handleReassignPatient = (queueToken: string, newDoctorId: string) => {
    const newDoctor = doctors.find(d => d.id === newDoctorId)
    if (newDoctor) {
      setQueue(queue.map(item =>
        item.token === queueToken ? { ...item, assignedDoctor: newDoctor.name } : item
      ))
    }
  }

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(a =>
      a.id === appointmentId ? { ...a, status: 'cancelled' } : a
    ))
  }

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(a =>
      a.id === appointmentId ? { ...a, status: 'completed' } : a
    ))
  }

  const handleRemoveFromQueue = (token: string) => {
    setQueue(queue.filter(item => item.token !== token))
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-title">
          <h1>Administration Dashboard</h1>
          <p>Manage hospital operations, staff, and appointments</p>
        </div>
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
      </header>

      {/* Stats Overview */}
      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Total Doctors</div>
          <div className="stat-value">{stats.totalDoctors}</div>
          <div className="stat-detail">{stats.availableDoctors} available</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{stats.totalPatients}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Appointments Today</div>
          <div className="stat-value">{stats.totalAppointmentsToday}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Queue Length</div>
          <div className="stat-value">{stats.patientsInQueue}</div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Appointments
        </button>
        <button
          className={`tab-button ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          📋 Queue Management
        </button>
        <button
          className={`tab-button ${activeTab === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveTab('availability')}
        >
          ⏰ Doctor Availability
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      {/* Tab Content */}
      <section className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h2>Overview</h2>
            <div className="dashboard-grid">
              <div className="card">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn">+ Add Doctor</button>
                  <button className="action-btn">+ Add Patient</button>
                  <button className="action-btn">+ New Appointment</button>
                </div>
              </div>
              <div className="card">
                <h3>System Status</h3>
                <div className="status-item">
                  <span>Doctors Available</span>
                  <span className="status-badge available">{stats.availableDoctors}/{stats.totalDoctors}</span>
                </div>
                <div className="status-item">
                  <span>System Health</span>
                  <span className="status-badge healthy">Operational</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <h2>User Management</h2>

            {/* Doctors Section */}
            <div className="section">
              <h3>Doctors</h3>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialty</th>
                      <th>Patients Today</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialty}</td>
                        <td>{doctor.patientsToday}</td>
                        <td>
                          <span className={`status-badge ${doctor.available ? 'available' : 'unavailable'}`}>
                            {doctor.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td>
                          <button className="action-link" onClick={() => handleToggleDoctorAvailability(doctor.id)}>
                            {doctor.available ? 'Mark Unavailable' : 'Mark Available'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Patients Section */}
            <div className="section">
              <h3>Patients</h3>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Age</th>
                      <th>Sex</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>{patient.age}</td>
                        <td>{patient.sex}</td>
                        <td>
                          <button className="action-link">View Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="tab-content">
            <h2>Appointment Management</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.doctorName}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="action-cell">
                        {appointment.status === 'confirmed' && (
                          <>
                            <button className="action-link success" onClick={() => handleCompleteAppointment(appointment.id)}>
                              Complete
                            </button>
                            <button className="action-link danger" onClick={() => handleCancelAppointment(appointment.id)}>
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'pending' && (
                          <>
                            <button className="action-link">Confirm</button>
                            <button className="action-link danger" onClick={() => handleCancelAppointment(appointment.id)}>
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Queue Management Tab */}
        {activeTab === 'queue' && (
          <div className="tab-content">
            <h2>Queue Management</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient Name</th>
                    <th>Priority</th>
                    <th>Assigned Doctor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item) => (
                    <tr key={item.token}>
                      <td className="token-cell">{item.token}</td>
                      <td>{item.name}</td>
                      <td>
                        <span className={`priority-pill ${item.priority.toLowerCase()}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td>{item.assignedDoctor}</td>
                      <td className="action-cell">
                        <select
                          className="reassign-select"
                          defaultValue={item.assignedDoctor}
                          onChange={(e) => handleReassignPatient(item.token, e.target.value)}
                        >
                          <option value="">Reassign to...</option>
                          {doctors.filter(d => d.available).map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </option>
                          ))}
                        </select>
                        <button className="action-link danger" onClick={() => handleRemoveFromQueue(item.token)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {queue.length === 0 && (
              <div className="empty-state">
                <p>No patients in queue</p>
              </div>
            )}
          </div>
        )}

        {/* Doctor Availability Tab */}
        {activeTab === 'availability' && (
          <div className="tab-content">
            <h2>Doctor Availability Management</h2>
            <div className="availability-grid">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="availability-card">
                  <div className="doctor-info">
                    <h4>{doctor.name}</h4>
                    <p>{doctor.specialty}</p>
                    <p className="patients-info">{doctor.patientsToday} patients today</p>
                  </div>
                  <div className="availability-status">
                    <div className={`status-indicator ${doctor.available ? 'available' : 'unavailable'}`}>
                      {doctor.available ? '✓ Available' : '✗ Unavailable'}
                    </div>
                  </div>
                  <div className="availability-actions">
                    <button
                      className={`toggle-btn ${doctor.available ? 'unavailable-btn' : 'available-btn'}`}
                      onClick={() => handleToggleDoctorAvailability(doctor.id)}
                    >
                      {doctor.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                  </div>
                  {!doctor.available && (
                    <div className="alert-info">
                      <p>When unavailable, new patients will be assigned to available doctors</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <h2>Analytics & Reports</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Appointment Metrics</h3>
                <div className="metric">
                  <span>Total Appointments</span>
                  <strong>{appointments.length}</strong>
                </div>
                <div className="metric">
                  <span>Confirmed</span>
                  <strong>{appointments.filter(a => a.status === 'confirmed').length}</strong>
                </div>
                <div className="metric">
                  <span>Pending</span>
                  <strong>{appointments.filter(a => a.status === 'pending').length}</strong>
                </div>
                <div className="metric">
                  <span>Cancelled</span>
                  <strong>{appointments.filter(a => a.status === 'cancelled').length}</strong>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Doctor Utilization</h3>
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="utilization-bar">
                    <span className="doctor-name">{doctor.name}</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{ width: `${(doctor.patientsToday / 20) * 100}%` }}
                      />
                    </div>
                    <span className="patient-count">{doctor.patientsToday}</span>
                  </div>
                ))}
              </div>

              <div className="analytics-card">
                <h3>Queue Statistics</h3>
                <div className="metric">
                  <span>Total in Queue</span>
                  <strong>{queue.length}</strong>
                </div>
                <div className="metric">
                  <span>High Priority</span>
                  <strong>{queue.filter(q => q.priority === 'High').length}</strong>
                </div>
                <div className="metric">
                  <span>Medium Priority</span>
                  <strong>{queue.filter(q => q.priority === 'Medium').length}</strong>
                </div>
                <div className="metric">
                  <span>Low Priority</span>
                  <strong>{queue.filter(q => q.priority === 'Low').length}</strong>
                </div>
              </div>

              <div className="analytics-card">
                <h3>System Overview</h3>
                <div className="metric">
                  <span>Active Doctors</span>
                  <strong>{stats.availableDoctors}/{stats.totalDoctors}</strong>
                </div>
                <div className="metric">
                  <span>Total Patients</span>
                  <strong>{stats.totalPatients}</strong>
                </div>
                <div className="metric">
                  <span>System Occupancy</span>
                  <strong>{Math.round((queue.length / 50) * 100)}%</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
