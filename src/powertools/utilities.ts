import { Logger } from '@aws-lambda-powertools/logger'
import { Tracer } from '@aws-lambda-powertools/tracer'

const logger = new Logger({
  // logLevel: 'DEBUG',
  serviceName: 'appointment-service'
})

// const metrics = new Metrics({
//   defaultDimensions: {
//     aws_account_id: process.env.AWS_ACCOUNT_ID || 'N/A',
//     aws_region: process.env.AWS_REGION || 'N/A',
//   }
// })

const tracer = new Tracer()

export class GenerateError extends Error {
  name: 'Error'
  public statusCode: number
  public body: Record<string, any> | string
  
  constructor (statusCode: number, body: object) {
    super()
    this.statusCode = statusCode
    this.body = body || {}
  }
}

export const responseHandler = (statusCode: number, body?: any, error?: any) => {
  

  const listStatus: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    500: 'Internal Server Error',
    503: 'Service Unavailable'
  }

  let response: Record<string, any> = {
    statusCode,
    message: listStatus[statusCode] || listStatus[500],
  }

  if (body) response['body'] = body

  if (error instanceof GenerateError) {
    const errorResponse: Record<string, any> = {}
    // errorResponse.status = {
    //   statusCode: error.statusCode,
    //   message: listStatus[error.statusCode] || listStatus[500],
    // }

    errorResponse.statusCode = error.statusCode
    errorResponse.message = listStatus[error.statusCode] || listStatus[500]
    errorResponse.body = error.body || listStatus[500]
    logger.error('response Handler', {
      errorResponse
    })

    throw new Error(JSON.stringify(errorResponse))
  }
  logger.info('response Handler', {
    statusCode,
    body,
    error
  })
  return response
}

export {
  logger,
  tracer
}

