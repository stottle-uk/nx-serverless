import { env } from '@app/env';
import AWS, { DynamoDB } from 'aws-sdk';
import { container, InjectionToken } from 'tsyringe';

AWS.config.update({
  region: env.region,
});

let client: DynamoDB | null = null;

export function getClient() {
  if (!client) {
    const options = {
      endpoint: env.dynamo.endpoint,
      httpOptions: {
        connectTimeout: 1000,
        timeout: 1000,
      },
    };

    client = new DynamoDB(env.name === 'dev' ? options : undefined);
  }

  return {
    db: client,
    TableName: env.dynamo.tableName,
  };
}

export const AWS_DYNAMO_CLIENT: InjectionToken<DynamoDB> =
  Symbol.for('AWS_DYNAMO_CLIENT');

container.register<DynamoDB>(AWS_DYNAMO_CLIENT, {
  useValue: new DynamoDB(
    env.name === 'dev'
      ? {
          endpoint: env.dynamo.endpoint,
          httpOptions: {
            connectTimeout: 1000,
            timeout: 1000,
          },
        }
      : undefined
  ),
});
