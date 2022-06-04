import { HandlerEvent, UserContext, USER_EMAIL } from '@app/http/types';
import { Context } from 'aws-lambda';
import { container } from 'tsyringe';
import { TodoService } from '../todo.model';
import { main } from './get-todos-handler';

describe('get-todos', () => {
  container.register(USER_EMAIL, { useValue: 'email@exmaple.com' });

  let todosService: TodoService;

  beforeEach(() => {
    todosService = container.resolve(TodoService);

    jest.spyOn(todosService, 'getTodos').mockResolvedValueOnce([]);
  });

  it('should do something useful', async () => {
    const res = await main(
      {} as HandlerEvent<any>,
      {} as Context & UserContext
    );

    expect(todosService.getTodos).toBeCalled();
    expect(res).toEqual({
      body: '{"data":{"todos":[]}}',
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': 86400,
      },
      statusCode: 200,
    });
  });
});
