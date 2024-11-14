import { Context, SQSEvent } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/SQS/handler'
import { ChileAppointmentQueueWorkerUsecase } from 'src/core/app/usecases/ChileAppointmentQueueWorkerUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class ChileAppointmentQueueWorkerController implements Handler<SQSEvent, Context> {

  constructor (
    private readonly chileAppointmentQueueWorkerUsecase: ChileAppointmentQueueWorkerUsecase
  ) {}

  async exec (event: any) {
    try {
      const eventBody = event.Records

      const response = await this.chileAppointmentQueueWorkerUsecase.ProcessEvent(eventBody)
      
      return responseHandler(200, {
        data: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}