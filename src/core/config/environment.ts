const {
  REGION,
  SDK_SOCKET_TIMEOUT,
  SDK_CONNECTION_TIMEOUT,
  APPOINTMENT_SERVICE_TABLE_NAME,
  APPOINTMENT_EVENT_BUS,
} = process.env

export const config = {
  region: REGION,
  sdkSocketTimeout: SDK_SOCKET_TIMEOUT,
  sdkConnectionTimeout: SDK_CONNECTION_TIMEOUT,
  appointmentServiceTable: APPOINTMENT_SERVICE_TABLE_NAME,
  appointmentEventBus: APPOINTMENT_EVENT_BUS,
}