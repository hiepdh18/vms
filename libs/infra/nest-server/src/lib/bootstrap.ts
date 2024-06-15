import {
  INestApplication,
  NestInterceptor,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import {
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  LoggingModule,
  logger,
  monkeyPatchServerLogging,
} from '@vms/infra/logging';
import * as fs from 'fs-extra';
import { Server } from 'http';
import * as yaml from 'js-yaml';
import * as yargs from 'yargs';
import { httpRequestDurationMiddleware } from './httpRequestDurationMiddleware';
import { NestServerModule } from './nest-server.module';
import { swaggerRedirectMiddleware } from './swaggerMiddlewares';

const KEEP_ALIVE_TIMEOUT = 1000 * 30;

type RunServerOptions = {
  appModule: Type<any>;
  name: string;
  swaggerPath?: string;
  openApi?: Omit<OpenAPIObject, 'paths'>;
  swaggerCustomOptions?: SwaggerCustomOptions;
  port?: number;
  interceptors?: NestInterceptor[];
  globalPrefix?: string;
  stripNonClassValidatorInputs?: boolean;
  enableVersioning?: boolean;
  enableWebsocket?: boolean;
};

export const createApp = async ({
  stripNonClassValidatorInputs = true,
  appModule,
  enableVersioning,
  ...options
}: RunServerOptions) => {
  // For binding console to logger
  monkeyPatchServerLogging();
  const app: any = await NestFactory.create<NestExpressApplication>(
    NestServerModule.forRoot({
      appModule,
    }),
    {
      logger: LoggingModule.createLogger(),
    }
  );
  if (enableVersioning) {
    app.enableVersioning();
  }
  if (options.enableWebsocket) {
    app.useWebSocketAdapter(new WsAdapter(app));
  }
  app.enableCors({ origin: '*' });

  // Enable validation of request DTOs globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: stripNonClassValidatorInputs,
      forbidNonWhitelisted: true,
    })
  );

  if (options.globalPrefix) {
    app.setGlobalPrefix(options.globalPrefix);
  }

  app.use(httpRequestDurationMiddleware());
  // app.use(new WinstonMiddleware().use);

  return app;
};

const startServer = async (app: INestApplication, port = 3333) => {
  const servicePort = parseInt(process.env['PORT'] || '') || port;

  const server = (await app.listen(servicePort, () => {
    logger.info(`Service listening at http://localhost:${servicePort}`, {
      context: 'Bootstrap',
    });
  })) as Server;
  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT;
};

function generateSchema(filePath: string, document: OpenAPIObject) {
  logger.info('Generating OpenAPI schema.', { context: 'Bootstrap' });
  fs.writeFileSync(filePath, yaml.dump(document, { noRefs: true }));
}

function setupOpenApi(
  app: INestApplication,
  openApi: Omit<OpenAPIObject, 'paths'>,
  swaggerPath = '/swagger',
  swaggerCustomOptions: SwaggerCustomOptions = {}
) {
  app.use(swaggerPath, swaggerRedirectMiddleware(swaggerPath));

  const document = SwaggerModule.createDocument(app, openApi);
  SwaggerModule.setup(swaggerPath, app, document, swaggerCustomOptions);
  return document;
}

export const bootstrap = async (options: RunServerOptions) => {
  const argv = await yargs.option('generateSchema', {
    description: 'Generate OpenAPI schema into the specified file',
    type: 'string',
  }).argv;

  const app = await createApp(options);
  if (options.openApi) {
    const document = setupOpenApi(
      app,
      options.openApi,
      options.swaggerPath,
      options.swaggerCustomOptions
    );
    if (argv.generateSchema) {
      generateSchema(argv.generateSchema, document);
      await app.close();
      return;
    }
  }
  if (options.interceptors) {
    options.interceptors.forEach((interceptor) => {
      app.useGlobalInterceptors(interceptor);
    });
  }
  startServer(app, options.port);
};
