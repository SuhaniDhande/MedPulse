import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
console.log("🔥 THIS IS THE FILE BEING EXECUTED");
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Initialize database
const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      patients: [
        { id: 1, name: 'John Doe', age: 45, phone: '9876543210', department: 'Cardiology', status: 'admitted', appointmentTime: '10:00 AM', priority: 'high', assignedDoctor: 'Dr. Smith' },
        { id: 2, name: 'Jane Smith', age: 34, phone: '9876543211', department: 'Neurology', status: 'pending', appointmentTime: '11:00 AM', priority: 'medium', assignedDoctor: 'Dr. Johnson' },
        { id: 3, name: 'Mike Brown', age: 52, phone: '9876543212', department: 'Orthopedics', status: 'approved', appointmentTime: '02:00 PM', priority: 'low', assignedDoctor: 'Dr. Williams' },
      ],
      doctors: [
        { id: 1, name: 'Dr. Smith', department: 'Cardiology', email: 'smith@medpulse.com', patients: [1] },
        { id: 2, name: 'Dr. Johnson', department: 'Neurology', email: 'johnson@medpulse.com', patients: [2] },
        { id: 3, name: 'Dr. Williams', department: 'Orthopedics', email: 'williams@medpulse.com', patients: [3] },
      ],
      appointments: [
        { id: 1, patientId: 1, doctorId: 1, date: '2024-01-15', time: '10:00 AM', status: 'approved', reason: 'Checkup' },
        { id: 2, patientId: 2, doctorId: 2, date: '2024-01-16', time: '11:00 AM', status: 'pending', reason: 'Consultation' },
        { id: 3, patientId: 3, doctorId: 3, date: '2024-01-17', time: '02:00 PM', status: 'approved', reason: 'Surgery Review' },
      ],
      analytics: {
        totalPatients: 3,
        admittedPatients: 1,
        pendingAppointments: 1,
        approvedAppointments: 2,
        totalDoctors: 3,
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Helper functions
const readDB = () => {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const updateAnalytics = () => {
  const db = readDB();
  const patients = db.patients;
  const appointments = db.appointments;
  
  db.analytics = {
    totalPatients: patients.length,
    admittedPatients: patients.filter(p => p.status === 'admitted').length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    approvedAppointments: appointments.filter(a => a.status === 'approved').length,
    totalDoctors: db.doctors.length,
  };
  
  writeDB(db);
};

// Routes

// Get all patients
app.get('/api/patients', (req, res) => {
  const db = readDB();
  res.json(db.patients);
});

// Get patient by ID
app.get('/api/patients/:id', (req, res) => {
  const db = readDB();
  const patient = db.patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

// Add new patient
app.post('/api/patients', (req, res) => {
  const db = readDB();
  const newPatient = {
    id: Math.max(...db.patients.map(p => p.id), 0) + 1,
    ...req.body,
    status: 'pending',
    priority: 'medium'
  };
  db.patients.push(newPatient);
  writeDB(db);
  updateAnalytics();
  res.json(newPatient);
});

// Update patient
app.put('/api/patients/:id', (req, res) => {
  const db = readDB();
  const patient = db.patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  
  Object.assign(patient, req.body);
  writeDB(db);
  updateAnalytics();
  res.json(patient);
});

// Delete patient
app.delete('/api/patients/:id', (req, res) => {
  const db = readDB();
  db.patients = db.patients.filter(p => p.id !== parseInt(req.params.id));
  writeDB(db);
  updateAnalytics();
  res.json({ message: 'Patient deleted' });
});

// Get all doctors
app.get('/api/doctors', (req, res) => {
  const db = readDB();
  res.json(db.doctors);
});

// Get doctor by ID with their patients
app.get('/api/doctors/:id', (req, res) => {
  const db = readDB();
  const doctor = db.doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  
  const doctorPatients = db.patients.filter(p => p.assignedDoctor === doctor.name);
  res.json({ ...doctor, patients: doctorPatients });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
  const db = readDB();
  res.json(db.appointments);
});

// Create appointment
app.post('/api/appointments', (req, res) => {
  const db = readDB();
  const newAppointment = {
    id: Math.max(...db.appointments.map(a => a.id), 0) + 1,
    ...req.body,
    status: 'pending' // New appointments are pending approval
  };
  db.appointments.push(newAppointment);
  writeDB(db);
  updateAnalytics();
  res.json(newAppointment);
});

// Update appointment (admin can approve/reschedule)
app.put('/api/appointments/:id', (req, res) => {
  const db = readDB();
  const appointment = db.appointments.find(a => a.id === parseInt(req.params.id));
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
  
  Object.assign(appointment, req.body);
  writeDB(db);
  updateAnalytics();
  res.json(appointment);
});

// Update patient priority (admin only)
app.put('/api/patients/:id/priority', (req, res) => {
  const db = readDB();
  const patient = db.patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  
  patient.priority = req.body.priority;
  writeDB(db);
  res.json(patient);
});

// Get analytics
app.get('/api/analytics', (req, res) => {
  const db = readDB();
  res.json(db.analytics);
});

// Reset database
app.post('/api/reset', (req, res) => {
  fs.unlinkSync(DB_FILE);
  initDB();
  res.json({ message: 'Database reset' });
});

initDB();

app.get('/api/dashboard', (req, res) => {
  const db = readDB()

  res.json({
    totalDoctors: db.doctors.length,
    availableDoctors: db.doctors.length,
    totalPatients: db.patients.length,
    totalAppointmentsToday: db.appointments.length,
    patientsInQueue: 0,
    today: db.appointments.length,
    waiting: db.appointments.filter(a => a.status === 'pending').length,
    surgeries: 0,
  })
})

app.get('/api/queue', (req, res) => {
  res.json([])
})

app.get('/api/surgeries', (req, res) => {
  res.json([])
})

app.get('/api/admin/overview', (req, res) => {
  const db = readDB()

  res.json({
    doctors: db.doctors,
    patients: db.patients,
    appointments: db.appointments,
    queue: [],
    surgeries: [],
    stats: {
      totalDoctors: db.doctors.length,
      availableDoctors: db.doctors.length,
      totalPatients: db.patients.length,
      totalAppointmentsToday: db.appointments.length,
      patientsInQueue: 0,
      today: db.appointments.length,
      waiting: db.appointments.filter(a => a.status === 'pending').length,
      surgeries: 0,
    }
  })
})

app.get('/test123', (req, res) => {
  res.send('HELLO TEST')
})

app.patch('/api/appointments/:id/status', (req, res) => {
  const db = readDB()

  const appointment = db.appointments.find(
    a => a.id === parseInt(req.params.id)
  )

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' })
  }

  appointment.status = req.body.status

  writeDB(db)
  updateAnalytics()

  res.json(appointment)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
