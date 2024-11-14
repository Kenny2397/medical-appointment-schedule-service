import { APIGatewayProxyEventV2 } from 'aws-lambda'

export const eventGenerator = ({
  body,
  method,
  authorization,
  path = '',
  queryStringObject,
  pathParameters,
  stageVariables = null,
}: any) : APIGatewayProxyEventV2 => {
  const request = {
    'version': '2.0',
    'routeKey': 'GET /hello',
    'rawPath': '/hello',
    'rawQueryString': '',
    'headers': {
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'content-length': '0',
      'host': 'deyfxe1jvh.execute-api.us-east-1.amazonaws.com',
      'postman-token': '17bc5a2e-2a40-4eeb-891d-bcd4abe8efce',
      'user-agent': 'PostmanRuntime/7.37.0',
      'x-amzn-trace-id': 'Root=1-65f5d8cc-766c48700865408b071b3142',
      'x-forwarded-for': '179.6.3.45',
      'x-forwarded-port': '443',
      'x-forwarded-proto': 'https'
    },
    requestContext: {
      authorizer: {},
      protocol: 'HTTP/1.1',
      httpMethod: method,
      identity: {},
      path: '',
      requestTimeEpoch: '',
      resourceId: '',
      resourcePath: '',
      'accountId': '3464756',
      'apiId': 'deyfxe1j3vh',
      'domainName': 'deyfxe1j3vh.execute-api.us-east-1.amazonaws.com',
      'domainPrefix': 'deyfxe1jvh',
      'http': {
        'method': 'GET',
        'path': '/hello',
        'protocol': 'HTTP/1.1',
        'sourceIp': '179.6.3.45',
        'userAgent': 'PostmanRuntime/7.37.0'
      },
      'requestId': 'Uu7QBh4ioAMESR3Q=',
      'routeKey': 'GET /hello',
      'stage': '$default',
      'time': '16/Mar/2024:17:37:16 +0000',
      'timeEpoch': 1710610636664
    },
    'isBase64Encoded': false,
    body: body ? JSON.stringify(body) : '',
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path,
    pathParameters: pathParameters ?? {},
    httpMethod: method,
    queryStringParameters: queryStringObject,
    stageVariables: stageVariables,
    resource: '/hello',
  }
  return request
}
