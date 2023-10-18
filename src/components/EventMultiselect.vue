<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'

import Multiselect from 'vue-multiselect'
const store = useCardStore()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number[] | undefined): void
}>()

const props = defineProps({
  modelValue: {
    type: Array<number>,
    required: false,
    default: undefined
  },
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

</script>

<template>
  <Multiselect
    v-model="value"
    :options="Object.keys(store.events).map((e) => Number(e))"
    :custom-label="(event: number) => store.events[event].name"
    placeholder="Select Events" 
    :multiple="true"
    />
</template>

<style scoped>
.option__image{
  max-height: 100px;
}
</style>
