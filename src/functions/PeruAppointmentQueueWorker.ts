import { PeruAppointmentQueueWorkerController } from '@infrastructure/adapters/in/http/PeruAppointmentQueueWorkerController'
import { AWSAppointmentRepository } from '@infrastructure/repositories/AWSAppointmentRepository'
import { SQSEvent } from 'aws-lambda'
import { PeruAppointmentQueueWorkerUsecase } from 'src/core/app/usecases/PeruAppointmentQueueWorkerUsecase'
import { logger } from 'src/powertools/utilities'

const peruAppointmentQueueWorkerController = new PeruAppointmentQueueWorkerController(
  new PeruAppointmentQueueWorkerUsecase(
    new AWSAppointmentRepository()
  )
)

export const handler = async (event: SQSEvent) => {
  logger.logEventIfEnabled(event)
  const res = await peruAppointmentQueueWorkerController.exec(event)
  return res
}
