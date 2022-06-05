import { DynamoDBService } from '@app/db/dynamoDb';
import { USER_EMAIL } from '@app/http/types';
import { container } from 'tsyringe';
import { TodoService } from './todos.service';

describe('TodoService', () => {
  container.register(USER_EMAIL, { useValue: 'email@exmaple.com' });

  let todoService: TodoService;
  let dynamoDB: DynamoDBService;

  beforeEach(() => {
    todoService = container.resolve(TodoService);
    dynamoDB = container.resolve(DynamoDBService);
  });

  it('should get all todos for user', async () => {
    dynamoDB.query = jest.fn().mockResolvedValueOnce({
      Items: [],
    });

    const res = await todoService.getTodos();

    expect(res).toEqual([]);
  });
});
