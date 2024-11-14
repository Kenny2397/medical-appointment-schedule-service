import { z } from 'zod'

const publisherAppointmentSchema = z.object({
  country: z.enum([
    'peru',
    'chile'
  ]),
  patientId: z.string(),
  doctorId: z.string(),
  appointmentDate: z.string(),
  appointmentHour: z.string()
}).required()

type publisherAppointmentType = z.infer<typeof publisherAppointmentSchema>

export { publisherAppointmentSchema, type publisherAppointmentType }

const updateStateAppointmentSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  status: z.enum([
    'REGISTRADO',
    'PENDIENTE',
    'CONFIRMADO',
    'CANCELADO',
    'FINALIZADO'
  ])
}).required()

type updateStateAppointmentType = z.infer<typeof updateStateAppointmentSchema>

export { updateStateAppointmentSchema, type updateStateAppointmentType }

