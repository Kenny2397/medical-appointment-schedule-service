import { handler } from 'src/functions/hello'
import { eventGenerator } from './__mocks__/request/eventGenerator'
import { contextMock } from './__mocks__/request/httpMock'
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'

describe('Handler should be return  a valid response', () => {
  test('It should return a valid response', async () => {
    // Arrange
    const event = eventGenerator({})
    const context = contextMock
    // Act
    const response: APIGatewayProxyStructuredResultV2 = await handler(event, context)
    // Assert
    expect(response.statusCode).toBe(200)
  })
})