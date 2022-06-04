import { createProtectedHandler } from '@app/http/handlers';
import { httpError, httpResponse } from '@app/http/response';
import { QueryParams } from '@app/http/types';
import { container } from 'tsyringe';
import { TodoService } from '../todo.model';

type Params = QueryParams<{ searchTerm: string }>;

export const main = createProtectedHandler<Params>(async () => {
  const todosService = container.resolve(TodoService);

  try {
    const todos = await todosService.getTodos();

    return httpResponse({
      todos,
    });
  } catch (e) {
    return httpError(e);
  }
});
