import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { BaseCRUDTest } from '@/api/module/crudTest';

export const useToDoStore = defineStore('todo', () => {
  const todoList = ref<BaseCRUDTest[]>([]);
  const updateTodoList = (payload: BaseCRUDTest[]) =>
    (todoList.value = payload);

  return {
    todoList,
    updateTodoList,
  };
});
