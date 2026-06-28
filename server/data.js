export const doctors = [
  { id: '1', name: 'Dr. Ananya Rao', specialty: 'General Medicine', available: true, waitingTime: 15, patientsInQueue: 5, patientsToday: 12 },
  { id: '2', name: 'Dr. Siddharth Nair', specialty: 'Cardiology', available: false, waitingTime: 0, patientsInQueue: 0, patientsToday: 8 },
  { id: '3', name: 'Dr. Priya Kulkarni', specialty: 'Pediatrics', available: true, waitingTime: 25, patientsInQueue: 8, patientsToday: 15 },
  { id: '4', name: 'Dr. Amit Deshmukh', specialty: 'Orthopedics', available: true, waitingTime: 10, patientsInQueue: 3, patientsToday: 10 },
  { id: '5', name: 'Dr. Neha Singh', specialty: 'Dermatology', available: true, waitingTime: 20, patientsInQueue: 6, patientsToday: 6 },
]

export const patients = [
  { id: 'P001', name: 'Rohit Sharma', email: 'rohit@mail.com', age: 35, sex: 'Male', history: 'Hypertension' },
  { id: 'P002', name: 'Geeta Patel', email: 'geeta@mail.com', age: 28, sex: 'Female', history: 'Asthma' },
  { id: 'P003', name: 'Anjali Mehta', email: 'anjali@mail.com', age: 42, sex: 'Female', history: 'Diabetes' },
  { id: 'P004', name: 'Vikram Singh', email: 'vikram@mail.com', age: 55, sex: 'Male', history: 'Cardiac history' },
]

export const appointments = [
  { id: 'A001', patientName: 'Rohit Sharma', doctorName: 'Dr. Ananya Rao', time: '09:30', status: 'confirmed', symptoms: 'Follow-up visit' },
  { id: 'A002', patientName: 'Geeta Patel', doctorName: 'Dr. Priya Kulkarni', time: '10:00', status: 'pending', symptoms: 'Fever and cough' },
  { id: 'A003', patientName: 'Anjali Mehta', doctorName: 'Dr. Amit Deshmukh', time: '11:00', status: 'confirmed', symptoms: 'Knee pain' },
]

export const queue = [
  { token: 'A102', patientId: 'P001', name: 'Rohit Sharma', priority: 'High', assignedDoctor: 'Dr. Ananya Rao' },
  { token: 'A103', patientId: 'P002', name: 'Geeta Patel', priority: 'Medium', assignedDoctor: 'Dr. Priya Kulkarni' },
  { token: 'A104', patientId: 'P003', name: 'Anjali Mehta', priority: 'Low', assignedDoctor: 'Dr. Amit Deshmukh' },
]

export const surgeries = [
  { time: '09:30', name: 'Vikram Singh', type: 'Appendectomy' },
  { time: '11:00', name: 'Neha Verma', type: 'Gallbladder' },
  { time: '13:15', name: 'Sunil Rao', type: 'Knee repair' },
]
