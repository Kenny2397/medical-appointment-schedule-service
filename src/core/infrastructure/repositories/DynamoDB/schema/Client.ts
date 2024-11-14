import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { config } from '@config/environment'
import { NodeHttpHandler } from '@smithy/node-http-handler'

const { region } = config
let client: DynamoDBClient | null = null

export const getClientDynamoDB = () => {
  if (client) return client
  client = new DynamoDBClient({
    region,
    requestHandler: new NodeHttpHandler({
      connectionTimeout: Number(config.sdkConnectionTimeout),
      socketTimeout: Number(config.sdkSocketTimeout)
    })
  })
  return client
}
