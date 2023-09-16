<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { ref, watchEffect } from 'vue'

import Multiselect from 'vue-multiselect'
const store = useCardStore()

defineEmits<{
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
</script>

<template>
  <Multiselect
    :options="Object.keys(store.cards).map((e) => Number(e))"
    v-model="model"
    :multiple="false"
    @update:modelValue="$emit('change', model)"
  >
    <template v-slot:singleLabel="props">
      <img class="option__image" :src="store.getImageURL(props.option)" />
      <span class="option__desc">
        <span class="option__title">
          {{ props.option }}
        </span>
      </span>
    </template>
    <template v-slot:option="props">
      <img class="option__image" :src="store.getImageURL(props.option)" />
      <div class="option__desc">
        <span class="option__title">
          {{ props.option }}
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
