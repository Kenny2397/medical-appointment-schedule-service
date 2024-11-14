import { PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { config } from '@config/environment'
import { AppointmentRepository } from '@domain/services/repositories/AppointmentRepository'
import { SQSRecord } from 'aws-lambda'
import { publisherAppointmentType, updateStateAppointmentSchema, updateStateAppointmentType } from 'src/core/app/schemas/appointmentSchema'
import { logger } from 'src/powertools/utilities'
import { getClientEventBridge } from './EventBridge/Client'

import { AppointmentDynamoDB } from './DynamoDB/schema/Appointment'

export class AWSAppointmentRepository implements AppointmentRepository {
  async UpdateStatusAppointment (records: SQSRecord[]): Promise<string> {
    for (const record of records) {
      const appointmentStatus = JSON.parse(record.body)
      const appointmentData: updateStateAppointmentType = updateStateAppointmentSchema.parse(appointmentStatus)
      logger.info('appointment', { appointmentStatus })

      const response = await AppointmentDynamoDB.updateStatusAppoitment({
        appointmentId: appointmentData.appointmentId, 
        patientId: appointmentData.patientId,
        status: appointmentData.status
      })
      logger.info('response', { response })
    }
    return 'ok'
  }
  
  async PushEvent (appointmentData: publisherAppointmentType): Promise<string> {

    const client = getClientEventBridge()
    const command = new PutEventsCommand({
      Entries: [{
        Source: 'appointment.service',
        DetailType: 'AppointmentCreated',
        Detail: JSON.stringify({ country: appointmentData.country, appointmentData }),
        EventBusName: config.appointmentEventBus
      }]
    })
    
    logger.info('Sending event to EventBridge', { command })
    await client.send(command)
    
    return 'ok'
  }

  async RegisterAppointment (records: SQSRecord[]): Promise<string> {
    for (const record of records) {
      const appointment = JSON.parse(record.body)
      logger.info('appointment', { appointment })
      
      const response = await AppointmentDynamoDB.registerAppointment(appointment.detail.appointmentData)
      logger.info('response', { response })
    }

    return 'ok'
  }
}