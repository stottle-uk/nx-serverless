import { DynamoDBService } from '@app/db/dynamoDb';
import { getItem } from '@app/db/operations';
import { UserKeys } from '@app/users/user.model';
import { inject, Lifecycle, scoped } from 'tsyringe';
import { ulid } from 'ulid';
import { Todo, TodoKeys, TodoModel } from './todos.model';

export interface TodoCreateReq extends Record<string, string> {
  title: string;
}

@scoped(Lifecycle.ContainerScoped)
export class TodoService {
  constructor(
    @inject(UserKeys) private userKeys: UserKeys,
    @inject(DynamoDBService) private db: DynamoDBService
  ) {}

  async create(req: TodoCreateReq): Promise<TodoModel> {
    const todo = new Todo(
      { id: ulid(), completed: false, title: req.title },
      this.userKeys
    );

    await this.db.createItem(todo, 'todos');

    return Todo.fromItem(todo.toItem());
  }

  async getTodo(todoId: string) {
    const todoKeys = new TodoKeys(todoId, this.userKeys);
    const result = await getItem(todoKeys);

    return Todo.fromItem(result.Item || {});
  }

  async updateTodo(todoId: string, completed: TodoModel['completed']) {
    const todoKeys = new TodoKeys(todoId, this.userKeys);
    await this.db.updateItem(todoKeys, 'todos', {
      UpdateExpression: 'SET #completed = :completed',
      ExpressionAttributeValues: {
        ':completed': { BOOL: completed },
      },
      ExpressionAttributeNames: {
        '#completed': 'completed',
      },
    });

    return { success: true };
  }

  async getTodos() {
    const result = await this.db.query({
      TableName: 'todos',
      KeyConditionExpression: `PK = :PK AND begins_with(SK, :SK)`,
      ExpressionAttributeValues: {
        ':PK': { S: this.userKeys.pk },
        ':SK': { S: TodoKeys.ENTITY_TYPE },
      },
    });

    return (result.Items || []).map(Todo.fromItem);
  }
}
