import { DynamoDB } from 'aws-sdk';
import { inject, Lifecycle, scoped } from 'tsyringe';
import { AWS_DYNAMO_CLIENT } from './client';
import { dbErrorLogger } from './errors';
import { Item, ItemKeys } from './item';

@scoped(Lifecycle.ContainerScoped)
export class DynamoDBService {
  constructor(@inject(AWS_DYNAMO_CLIENT) private db: DynamoDB) {}

  async createItem<T extends Item<any>>(
    item: T,
    tableName: string,
    options?: Omit<DynamoDB.PutItemInput, 'TableName'>
  ) {
    try {
      return await this.db
        .putItem({
          TableName: tableName,
          Item: item.toItem(),
          ConditionExpression: 'attribute_not_exists(SK)',
          ...options,
        })
        .promise();
    } catch (e) {
      dbErrorLogger(e);

      throw {
        success: false,
      };
    }
  }

  async updateItem(
    keys: ItemKeys,
    tableName: string,
    options?: Omit<DynamoDB.UpdateItemInput, 'TableName' | 'Key'>
  ) {
    try {
      return await this.db
        .updateItem({
          TableName: tableName,
          Key: keys.toItem(),
          ...options,
        })
        .promise();
    } catch (e) {
      dbErrorLogger(e);

      throw {
        success: false,
      };
    }
  }

  async deleteItem(
    keys: ItemKeys,
    tableName: string,
    options?: Omit<DynamoDB.DeleteItemInput, 'TableName'>
  ) {
    try {
      await this.db
        .deleteItem({
          TableName: tableName,
          Key: keys.toItem(),
          ...options,
        })
        .promise();
    } catch (e) {
      dbErrorLogger(e);

      throw {
        success: false,
      };
    }
  }

  async query(options: DynamoDB.QueryInput) {
    try {
      return await this.db.query(options).promise();
    } catch (e) {
      dbErrorLogger(e);

      throw {
        success: false,
      };
    }
  }

  async getItem(
    keys: ItemKeys,
    tableName: string,
    options?: Omit<DynamoDB.GetItemInput, 'TableName'>
  ) {
    try {
      return await this.db
        .getItem({
          TableName: tableName,
          Key: keys.toItem(),
          ...options,
        })
        .promise();
    } catch (e) {
      dbErrorLogger(e);

      throw {
        success: false,
      };
    }
  }
}
