<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'

import Multiselect from 'vue-multiselect'
const store = useCardStore()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number | undefined): void
}>()

const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
    default:undefined
  },
  disabled: {
    type: Boolean,
    required: false
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

</script>

<template>
  <Multiselect
    v-model="value"
    :disabled="disabled"
    :options="Object.keys(store.cards).map((e) => Number(e))"
    placeholder="Select Card" 
  >
    <template #singleLabel="labelProps">
      <img class="option__image" :src="store.getImageURL(labelProps.option)" />
      <span class="option__desc">
        <span class="option__title">
          {{ labelProps.option }}
        </span>
      </span>
    </template>
    <template #option="optionProp">
      <img class="option__image" :src="store.getImageURL(optionProp.option)" />
      <div class="option__desc">
        <span class="option__title">
          {{ optionProp.option }}
          </span>
      </div>
    </template>
  </Multiselect>
</template>

<style scoped>
.option__image{
  max-height: 100px;
}
</style>
