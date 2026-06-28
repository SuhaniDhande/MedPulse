const API_BASE_URL = 'https://medpulse-1.onrender.com'

type RequestOptions = RequestInit & { json?: unknown }

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(json ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : rest.body,
    ...rest,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export type Doctor = {
  id: string
  name: string
  specialty: string
  available: boolean
  waitingTime: number
  patientsInQueue: number
  patientsToday: number
}

export type Patient = {
  id: string
  name: string
  email: string
  age: number
  sex: string
  history?: string
}

export type Appointment = {
  id: string
  patientName: string
  doctorName: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  symptoms?: string
}

export type QueueItem = {
  token: string
  patientId: string
  name: string
  priority: string
  assignedDoctor: string
}

export type SurgeryItem = {
  time: string
  name: string
  type: string
}

export type DashboardStats = {
  totalDoctors: number
  availableDoctors: number
  totalPatients: number
  totalAppointmentsToday: number
  patientsInQueue: number
  today: number
  waiting: number
  surgeries: number
}

export type AppointmentPayload = {
  name: string
  age: string
  sex: string
  history: string
  time: string
  preferredDoctor: string
  symptoms: string
}

export type AdminOverview = {
  doctors: Doctor[]
  patients: Patient[]
  appointments: Appointment[]
  queue: QueueItem[]
  surgeries: SurgeryItem[]
  stats: DashboardStats
}

export const api = {
  getDashboard: () => request<DashboardStats>('/dashboard'),
  getDoctors: () => request<Doctor[]>('/doctors'),
  setDoctorAvailability: (doctorId: string, available?: boolean) =>
    request<Doctor>(`/doctors/${doctorId}/availability`, { method: 'PATCH', json: { available } }),
  getQueue: () => request<QueueItem[]>('/queue'),
  callNext: (token: string) => request<QueueItem>(`/queue/${token}`, { method: 'DELETE' }),
  reassignPatient: (token: string, doctorId: string) =>
    request<QueueItem>(`/queue/${token}/doctor`, { method: 'PATCH', json: { doctorId } }),
  getSurgeries: () => request<SurgeryItem[]>('/surgeries'),
  createAppointment: (payload: AppointmentPayload) =>
    request<{ appointment: Appointment; queueItem: QueueItem; patient: Patient }>('/appointments', {
      method: 'POST',
      json: payload,
    }),
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) =>
    request<Appointment>(`/appointments/${appointmentId}/status`, { method: 'PATCH', json: { status } }),
  getAdminOverview: () => request<AdminOverview>('/admin/overview'),
  // New endpoints for appointment management
  getAppointmentsByDoctor: (doctorName: string) =>
    request<Appointment[]>(`/appointments/doctor/${doctorName}`),
  getAppointmentCount: (doctorName: string) =>
    request<{ approved: number; pending: number; rejected: number; total: number }>(
      `/appointments/count/${doctorName}`
    ),
  approveAppointment: (appointmentId: string, approvedBy?: string) =>
    request<{ success: boolean; appointment: Appointment }>(`/admin/appointments/${appointmentId}/approve`, {
      method: 'POST',
      json: { approvedBy },
    }),
  rejectAppointment: (appointmentId: string, rejectionReason?: string) =>
    request<{ success: boolean; appointment: Appointment }>(`/admin/appointments/${appointmentId}/reject`, {
      method: 'POST',
      json: { rejectionReason },
    }),
  getPendingAppointments: () => request<Appointment[]>('/admin/appointments/pending'),
}
