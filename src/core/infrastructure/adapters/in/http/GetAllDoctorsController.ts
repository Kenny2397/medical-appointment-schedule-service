import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { GetAllDoctorsOfCountryBySpecialitySchema } from 'src/core/app/schemas/DoctorSchema'
import { GetAllDoctorsUsecase } from 'src/core/app/usecases/GetAllDoctorsUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class GetAllDoctorsController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly getAllDoctorsUsecase: GetAllDoctorsUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const data = event as unknown as { query: object } 

      const dataParsed = GetAllDoctorsOfCountryBySpecialitySchema.parse(data.query) 
      const response = await this.getAllDoctorsUsecase.GetAllDoctorsOfCountryBySpeciality(dataParsed)
      
      return responseHandler(200, {
        data: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}