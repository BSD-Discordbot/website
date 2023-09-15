<script setup lang="ts">
import { useCardStore, type Tag } from '@/stores/cards'

const store = useCardStore()
let newTagName: string

store.fetchTags()
function createTag() {
  store.createTag(newTagName)
  store.fetchTags()
}

function deleteTag(value: number){
  store.deleteTag(value)
}
</script>

<template>
  <main>
      <input v-model="newTagName">
      <button @click="createTag">+</button>

    <div class="tags" v-for="tag in store.tags" :key="tag.id">
      <span>{{ tag.name }}</span>
      <button @click="deleteTag(tag.id)">X</button>
    </div>
  </main>
</template>

<style scoped>
main {
  /* display: flex; */
  display: grid;
  grid-template-columns: min-content min-content;
  justify-content: center;
}
.tags{
  display: grid;
  grid-column: 1 / span 2;
  grid-template-columns: subgrid;
}
</style>
