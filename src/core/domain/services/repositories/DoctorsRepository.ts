
export interface DoctorsRepository {
  getAllDoctorsOfCountryBySpeciality(country: string, speciality: string): Promise<unknown[] | undefined>
}