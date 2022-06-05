import { env } from '@app/env';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';
import { httpError } from './response';
import { Handler, UserContext, USER_EMAIL } from './types';

export function authMiddleware(): middy.MiddlewareObj<
  Parameters<Handler<any>>[0],
  APIGatewayProxyResult
> {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request) => {
    const authHeader = request.event.headers['Authorization'];

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      try {
        const data = jwt.verify(token, env.jwtSecret);
        (request.context as unknown as UserContext).user =
          data as UserContext['user'];

        // Here for now - should be somewhere better
        if (!container.isRegistered(USER_EMAIL)) {
          container.register(USER_EMAIL, {
            useValue: (data as UserContext['user']).id,
          });
        }

        return Promise.resolve();
      } catch (error) {
        return httpError(error, { statusCode: 401 });
      }
    }

    return httpError('Missing token', { statusCode: 401 });
  };

  return {
    before,
  };
}
