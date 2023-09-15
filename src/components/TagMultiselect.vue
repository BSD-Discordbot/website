<script setup lang="ts">
import { useCardStore, type Tag } from '@/stores/cards'
import { ref, watch, watchEffect } from 'vue';

import Multiselect from 'vue-multiselect';
const store = useCardStore()

defineEmits<{
  (event: 'change', value: Array<Tag>): void
}>()

const props = defineProps({
  value: {
    type: Array<Tag>,
    required: false
  }
})

let model = ref<Array<Tag>>()

watchEffect(() => {
  model.value = props.value
})



</script>

<template>
  <Multiselect :options="store.tags" v-model="model" :multiple="true" label="name" track-by="name"
    @update:modelValue="$emit('change', model)"></Multiselect>
</template>

<style scoped></style>
