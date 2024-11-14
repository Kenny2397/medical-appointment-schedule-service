import { GetAllDoctorsController } from '@infrastructure/adapters/in/http/GetAllDoctorsController'
import { DynamoDBDoctorRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBDoctorRepository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { GetAllDoctorsUsecase } from 'src/core/app/usecases/GetAllDoctorsUsecase'
import { logger } from 'src/powertools/utilities'

const getAllDoctorsController = new GetAllDoctorsController(
  new GetAllDoctorsUsecase(
    new DynamoDBDoctorRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {

  logger.logEventIfEnabled(event)

  const res = await getAllDoctorsController.exec(event)

  return res
}




