import { ChileAppointmentQueueWorkerController } from '@infrastructure/adapters/in/http/ChileAppointmentQueueWorkerController'
import { AWSAppointmentRepository } from '@infrastructure/repositories/AWSAppointmentRepository'
import { SQSEvent } from 'aws-lambda'
import { ChileAppointmentQueueWorkerUsecase } from 'src/core/app/usecases/ChileAppointmentQueueWorkerUsecase'
import { logger } from 'src/powertools/utilities'

const chileAppointmentQueueWorkerController = new ChileAppointmentQueueWorkerController(
  new ChileAppointmentQueueWorkerUsecase(
    new AWSAppointmentRepository()
  )
)

export const handler = async (event: SQSEvent) => {
  logger.logEventIfEnabled(event)
  const res = await chileAppointmentQueueWorkerController.exec(event)
  return res
}
