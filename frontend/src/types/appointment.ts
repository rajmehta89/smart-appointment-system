export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  availability: TimeSlot[];
  imageUrl?: string;
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  dateTime: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
} 