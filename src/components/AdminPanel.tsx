import { useEffect, useState } from 'react'
import type { Appointment } from '../api'
import { api } from '../api'

interface AdminPanelProps {
  onBack: () => void
}

interface Patient {
  id: string
  name: string
  age: number
  phone: string
  department: string
  status: 'admitted' | 'pending' | 'approved'
  appointmentTime: string
  priority: 'high' | 'medium' | 'low'
  assignedDoctor: string
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments' | 'analytics'>('patients')
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' })
  const [editingPriority, setEditingPriority] = useState<string | null>(null)
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [analyticsData, setAnalyticsData] = useState({
    totalPatients: 0,
    admittedPatients: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    totalDoctors: 0,
  })

  useEffect(() => {
    loadData()
    // Refresh data every 10 seconds for dynamic analytics
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      // Fetch appointments
      const appointmentsRes = await api.getAdminOverview()
      setAppointments(appointmentsRes.appointments)
setAnalyticsData({
  totalPatients: appointmentsRes.stats.totalPatients || 0,
  admittedPatients: 0,
  pendingAppointments: appointmentsRes.stats.waiting || 0,
  approvedAppointments: 0,
  totalDoctors: appointmentsRes.stats.totalDoctors || 0,
})      
      // Mock patients data - In a real app, you'd fetch this from your API
      const mockPatients: Patient[] = [
        { id: '1', name: 'John Doe', age: 45, phone: '9876543210', department: 'Cardiology', status: 'admitted', appointmentTime: '10:00 AM', priority: 'high', assignedDoctor: 'Dr. Smith' },
        { id: '2', name: 'Jane Smith', age: 34, phone: '9876543211', department: 'Neurology', status: 'pending', appointmentTime: '11:00 AM', priority: 'medium', assignedDoctor: 'Dr. Johnson' },
        { id: '3', name: 'Mike Brown', age: 52, phone: '9876543212', department: 'Orthopedics', status: 'approved', appointmentTime: '02:00 PM', priority: 'low', assignedDoctor: 'Dr. Williams' },
      ]
      setPatients(mockPatients)
    } catch (error) {
      console.error('Error loading admin data:', error)
    }
  }

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      await api.updateAppointmentStatus(appointmentId, 'confirmed')
      setAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status: 'confirmed' } : a))
    } catch (error) {
      console.error('Error approving appointment:', error)
    }
  }

  const handleRescheduleAppointment = async (appointmentId: string) => {
    if (!rescheduleData.date || !rescheduleData.time) {
      alert('Please select both date and time')
      return
    }
    try {
      // You would need to update your API to support rescheduling
      await api.updateAppointmentStatus(appointmentId, 'confirmed')
      setAppointments(appointments.map(a => 
        a.id === appointmentId ? { ...a, time: rescheduleData.time } : a
      ))
      setSelectedAppointment(null)
      setRescheduleData({ date: '', time: '' })
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
    }
  }
  // reedeploy again
  const handleUpdatePriority = (patientId: string) => {
    setPatients(patients.map(p => 
      p.id === patientId ? { ...p, priority: newPriority } : p
    ))
    setEditingPriority(null)
  }

  const pendingAppointments = appointments.filter(a => a.status === 'pending')
  // const confirmedAppointments = appointments.filter(a => a.status === 'confirmed')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">MP</div>
          <span>MedPulse</span>
        </div>
        <nav className="topnav">
          <button className="secondary-button" onClick={onBack}>
            Back to Home
          </button>
        </nav>
      </header>

      <main className="doctor-page">
        <div className="dashboard-header">
          <div>
            <span className="eyebrow">Administrative Dashboard</span>
            <h1>Hospital Operations</h1>
          </div>
        </div>

        {/* Analytics Overview */}
        <section className="summary-card">
          <div className="summary-item">
            <p>Total Patients</p>
            <strong>{analyticsData.totalPatients}</strong>
          </div>
          <div className="summary-item">
            <p>Admitted</p>
            <strong>{analyticsData.admittedPatients}</strong>
          </div>
          <div className="summary-item">
            <p>Pending Appointments</p>
            <strong>{analyticsData.pendingAppointments}</strong>
          </div>
          <div className="summary-item">
            <p>Approved Appointments</p>
            <strong>{analyticsData.approvedAppointments}</strong>
          </div>
        </section>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'appointments' ? '3px solid #0f766e' : 'none',
              color: activeTab === 'appointments' ? '#0f766e' : '#64748b',
              fontWeight: activeTab === 'appointments' ? 700 : 600,
              fontSize: '1rem',
            }}
          >
            Pending Appointments ({pendingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'patients' ? '3px solid #0f766e' : 'none',
              color: activeTab === 'patients' ? '#0f766e' : '#64748b',
              fontWeight: activeTab === 'patients' ? 700 : 600,
              fontSize: '1rem',
            }}
          >
            Patient Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'analytics' ? '3px solid #0f766e' : 'none',
              color: activeTab === 'analytics' ? '#0f766e' : '#64748b',
              fontWeight: activeTab === 'analytics' ? 700 : 600,
              fontSize: '1rem',
            }}
          >
            Analytics
          </button>
        </div>

        {/* Pending Appointments Tab */}
        {activeTab === 'appointments' && (
          <section className="queue-section">
            <div className="queue-title-row">
              <span className="eyebrow queue-label">New Appointments Requiring Approval</span>
            </div>
            {pendingAppointments.length === 0 ? (
              <p className="no-data">No pending appointments</p>
            ) : (
              <div className="table-wrap">
                <table className="queue-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Time</th>
                      <th>Symptoms</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAppointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>{apt.patientName}</td>
                        <td>{apt.doctorName}</td>
                        <td>{apt.time}</td>
                        <td>{apt.symptoms || '-'}</td>
                        <td>
                          <button
                            className="action-button"
                            onClick={() => handleApproveAppointment(apt.id)}
                            style={{ marginRight: '0.5rem' }}
                          >
                            Approve
                          </button>
                          <button
                            className="action-button"
                            onClick={() => setSelectedAppointment(apt.id)}
                            style={{ background: '#f59e0b' }}
                          >
                            Reschedule
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reschedule Modal */}
            {selectedAppointment && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'grid',
                placeItems: 'center',
                zIndex: 1000,
              }}>
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  maxWidth: '500px',
                  width: '90%',
                }}>
                  <h2 style={{ marginTop: 0 }}>Reschedule Appointment</h2>
                  <label className="form-field">
                    <span>New Date</span>
                    <input
                      type="date"
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    />
                  </label>
                  <label className="form-field">
                    <span>New Time</span>
                    <input
                      type="time"
                      value={rescheduleData.time}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                      className="patient-button"
                      onClick={() => handleRescheduleAppointment(selectedAppointment)}
                    >
                      Save
                    </button>
                    <button
                      className="patient-button"
                      style={{ background: '#94a3b8' }}
                      onClick={() => setSelectedAppointment(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Patient Management Tab */}
        {activeTab === 'patients' && (
          <section className="queue-section">
            <div className="queue-title-row">
              <span className="eyebrow">Manage Patient Priority</span>
            </div>
            <div className="table-wrap">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.department}</td>
                      <td>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '999px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          background: patient.status === 'admitted' ? '#fecaca' : patient.status === 'approved' ? '#a7f3d0' : '#fcd34d',
                          color: patient.status === 'admitted' ? '#7f1d1d' : patient.status === 'approved' ? '#065f46' : '#78350f',
                        }}>
                          {patient.status}
                        </span>
                      </td>
                      <td>
                        {editingPriority === patient.id ? (
                          <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as any)}
                            style={{ padding: '0.5rem' }}
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        ) : (
                          <span className={`priority-pill ${patient.priority}`}>
                            <span className="priority-dot" />
                            {patient.priority}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingPriority === patient.id ? (
                          <>
                            <button
                              className="action-button"
                              onClick={() => handleUpdatePriority(patient.id)}
                              style={{ marginRight: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                            >
                              Save
                            </button>
                            <button
                              className="action-button"
                              style={{ background: '#94a3b8', fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                              onClick={() => setEditingPriority(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="action-button"
                            onClick={() => {
                              setEditingPriority(patient.id)
                              setNewPriority(patient.priority)
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <section className="queue-section">
            <div className="queue-title-row">
              <h2>Hospital Analytics (Updates every 10 seconds)</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: '#ecfdf5', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Patients</p>
                <strong style={{ fontSize: '2.5rem', color: '#0f766e', display: 'block', marginTop: '0.5rem' }}>
                  {analyticsData.totalPatients}
                </strong>
              </div>
              <div style={{ padding: '1.5rem', background: '#fecaca', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Admitted Patients</p>
                <strong style={{ fontSize: '2.5rem', color: '#991b1b', display: 'block', marginTop: '0.5rem' }}>
                  {analyticsData.admittedPatients}
                </strong>
              </div>
              <div style={{ padding: '1.5rem', background: '#fcd34d', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Pending Appointments</p>
                <strong style={{ fontSize: '2.5rem', color: '#78350f', display: 'block', marginTop: '0.5rem' }}>
                  {analyticsData.pendingAppointments}
                </strong>
              </div>
              <div style={{ padding: '1.5rem', background: '#a7f3d0', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Approved Appointments</p>
                <strong style={{ fontSize: '2.5rem', color: '#065f46', display: 'block', marginTop: '0.5rem' }}>
                  {analyticsData.approvedAppointments}
                </strong>
              </div>
              <div style={{ padding: '1.5rem', background: '#dbeafe', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Doctors</p>
                <strong style={{ fontSize: '2.5rem', color: '#1e40af', display: 'block', marginTop: '0.5rem' }}>
                  {analyticsData.totalDoctors}
                </strong>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">MedPulse - Designed for Indian hospitals - 2026</footer>
    </div>
  )
}
