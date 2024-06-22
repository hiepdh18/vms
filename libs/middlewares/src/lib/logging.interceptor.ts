import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { loggerGroup } from '@vms/infra/logging';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as winston from 'winston';

import {
  ACCESS_USER_ACTION,
  AREA_ACTION,
  AUTH_ACTION,
  BARRIER_ACTION,
  DEVICE_ACTION,
  EMAPS_ACTION,
  LAYOUT_ACTION,
  RECORDER_ACTION,
  ROLE_ACTION,
  SCADA_ACTION,
  USER_ACTION,
} from '@vms/shared/constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: winston.Logger;
  // name - make file: 'DATE.type.log'

  constructor(type: string) {
    this.logger = loggerGroup(type);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const username = request['user']?.username;
    const { statusCode } = context.switchToHttp().getResponse();
    const { originalUrl, method, params, query, body, headers } = request;
    console.log('----------Begin Interceptor----------');

    // console.log('method', {method});
    // console.log('originalUrl', originalUrl);
    // console.log('statusCode', {statusCode});

    const bodyHidden: any = {};
    // hidden password
    if (body && Object.keys(body).length > 0) {
      for (const [key, value] of Object.entries(body)) {
        if (RegExp('password', 'gi').test(key) && typeof value === 'string') {
          bodyHidden[key] = '*'.repeat(value.length);
        }
      }
    }

    const logRequest = {
      originalUrl,
      method,
      headers,
      params,
      query,
      body: { ...body, ...bodyHidden },
    };

    return next.handle().pipe(
      tap((data) => {
        const response = { statusCode, data };
        // console.log('success');
        this.logger.info({
          request: logRequest,
          response,
        });

        // create audit log
        if (username) {
          this.saveLog(username, statusCode, originalUrl, method);
        }
        console.log('----------End Interceptor----------');
      }),
      catchError((error) => {
        // console.log('failed');
        const response = error?.response || error;
        this.logger.info({
          request: logRequest,
          response: response,
        });

        // create audit log
        if (username) {
          this.saveLog(
            username,
            response.statusCode || 500,
            originalUrl,
            method
          );
        }
        return throwError(error);
      })
    );
  }

  async saveLog(
    username: string,
    statusCode: number,
    originalUrl: string,
    method: string
  ) {
    const url = originalUrl.split('/');
    let urlKey = url[3];
    if (url[4]) urlKey = url[4];

    const descriptionActions = this.getActionFromUrl(url[2], urlKey, method);
    let status = true;
    if (statusCode !== 200 && statusCode !== 201) {
      status = false;
    }
    if (descriptionActions) {
      const data = {
        user: username,
        event: descriptionActions,
        status: status,
        time: new Date(),
        code: statusCode,
      };
      // await AuDitLogEntity.query().insert(data);
    }
  }

  getActionFromUrl(urlTag: string, urlKey: string, method: string) {
    urlTag = urlTag.split('?')[0];
    // change urlKey
    if (!urlKey) {
      urlKey = 'base-url';
    } else if (Number(urlKey.replace('?', ''))) {
      urlKey = 'parameters';
    }

    // auth url
    if (urlTag === 'auth') return AUTH_ACTION[method][urlKey];

    if (urlTag === 'users') return USER_ACTION[method][urlKey];

    if (urlTag === 'scada-devices') return SCADA_ACTION[method][urlKey];

    if (urlTag === 'roles') return ROLE_ACTION[method][urlKey];

    if (urlTag === 'recorders') return RECORDER_ACTION[method][urlKey];

    if (urlTag === 'screen-layouts') return LAYOUT_ACTION[method][urlKey];

    if (urlTag === 'emaps') return EMAPS_ACTION[method][urlKey];

    if (urlTag === 'devices') return DEVICE_ACTION[method][urlKey];

    if (urlTag === 'areas') return AREA_ACTION[method][urlKey];

    if (urlTag === 'barriers') return BARRIER_ACTION[method][urlKey];

    if (urlTag === 'access-users') return ACCESS_USER_ACTION[method][urlKey];
  }
}
