import { SQSRecord } from 'aws-lambda'
import { publisherAppointmentType } from 'src/core/app/schemas/appointmentSchema'

export interface AppointmentRepository {
  PushEvent(appointmentData: publisherAppointmentType): Promise<string>
  RegisterAppointment(data: SQSRecord[]): Promise<string>
  UpdateStatusAppointment(data: SQSRecord[]): Promise<string>
}