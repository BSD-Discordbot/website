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
    required: false
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
    :options="Object.keys(store.tags).map(e=>Number(e))"
    v-model="model"
    :multiple="true"
    :custom-label="(tag: number) => store.tags[tag].name"
    @update:modelValue="$emit('change', model)"
    :taggable="true"
    @tag="createTag"
  ></Multiselect>
</template>

<style scoped></style>
