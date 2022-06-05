import { createProtectedHandler } from '@app/http/handlers';
import { httpError, httpResponse } from '@app/http/response';
import { QueryParams } from '@app/http/types';
import { TodoService } from '@app/todos-manager';
import { container } from 'tsyringe';

type Params = QueryParams<{ searchTerm: string }>;

export const main = createProtectedHandler<Params>(async () => {
  try {
    const todosService = container.resolve(TodoService);
    const todos = await todosService.getTodos();

    return httpResponse({ todos });
  } catch (e) {
    return httpError(e);
  }
});
