import { createProtectedHandler } from '@app/http/handlers';
import { httpError, httpResponse } from '@app/http/response';
import { BodyParams, PathParams } from '@app/http/types';
import { TodoModel, TodoService } from '@app/todos-manager';
import { container } from 'tsyringe';

type Params = PathParams<{ id: string }> &
  BodyParams<{ completed: TodoModel['completed'] }>;

export const main = createProtectedHandler<Params>(async (event) => {
  const todosService = container.resolve(TodoService);

  try {
    const result = await todosService.updateTodo(
      event.pathParameters.id,
      event.body.completed
    );

    return httpResponse(result);
  } catch (e) {
    return httpError(e);
  }
});
