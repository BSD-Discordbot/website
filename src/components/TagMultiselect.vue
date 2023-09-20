<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'

import Multiselect from 'vue-multiselect'
const store = useCardStore()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Array<number> | undefined): void
}>()

const props = defineProps({
  modelValue: {
    type: Array<number>,
    required: false,
    default: []
  }
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

async function createTag(tag: string){
  const tagId = await store.createTag(tag)
  value.value.push(tagId)
}
</script>

<template>
  <Multiselect
    v-model="value"
    :options="Object.keys(store.tags).map(e=>Number(e))"
    :multiple="true"
    :custom-label="(tag: number) => store.tags[tag].name"
    :taggable="true"
    placeholder="Select Tags"
    @tag="createTag"
  ></Multiselect>
</template>

<style scoped></style>
