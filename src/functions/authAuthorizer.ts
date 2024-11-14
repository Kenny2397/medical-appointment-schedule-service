import { APIGatewayProxyResult } from 'aws-lambda'
import { logger } from 'src/powertools/utilities'

/**
 * @description The controller.
 */
export async function handler (event: any): Promise<APIGatewayProxyResult> {
  logger.logEventIfEnabled(event)
  const clientToken = event.authorizationToken || event.headers.Authorization // Do something with an incoming auth token
  
  let active = false // Do something to check if user is active or similar
  
  if (clientToken === 'tokenSecret') {
    active = true
  }

  const policy = active ? 'Allow' : 'Deny'
  console.log(`Is user active? ${active}`)

  const response = JSON.stringify({
    something: 'It\'s something'
  })

  return generatePolicy('user', policy, event.methodArn, response)
}

/**
 * @description Creates the IAM policy for the response.
 */
const generatePolicy = (principalId: any, effect: any, resource: any, data: any) => {
  // @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
  const authResponse: any = {
    principalId
  }

  if (effect && resource) {
    const policyDocument: any = {
      Version: '2012-10-17',
      Statement: []
    }

    const statement = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    }

    policyDocument.Statement[0] = statement
    authResponse.policyDocument = policyDocument
  }

  authResponse.context = {
    stringKey: JSON.stringify(data)
    //role: user.role --> "principalId" could be an object that also has role
  }

  console.log('authResponse', authResponse)

  return authResponse
}