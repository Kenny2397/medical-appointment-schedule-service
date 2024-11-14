import { Context, SQSEvent } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/SQS/handler'
import { PeruAppointmentQueueWorkerUsecase } from 'src/core/app/usecases/PeruAppointmentQueueWorkerUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class PeruAppointmentQueueWorkerController implements Handler<SQSEvent, Context> {

  constructor (
    private readonly peruAppointmentQueueWorkerUsecase: PeruAppointmentQueueWorkerUsecase
  ) {}

  async exec (event: any) {
    try {
      const eventBody = event.Records

      const response = await this.peruAppointmentQueueWorkerUsecase.ProcessEvent(eventBody)
      
      return responseHandler(200, {
        data: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}