import { createProtectedHandler } from '@app/http/handlers';
import { httpError, httpResponse } from '@app/http/response';
import { schemaValidator } from '@app/http/schema-validator.middleware';
import { BodyParams } from '@app/http/types';
import { container } from 'tsyringe';
import { object, string } from 'yup';
import { TodoCreateReq, TodoService } from '../todo.model';

type Params = BodyParams<TodoCreateReq>;

export const main = createProtectedHandler<Params>(async (event) => {
  const todosService = container.resolve(TodoService);

  try {
    const newTodo = await todosService.create(event.body);

    return httpResponse({
      todo: newTodo,
    });
  } catch (e) {
    return httpError(e);
  }
});

main.use([
  schemaValidator<Params>({
    body: object({
      title: string().required(),
    }),
  }),
]);
