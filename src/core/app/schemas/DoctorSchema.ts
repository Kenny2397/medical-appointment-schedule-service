import { z } from 'zod'

const CreateDoctorSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().optional(),
})

type CreateDoctorType = z.infer<typeof CreateDoctorSchema>

export { CreateDoctorSchema, type CreateDoctorType }

const GetAllDoctorsOfCountryBySpecialitySchema = z.object({
  country: z.string().min(1, 'Country is required'),
  specialty: z.string().min(1, 'Specialty is required'),
}).required()

type GetAllDoctorsOfCountryBySpecialityType = z.infer<typeof GetAllDoctorsOfCountryBySpecialitySchema>

export { GetAllDoctorsOfCountryBySpecialitySchema, type GetAllDoctorsOfCountryBySpecialityType }
