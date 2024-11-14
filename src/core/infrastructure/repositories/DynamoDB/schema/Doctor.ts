import { AttributeValue, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { CreateDoctorType } from 'src/core/app/schemas/DoctorSchema'
import { GenerateError, logger } from 'src/powertools/utilities'
import { getClientDynamoDB } from './Client'
import { Item } from './Item'

export class DoctorDynamoDB extends Item {
  country: string
  specialty: string
  id: string

  constructor (doctorData: Partial<CreateDoctorType>) {
    super()
    this.country = doctorData.country!
    this.specialty = doctorData.specialty!
  }

  get pk () {
    return 'DETAIL#INFO'
  }

  get sk () {
    return `ENTITY#DOCTOR#${this.id}`
  }

  get gsi1pk () {
    return `${this.country}#${this.specialty}`
  }

  get gsi1sk () {
    return `${this.id}`
  }

  static fromQuery (items: Record<string, AttributeValue>[]) {
    const response = items.map(item => {
      const doctorData = unmarshall(item)

      delete doctorData.PK,
      delete doctorData.SK
      return doctorData
    })

    return response
  }

  static async getAllDoctorsOfCountryBySpeciality ({
    country,
    specialty
  }: {
    country: string
    specialty: string
  }) {
    const client = getClientDynamoDB()
    const doctor = new DoctorDynamoDB({
      country,
      specialty
    })

    const command = new QueryCommand({
      TableName: config.appointmentServiceTable,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': { S: doctor.gsi1pk }
      },
      ScanIndexForward: false
    })
    try {
      const response = await client.send(command)
      logger.debug('getalldoctors command - response', { command, response })

      if (response.Count === 0) {
        return undefined
      }

      return this.fromQuery(response.Items!)
    } catch (error) {
      logger.error('getalldoctors - error', { error })
      throw new GenerateError(500, { detail: 'Error getting doctors' })
    }
  }
}