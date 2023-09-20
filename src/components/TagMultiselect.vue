<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { ref, watchEffect } from 'vue'

import Multiselect from 'vue-multiselect'
const store = useCardStore()

const emit = defineEmits<{
  (event: 'change', value: Array<number>): void
}>()

const props = defineProps({
  value: {
    type: Array<number>,
    required: false,
    default: undefined
  }
})

let model = ref<Array<number>>([])


watchEffect(() => {
  model.value = props.value ?? []
})

async function createTag(tag: string){
  const tagId = await store.createTag(tag)
  model.value.push(tagId)
  console.log(tagId)
  emit("change", model.value)
}
</script>

<template>
  <Multiselect
    v-model="model"
    :options="Object.keys(store.tags).map(e=>Number(e))"
    :multiple="true"
    :custom-label="(tag: number) => store.tags[tag].name"
    :taggable="true"
    placeholder="Select Tags"
    @update:model-value="$emit('change', model)"
    @tag="createTag"
  ></Multiselect>
</template>

<style scoped></style>
