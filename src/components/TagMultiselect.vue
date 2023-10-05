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
  },
  disabled:{
    type: Boolean,
    required: false,
    default: false
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
  value.value.push(tagId.id)
}
</script>

<template>
  <Multiselect
    v-model="value"
    :disabled="disabled"
    :options="Object.values(store.tags).map(e=>e.id)"
    :multiple="true"
    :custom-label="(e: number) => store.tags[e].name"
    :taggable="true"
    placeholder="Select Tags"
    @tag="createTag"
  ></Multiselect>
</template>

<style scoped></style>
