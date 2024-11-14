
# medical appointment scheduling service

## 1. Diseño de Arquitectura

Para este sistema de agendamiento de citas médicas, propongo una arquitectura serverless basada en eventos utilizando los siguientes servicios de AWS:

![Medical Appointment System Architecture Diagram](https://via.placeholder.com/600x400 "Medical Appointment System Architecture Diagram")

1. **API Gateway**: Expone una API REST que permite a los usuarios registrar, consultar y actualizar citas médicas.
2. **Lambda Functions**: Procesan los eventos de la API Gateway y ejecutan la lógica de negocio específica por país.
3. **DynamoDB**: Almacena la información de las citas médicas y los usuarios.
4. **SNS (Simple Notification Service)**: Envía notificaciones a los usuarios sobre el estado de sus citas.
5. **CloudWatch**: Monitorea el sistema y genera alertas en caso de errores o problemas de rendimiento.

## 2. Manejo de Datos

La estructura de datos en DynamoDB sería la siguiente:

- **Tabla de Citas**: 
  - `appointmentId` (Clave Primaria)
  - `patientId`
  - `doctorId`
  - `dateTime`
  - `status` (Registrado, Pendiente, Asignado, etc.)
  - `country`
- **Tabla de Usuarios**:
  - `userId` (Clave Primaria)
  - `name`
  - `email`
  - `role` (Paciente, Doctor, Administrador)
  - `country`

## 3. Procesamiento por País

Para manejar la lógica específica por país, utilizaré una arquitectura basada en eventos con Lambda Functions. Cuando se recibe una solicitud de agendamiento a través de la API Gateway, se envía un evento a una Lambda Function que se encarga de procesar la solicitud según la lógica del país correspondiente.

Cada Lambda Function tendrá acceso a las tablas de DynamoDB y podrá realizar las siguientes operaciones:

- Registrar una nueva cita
- Actualizar el estado de una cita
- Notificar a los usuarios a través de SNS

Para agregar un nuevo país al sistema, bastaría con crear una nueva Lambda Function que implemente la lógica de ese país y configurar la API Gateway para enrutar las solicitudes a la función apropiada.

## 4. Escalabilidad y Rendimiento

La arquitectura propuesta es altamente escalable, ya que cada componente se escala de forma independiente:

- **API Gateway**: Escala automáticamente para manejar variaciones en el tráfico.
- **Lambda Functions**: Se ejecutan bajo demanda y se escalan automáticamente según la carga.
- **DynamoDB**: Es un servicio de base de datos altamente escalable y de alto rendimiento.

Para mejorar el rendimiento, se podría implementar un sistema de caché utilizando ElastiCache (Redis) para almacenar datos de consulta frecuente, como disponibilidad de doctores.

## 5. Seguridad y Cumplimiento

Para asegurar la protección de datos sensibles, se aplicarán las siguientes medidas:

- **Autenticación y Autorización**: Utilizaré Amazon Cognito para gestionar la identidad y el acceso de los usuarios.
- **Cifrado de Datos**: Todos los datos almacenados en DynamoDB y en tránsito se cifrarán utilizando claves de cifrado administradas por AWS.
- **Registros y Auditoría**: Integraré CloudTrail para monitorear y auditar todas las acciones realizadas en el sistema.
- **Cumplimiento de Normativas**: Revisaré y cumpliré con los requisitos de seguridad y privacidad aplicables en cada país, como GDPR y HIPAA.

## 6. Monitoreo y Manejo de Errores

Para el monitoreo del sistema, utilizaré Amazon CloudWatch con las siguientes funcionalidades:

- **Métricas y Alertas**: Definiré métricas clave, como errores de API, duración de Lambda, y utilizaré alertas para notificar problemas.
- **Registros y Análisis**: Enviaré los registros de Lambda, API Gateway y DynamoDB a CloudWatch Logs para su análisis y depuración.
- **Dashboards**: Crearé dashboards personalizados para visualizar el estado y el rendimiento general del sistema.

En cuanto al manejo de errores, implementaré las siguientes estrategias:

- **Reintentos Automáticos**: Configuraré las funciones Lambda y la API Gateway para reintentar automáticamente las solicitudes fallidas.
- **Gestión de Excepciones**: Capturaremos y manejaremos de manera adecuada todas las excepciones en las funciones Lambda, brindando respuestas descriptivas a los usuarios.
- **Flujos de Compensación**: En caso de errores en pasos intermedios de una transacción, ejecutaremos flujos de compensación para revertir los cambios y dejar el sistema en un estado consistente.

## 7. Código de Muestra

Aquí se muestra un ejemplo de cómo se podría implementar una función Lambda para procesar solicitudes de agendamiento de citas en Perú:

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { patientId, doctorId, dateTime } = JSON.parse(event.body!);

    // Verificar disponibilidad del doctor en Perú
    const doctorAvailable = await checkDoctorAvailability(doctorId, dateTime, 'PE');

    if (!doctorAvailable) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Doctor not available at the requested time' }),
      };
    }

    // Registrar la cita en DynamoDB
    const appointment = {
      appointmentId: generateUUID(),
      patientId,
      doctorId,
      dateTime,
      status: 'Registered',
      country: 'PE',
    };

    await dynamodb.put({ TableName: 'Appointments', Item: appointment }).promise();

    // Notificar al paciente y al doctor por SNS
    await notifyUsers(patientId, doctorId, dateTime, 'Registered');

    return {
      statusCode: 200,
      body: JSON.stringify(appointment),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing appointment' }),
    };
  }
};

