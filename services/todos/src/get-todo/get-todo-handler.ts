import { createProtectedHandler } from '@app/http/handlers';
import { httpError, httpResponse } from '@app/http/response';
import { PathParams } from '@app/http/types';
import { TodoService } from '@app/todos-manager';
import { container } from 'tsyringe';

type Params = PathParams<{ id: string }>;

export const main = createProtectedHandler<Params>(async (event) => {
  const todosService = container.resolve(TodoService);

  try {
    const todo = await todosService.getTodo(event.pathParameters.id);

    return httpResponse({ todo });
  } catch (e) {
    return httpError(e);
  }
});
