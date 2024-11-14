import { DoctorsRepository } from '@domain/services/repositories/DoctorsRepository'
import { GenerateError } from 'src/powertools/utilities'
import { GetAllDoctorsOfCountryBySpecialityType } from '../schemas/DoctorSchema'

export class GetAllDoctorsUsecase {
  constructor (
    private readonly doctorsRepository: DoctorsRepository
  ) {}

  async GetAllDoctorsOfCountryBySpeciality (data: GetAllDoctorsOfCountryBySpecialityType): Promise<unknown> {
    
    const doctors = await this.doctorsRepository.getAllDoctorsOfCountryBySpeciality(data.country, data.specialty)
    if (!doctors) throw new GenerateError(404, { detail: 'doctors not found' })
      
    return doctors
  }
}