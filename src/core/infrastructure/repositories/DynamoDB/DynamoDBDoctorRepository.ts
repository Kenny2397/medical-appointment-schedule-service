import { DoctorsRepository } from '@domain/services/repositories/DoctorsRepository'
import { DoctorDynamoDB } from './schema/Doctor'

export class DynamoDBDoctorRepository implements DoctorsRepository {
  getAllDoctorsOfCountryBySpeciality (country: string, specialty: string): Promise<unknown[] | undefined> {
    const doctors = DoctorDynamoDB.getAllDoctorsOfCountryBySpeciality({ country, specialty })
    return doctors
  }
}