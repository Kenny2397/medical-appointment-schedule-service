import { UpdateStatusQueueWorkerController } from '@infrastructure/adapters/in/http/UpdateStatusQueueWorkerController'
import { AWSAppointmentRepository } from '@infrastructure/repositories/AWSAppointmentRepository'
import { SQSEvent } from 'aws-lambda'
import { UpdateStatusQueueWorkerUsecase } from 'src/core/app/usecases/UpdateStatusQueueWorkerUsecase'
import { logger } from 'src/powertools/utilities'

const updateStatusQueueWorkerController = new UpdateStatusQueueWorkerController(
  new UpdateStatusQueueWorkerUsecase(
    new AWSAppointmentRepository()
  )
)

export const handler = async (event: SQSEvent) => {
  logger.logEventIfEnabled(event)
  const res = await updateStatusQueueWorkerController.exec(event)
  return res
}
