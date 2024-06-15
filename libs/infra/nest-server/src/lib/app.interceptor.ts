import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import tracer from 'dd-trace';
import { Observable, from, lastValueFrom } from 'rxjs';

export class ApPInterceptor implements NestInterceptor {
  async intercept(
    executionContext: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const handlerClass = executionContext.getClass();
    const handlerFn = executionContext.getHandler();

    return from(
      tracer.trace(
        'nestjs.handler',
        {
          resource: `${handlerClass.name}#${handlerFn.name}`,
        },
        () => lastValueFrom(next.handle())
      )
    );
  }
}
