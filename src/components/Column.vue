<template>
  <div :id="columnName" class="column-wrapper">
    <div class="column-wrapper__header">
      <h1>{{ columnName }}</h1>
      <div class="column-wrapper__header__create-task-container">
        <input v-model="taskTitle" placeholder="Write task name" />
        <button @click="createTask">Add</button>
      </div>
    </div>
    <div class="column-wrapper__body">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @remove="handleRemove"
        @save="saveTask"
      ></TaskCard>
    </div>
    <div class="column-wrapper__footer"></div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '@/types'
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import { useTaskBoardStore } from '@/stores'
import { columnNames } from '@/enums'

const props = defineProps<{
  tasks: Card[]
  columnName: columnNames
}>()

const store = useTaskBoardStore()

const taskTitle = ref<string>()

function handleRemove(taskId: string) {
  store.removeTask(taskId, props.columnName)
}

function createTask() {
  if (taskTitle.value) {
    store.createTask(props.columnName, taskTitle.value)
    taskTitle.value = undefined
  }
}

function saveTask(taskCard: Card) {
  store.saveTask(taskCard, taskCard.message, props.columnName)
}
</script>

<style scoped>
.column-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  width: 100%;
  padding: 12px;
  background-color: #eee;
  border-radius: 8px;
  .column-wrapper__header {
    display: inherit;
    flex-direction: column;
    gap: 6px;
    .column-wrapper__header__create-task-container {
      display: flex;
      justify-content: space-between;
    }
  }
  .column-wrapper__body {
    display: inherit;
    overflow: auto;
    flex-direction: inherit;
    gap: 8px;
  }
}
</style>
