import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Board, Card } from "@/types";
import { arrayOfCardFromMap, generateUID } from "@/helpers";
import { columnNames } from "@/enums";

export const useTaskBoardStore = defineStore("taskBoard", () => {
  const board = ref<Board>({
    todo: new Map(),
    inProgress: new Map(),
    done: new Map(),
  });

  const getTodoColumn = computed((): Card[] => {
    return arrayOfCardFromMap(board.value.todo);
  });
  const getInProgressColumn = computed((): Card[] => {
    return arrayOfCardFromMap(board.value.inProgress);
  });
  const getDoneColumn = computed((): Card[] => {
    return arrayOfCardFromMap(board.value.done);
  });
  const getBoard = computed((): Array<Record<string, Card[]>> => {
    return [
      { [columnNames.TODO]: getTodoColumn.value },
      { [columnNames.IN_PROGRESS]: getInProgressColumn.value },
      { [columnNames.DONE]: getDoneColumn.value },
    ];
  });

  function getTask(columnName: columnNames, taskId: string) {
    return board.value[columnName].get(taskId);
  }

  function removeTask(taskId: string, columnName: columnNames) {
    board.value[columnName].delete(taskId);
  }

  function saveTask(task: Card, message: string, columnName: columnNames) {
    board.value[columnName].get(task.id)!.message = message;
  }

  function createTask(columnName: columnNames, taskTitle: string) {
    board.value[columnName].set(generateUID(), {
      title: taskTitle,
      message: "",
    });
  }

  function addTask(columnName: columnNames, task: Card) {
    const tempTask = Object.assign(task);
    delete tempTask.id;
    board.value[columnName].set(generateUID(), tempTask);
  }

  return {
    removeTask,
    getTodoColumn,
    getInProgressColumn,
    getDoneColumn,
    createTask,
    getBoard,
    saveTask,
    addTask,
    getTask,
  };
});
