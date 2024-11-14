import { Context, SQSEvent } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/SQS/handler'
import { UpdateStatusQueueWorkerUsecase } from 'src/core/app/usecases/UpdateStatusQueueWorkerUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class UpdateStatusQueueWorkerController implements Handler<SQSEvent, Context> {

  constructor (
    private readonly updateStatusQueueWorkerUsecase: UpdateStatusQueueWorkerUsecase
  ) {}

  async exec (event: any) {
    try {
      const eventBody = event.Records

      const response = await this.updateStatusQueueWorkerUsecase.ProcessEvent(eventBody)
      
      return responseHandler(200, {
        data: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}