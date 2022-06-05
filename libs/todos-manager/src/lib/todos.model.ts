import { Item, ItemKeys } from '@app/db/item';
import { UserKeys } from '@app/users/user.model';
import { DynamoDB } from 'aws-sdk';
import { injectable } from 'tsyringe';

export interface TodoModel {
  id: string;
  title: string;
  completed: boolean;
}

@injectable()
export class TodoKeys extends ItemKeys {
  static ENTITY_TYPE = 'TODO';

  constructor(private todoId: string, private userKeys: UserKeys) {
    super();
  }

  get pk() {
    return this.userKeys.pk;
  }

  get sk() {
    return `${TodoKeys.ENTITY_TYPE}#${this.todoId}`;
  }
}

export class Todo extends Item<TodoModel> {
  constructor(private todo: TodoModel, private userKeys: UserKeys) {
    super();
  }

  get keys() {
    return new TodoKeys(this.todo.id, this.userKeys);
  }

  static fromItem(attributeMap: DynamoDB.AttributeMap): TodoModel {
    return {
      id: attributeMap.id.S || '',
      title: attributeMap.title.S || '',
      completed: attributeMap.completed.BOOL || false,
    };
  }

  toItem() {
    return this.marshall(this.todo);
  }
}
