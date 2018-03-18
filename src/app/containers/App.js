import {SHOW_ALL} from '../constants/TodoFilters';
import {initialTodo} from '../todos/todos';

class AppController {
  constructor() {
    this.todos = [initialTodo];
    this.filter = SHOW_ALL;
  }
}

export const App = {
  template: require('./App.html'),
  controller: AppController
};
