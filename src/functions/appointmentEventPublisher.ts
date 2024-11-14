import { AppointmentEventPublisherController } from '@infrastructure/adapters/in/http/AppointmentEventPublisherController'
import { AWSAppointmentRepository } from '@infrastructure/repositories/AWSAppointmentRepository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { AppointmentEventPublisherUsecase } from 'src/core/app/usecases/AppointmentEventPublisherUsecase'
import { logger } from 'src/powertools/utilities'

const appointmentEventPublisherController = new AppointmentEventPublisherController(
  new AppointmentEventPublisherUsecase(
    new AWSAppointmentRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {
  
  logger.logEventIfEnabled(event)
  const res = await appointmentEventPublisherController.exec(event)
  return res
}