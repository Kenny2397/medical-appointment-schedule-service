import { AppointmentRepository } from '@domain/services/repositories/AppointmentRepository'
import { publisherAppointmentType } from '../schemas/appointmentSchema'

export class AppointmentEventPublisherUsecase {
  constructor (
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async PublishEvent (appointmentData: publisherAppointmentType): Promise<string> {
    return await this.appointmentRepository.PushEvent(appointmentData)
  }
}