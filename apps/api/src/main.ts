import { LoggingInterceptor } from '@vms/middlewares'
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { DocumentBuilder } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { bootstrap } from '@vms/infra/nest-server';
import { AppModule } from './app/app.module';

const authOptions: SecuritySchemeObject = {
  type: 'http',
  scheme: 'Bearer',
  in: 'Header',
  name: 'Authorization',
  bearerFormat: 'Bearer',
};

const apiDocument = new DocumentBuilder()
  .setTitle('VMS ON PREMISE API DOCS')
  .setDescription('New API base')
  .setVersion('1.0.0')
  .addBearerAuth(authOptions, 'access-token')
  .addBearerAuth(authOptions, 'refresh-token')
  .build();

const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
  },
  customSiteTitle: 'VMS API',
};

bootstrap({
  name: 'VMS - API',
  appModule: AppModule,
  globalPrefix: 'api',
  port: 3333,
  openApi: apiDocument,
  swaggerCustomOptions: swaggerOptions,
  enableWebsocket: true,
  interceptors: [new LoggingInterceptor('app')],
});
