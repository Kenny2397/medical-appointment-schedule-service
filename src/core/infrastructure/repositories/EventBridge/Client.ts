import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { config } from '@config/environment'
import { NodeHttpHandler } from '@smithy/node-http-handler'

const { region } = config
let client: EventBridgeClient | null = null

export const getClientEventBridge = () => {
  if (client) return client
  client = new EventBridgeClient({
    region,
    requestHandler: new NodeHttpHandler({
      connectionTimeout: Number(config.sdkConnectionTimeout),
      socketTimeout: Number(config.sdkSocketTimeout)
    })
  })
  return client
}
