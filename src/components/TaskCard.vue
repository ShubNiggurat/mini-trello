<template>
  <div :id="task.id" class="task-card-wrapper" :draggable="true">
    <div class="task-card-wrapper__header">
      <span>{{ task.title || 'Имя не задано' }}</span>
      <span class="task-card-wrapper__header__remove-button" @click="handleRemove">x</span>
    </div>
    <div class="task-card-wrapper__divider"></div>
    <div class="task-card-wrapper__body" @dblclick="handleEditContent">
      <textarea
        v-if="editContent"
        ref="textAreaRef"
        v-model="taskText"
        class="task-card-wrapper__body__textarea"
        resize
        @keydown="handleEnter"
        @blur="saveTask"
      ></textarea>
      <span v-else class="task-card-wrapper__body__text">
        {{ task.message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '@/types'
import { nextTick, ref } from 'vue'

const props = defineProps<{
  task: Card
}>()
const emit = defineEmits(['save', 'remove'])

const editContent = ref<boolean>(false)
const textAreaRef = ref<HTMLTextAreaElement | null>(null)
const taskText = ref<string>()

async function handleEditContent() {
  editContent.value = true
  await nextTick()
  textAreaRef.value?.focus()
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    textAreaRef.value?.blur()
  }
}

function handleRemove() {
  emit('remove', props.task.id)
}

function saveTask() {
  emit('save', { ...props.task, message: taskText.value })
  editContent.value = false
}
</script>

<style scoped>
.task-card-wrapper {
  display: flex;

  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background-color: #aaa;
  border-radius: 6px;

  .task-card-wrapper__header {
    display: inherit;
    justify-content: space-between;
    align-items: center;
    .task-card-wrapper__header__remove-button {
      cursor: pointer;
    }
  }
  .task-card-wrapper__divider {
    border-bottom: 1px #111 solid;
  }
  .task-card-wrapper__body {
    width: 100%;
    height: fit-content;
    min-height: 60px;
    .task-card-wrapper__body__textarea {
      resize: none;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