const checkDoctorAvailability = async (
  doctorId: string,
  dateTime: string,
  country: string
): Promise<boolean> => {
  // Lógica específica de Perú para verificar la disponibilidad del doctor
  // Consultar DynamoDB y aplicar reglas de negocio de Perú
  return true;
};

const notifyUsers = async (
  patientId: string,
  doctorId: string,
  dateTime: string,
  status: string
): Promise<void> => {
  // Enviar notificaciones a los usuarios a través de SNS
  // Lógica específica de Perú para los mensajes de notificación
};

const generateUUID = (): string => {
  // Generar un UUID único
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
```

## 8. Consideraciones Adicionales

Para manejar la latencia de respuesta al usuario, se podrían implementar las siguientes estrategias:

- **Colas de Mensaje**: Utilizar Amazon SQS para recibir solicitudes de agendamiento y procesarlas de manera asincrónica, enviando una respuesta provisional al usuario de forma inmediata.
- **Caché de Disponibilidad de Doctores**: Almacenar en caché (ElastiCache) la disponibilidad de los doctores por país, país y fecha, para responder rápidamente a las consultas de los usuarios.
- **Notificaciones Asincrónicas**: Enviar notificaciones sobre el estado de las citas a través de SNS, en lugar de esperar a que el usuario consulte el estado.


## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kennyluquet/)

[Kenny Luque](https://kennyluque.vercel.app/)


## Usage

Clone this repository and install dependencies

- Install CLI serverless

    npm install serverless -g

- setting credentials

    aws configure

- deploy

    npm run deploy


## Estrctura del proyecto

```bash

├── src
│   ├── functions
│   │   └── getSurvey
│   └── core
│       ├── config
│       │   └── environment.ts
│       ├── app
│       │   ├── schemas
│       │   ├── usecases
│       │   └── ports
│       ├── domain
│       │   ├── models
│       │   └── services
│       │       └── repositories
│       └── infrastructure
│           ├── adapters
│           ├── repositories
│           └── utils
├── test
│   ├── functions
│   │   └── ...
│   └── core
│        └── ...
├── serverless.yml
└── package.json

```

## Medical appointment scheduling service business use case

This use case talks about using DynamoDB as a social network. A social network is an online service that lets different users interact with each other. The social network we'll design will let the user see a timeline consisting of their posts, their followers, who they are following, and the posts written by who they are following. The access patterns for this schema design are:

* Get user information for a given userID

* Get follower list for a given userID

* Get following list for a given userID

* Get post list for a given userID

* Get user list who likes the post for a given postID

* Get the like count for a given postID

* Get the timeline for a given userID

## Single table design

