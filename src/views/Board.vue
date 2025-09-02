<template>
  <div class="board-wrapper">
    <input v-model="filterCards" />
    <div
      class="board-wrapper__body"
      @dragstart="handleDragStart"
      @dragover="handleDragOver"
      @dragend="handleDragEnd"
    >
      <Column
        v-for="column in filteredBoard"
        :key="getColumnName(column)"
        :tasks="getTasks(column)"
        :column-name="getColumnName(column)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskBoardStore } from "@/stores";
import Column from "../components/Column.vue";
import type { Card } from "@/types";
import { columnNames } from "@/enums";
import { computed, ref } from "vue";

const store = useTaskBoardStore();

const filterCards = ref<string>();
const dragTaskId = ref<string>();
const dragColumnName = ref<string>();
const dragColumnOver = ref<string>();
const startDrag = ref<boolean>(false);

const filteredBoard = computed((): Array<Record<string, Card[]>> => {
  if (!filterCards.value) {
    return store.getBoard;
  }
  return [
    { [columnNames.TODO]: filterColumn(store.getTodoColumn) },
    { [columnNames.IN_PROGRESS]: filterColumn(store.getInProgressColumn) },
    { [columnNames.DONE]: filterColumn(store.getDoneColumn) },
  ];
});

function filterColumn(tasks: Card[]): Card[] {
  return tasks.filter((task: Card) => {
    return task.title
      .toLowerCase()
      .includes((filterCards.value || "").toLowerCase());
  });
}

function handleDragStart(event: DragEvent) {
  dragTaskId.value = event.target?.id;
  if (dragTaskId.value) {
    startDrag.value = true;
  }
}

function handleDragOver(event: DragEvent) {
  if (!startDrag.value) {
    return;
  }
  const columnIds = Object.values(columnNames);
  dragColumnOver.value = columnIds.find((id: string) =>
    event.target?.closest(`#${id}`)
  );
  if (!dragColumnName.value) {
    dragColumnName.value = dragColumnOver.value;
  }
}

function handleDragEnd() {
  if (!startDrag.value) {
    return;
  }
  if (dragColumnOver.value) {
    const tempTask = {
      ...store.getTask(dragColumnName.value as columnNames, dragTaskId.value!),
    };
    store.removeTask(dragTaskId.value!, dragColumnName.value as columnNames);
    store.addTask(
      dragColumnOver.value as columnNames,
      { ...tempTask, id: dragTaskId.value } as Card
    );
    dragTaskId.value = undefined;
    dragColumnOver.value = undefined;
    dragColumnName.value = undefined;
    startDrag.value = false;
  }
}

function getTasks(column: Record<string, Card[]>) {
  return column[getColumnName(column)];
}
function getColumnName(column: Record<string, Card[]>) {
  return Object.keys(column)[0] as columnNames;
}
</script>

<style scoped>
.board-wrapper {
  width: 100%;
  height: 87vh;
  display: flex;
  flex-direction: column;
  gap: 8px;

  input {
    width: 100%;
  }
  .board-wrapper__body {
    display: flex;
    height: 100%;
    width: 100%;
    gap: 8px;
  }
}
</style>
