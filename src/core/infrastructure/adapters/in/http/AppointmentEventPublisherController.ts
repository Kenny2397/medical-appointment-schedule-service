import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { publisherAppointmentSchema, publisherAppointmentType } from 'src/core/app/schemas/appointmentSchema'
import { AppointmentEventPublisherUsecase } from 'src/core/app/usecases/AppointmentEventPublisherUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class AppointmentEventPublisherController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly appointmentEventPublisherUsecase: AppointmentEventPublisherUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const eventBody = event.body
      const appointmentData: publisherAppointmentType = publisherAppointmentSchema.parse(eventBody)

      const response = await this.appointmentEventPublisherUsecase.PublishEvent(appointmentData)
      2
      return responseHandler(200, {
        data: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}