import { AppointmentRepository } from '@domain/services/repositories/AppointmentRepository'
import { SQSRecord } from 'aws-lambda'

export class UpdateStatusQueueWorkerUsecase {
  constructor (
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async ProcessEvent (sqsData: SQSRecord[]): Promise<string> {
    // ADD LOGIC 
    return await this.appointmentRepository.UpdateStatusAppointment(sqsData)
  }
}