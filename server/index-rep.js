import cors from 'cors'
import express from 'express'
import { appointments, doctors, patients, queue, surgeries } from './data.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const validStatuses = new Set(['pending', 'confirmed', 'completed', 'cancelled'])

const getDashboard = () => ({
  totalDoctors: doctors.length,
  availableDoctors: doctors.filter((doctor) => doctor.available).length,
  totalPatients: patients.length,
  totalAppointmentsToday: appointments.filter((appointment) => appointment.status === 'confirmed').length,
  patientsInQueue: queue.length,
  today: patients.length + appointments.length + queue.length + 74,
  waiting: queue.length,
  surgeries: surgeries.length,
})

const nextId = (prefix, collection) => {
  const nextNumber = collection.length + 1
  return `${prefix}${String(nextNumber).padStart(3, '0')}`
}

const nextToken = () => `A${String(102 + queue.length + appointments.length).padStart(3, '0')}`

const findDoctorByNameOrId = (value) => doctors.find((doctor) => doctor.id === value || doctor.name === value)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MedPulse API' })
})

app.get('/api/dashboard', (_req, res) => {
  res.json(getDashboard())
})

app.get('/api/doctors', (_req, res) => {
  res.json(doctors)
})

app.patch('/api/doctors/:id/availability', (req, res) => {
  const doctor = doctors.find((item) => item.id === req.params.id)

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' })
  }

  doctor.available = typeof req.body.available === 'boolean' ? req.body.available : !doctor.available
  res.json(doctor)
})

app.get('/api/patients', (_req, res) => {
  res.json(patients)
})

app.get('/api/appointments', (_req, res) => {
  res.json(appointments)
})

app.post('/api/appointments', (req, res) => {
  const { name, age, sex, history, time, preferredDoctor, symptoms } = req.body

  if (!name || !age || !sex || !time || !preferredDoctor || !symptoms) {
    return res.status(400).json({ message: 'Name, age, sex, time, doctor, and symptoms are required' })
  }

  const doctor = findDoctorByNameOrId(preferredDoctor)

  if (!doctor) {
    return res.status(400).json({ message: 'Selected doctor does not exist' })
  }

  const patient = {
    id: nextId('P', patients),
    name,
    email: '',
    age: Number(age),
    sex,
    history: history || '',
  }

  const appointment = {
    id: nextId('A', appointments),
    patientName: name,
    doctorName: doctor.name,
    time,
    status: 'pending',
    symptoms,
  }

  const urgentText = symptoms.toLowerCase()
  const queueItem = {
    token: nextToken(),
    patientId: patient.id,
    name,
    priority: urgentText.includes('chest') || urgentText.includes('breath') ? 'High' : 'Medium',
    assignedDoctor: doctor.name,
  }

  patients.push(patient)
  appointments.push(appointment)
  queue.push(queueItem)
  doctor.patientsInQueue += 1

  res.status(201).json({ patient, appointment, queueItem })
})

app.patch('/api/appointments/:id/status', (req, res) => {
  const appointment = appointments.find((item) => item.id === req.params.id)
  const { status } = req.body

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' })
  }

  if (!validStatuses.has(status)) {
    return res.status(400).json({ message: 'Invalid appointment status' })
  }

  appointment.status = status
  res.json(appointment)
})

app.get('/api/queue', (_req, res) => {
  res.json(queue)
})

app.patch('/api/queue/:token/doctor', (req, res) => {
  const queueItem = queue.find((item) => item.token === req.params.token)
  const doctor = findDoctorByNameOrId(req.body.doctorId)

  if (!queueItem) {
    return res.status(404).json({ message: 'Queue item not found' })
  }

  if (!doctor) {
    return res.status(400).json({ message: 'Doctor not found' })
  }

  queueItem.assignedDoctor = doctor.name
  res.json(queueItem)
})

app.delete('/api/queue/:token', (req, res) => {
  const index = queue.findIndex((item) => item.token === req.params.token)

  if (index === -1) {
    return res.status(404).json({ message: 'Queue item not found' })
  }

  const [removed] = queue.splice(index, 1)
  res.json(removed)
})

app.get('/api/surgeries', (_req, res) => {
  res.json(surgeries)
})

app.get('/api/admin/overview', (_req, res) => {
  res.json({ doctors, patients, appointments, queue, surgeries, stats: getDashboard() })
})

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(port, () => {
  console.log(`MedPulse API running on http://localhost:${port}`)
})
