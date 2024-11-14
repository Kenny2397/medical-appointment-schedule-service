import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { config } from '@config/environment'
import { publisherAppointmentType } from 'src/core/app/schemas/appointmentSchema'
import { GenerateError, logger } from 'src/powertools/utilities'
import { ulid } from 'ulid'
import { getClientDynamoDB } from './Client'
import { Item } from './Item'

export class AppointmentDynamoDB extends Item {
  patientId: string
  doctorId: string
  id: string
  appointmentDate: string

  constructor (appointmentData: Partial<publisherAppointmentType> | { id: string, patientId: string }) {
    super()
    if ('id' in appointmentData) {
      this.id = appointmentData.id
      this.patientId = appointmentData.patientId!
    } else {
      // Si no tiene `id`, generamos uno nuevo y asignamos los demás campos
      this.id = ulid()
      this.patientId = appointmentData.patientId!
      this.doctorId = appointmentData.doctorId ?? ''
      this.appointmentDate = appointmentData.appointmentDate ?? ''
    }
  }

  get pk (): string {
    return `ENTITY#APPOINTMENT#${this.id}`
  }
  get sk (): string {
    return `DETAIL#PATIENT#${this.patientId}`
  }

  get gsi2pk (): string {
    return this.patientId
  }

  get gsi2sk (): string {
    return this.appointmentDate
  }

  get gsi3pk (): string {
    return this.doctorId
  }

  get gsi3sk (): string {
    return this.appointmentDate
  }
  
  static async registerAppointment (appointmentData: publisherAppointmentType) :Promise<string> {
    const client = getClientDynamoDB()
    const appointment = new AppointmentDynamoDB(appointmentData)
    
    const command = new TransactWriteItemsCommand(
      {
        TransactItems: [
          {
            Put: {
              TableName: config.appointmentServiceTable,
              Item: {
                ...appointment.keysValue(),
                countryCode: { S: appointmentData.country.toUpperCase() },
                patientId: { S: appointmentData.patientId },
                doctorId: { S: appointmentData.doctorId },
                appointmentDate: { S: appointmentData.appointmentDate },
                appointmentHour: { S: appointmentData.appointmentHour },
                status: { S: 'REGISTRADO' },
                createdAt: { S: new Date().toISOString() },
                updatedAt: { S: new Date().toISOString() }
              },
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          }
        ]
      }
    )
    try {
      
      const response = await client.send(command)
      logger.info('set appointment: command - response', {
        command,
        response
      })
      
      if (response.$metadata.httpStatusCode !== 200) {
        throw new GenerateError(500, { detail: 'Error setting appointment' })
      }
      return 'ok'
    } catch (error) {
      throw new GenerateError(500, { detail: 'Error setting appointment', error })
    }
  }

  static async updateStatusAppoitment ({ appointmentId, patientId, status } : { appointmentId: string, patientId: string, status: string }) : Promise<string> {
    const client = getClientDynamoDB()
    const appointment = new AppointmentDynamoDB({
      id: appointmentId,
      patientId
    })
    const command = new TransactWriteItemsCommand(
      {
        TransactItems: [
          {
            Update: {
              TableName: config.appointmentServiceTable,
              Key: {
                ...appointment.keysValue()
              },
              UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
              ExpressionAttributeNames: {
                '#status': 'status',
                '#updatedAt': 'updatedAt'
              },
              ExpressionAttributeValues: {
                ':status': { S: status },
                ':updatedAt': { S: new Date().toISOString() }
              },
              ConditionExpression: 'attribute_exists(PK) and attribute_exists(SK)'
            }
          }
        ]
      }
    )
    try {
      logger.info('update appointment: command', {
        command
      })
      const response = await client.send(command)
      logger.info('update appointment: command - response', {
        command,
        response
      })

      if (response.$metadata.httpStatusCode !== 200) {
        throw new GenerateError(500, { detail: 'Error setting update' })
      }
      return 'ok'
    } catch (error) {
      throw new GenerateError(500, { detail: 'Error setting update', error })
    }
  }
}