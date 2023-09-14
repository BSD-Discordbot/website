<script setup lang="ts">
import { useCardStore, type Tag } from '@/stores/cards'
import { ref } from 'vue';

import Multiselect from 'vue-multiselect';
const store = useCardStore()

defineEmits<{
  (event: 'change', value:Array<Tag>): void
}>()

let value = ref<Array<Tag>>([])

</script>

<template>
  <Multiselect 
  :options="store.tags" 
  v-model="value" 
  :multiple="true" 
  label="name"
  track-by="name"
  @update:modelValue="$emit('change', value)"></Multiselect>
  
</template>

<style scoped>


.cardUpload {
  font-size: 100%;
  /* padding: 0 auto; */
  width: 144px;
  height: 230.733px;
}
.uploadIcon{
  font-size: 100px;
}
</style>
