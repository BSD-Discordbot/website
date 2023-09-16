<script setup lang="ts">
import { useCardStore } from '@/stores/cards'

const store = useCardStore()
let newTagName: string

store.fetchTags()
function createTag() {
  store.createTag(newTagName)
  store.fetchTags()
}

function deleteTag(value: number) {
  store.deleteTag(value)
}

</script>

<template>
  <main>
    <input v-model="newTagName" />
    <span></span>
    <button @click="createTag">+</button>

    <div class="tags" v-for="(tag, id) in store.tags" :key="id">
      <span>{{ id }}</span>
      <span>{{
        Object.values(store.cards).reduce((acc, card) => card.tags.includes(Number(id)) ? acc + 1: acc, 0)
      }}</span>
      <button @click="deleteTag(id)">X</button>
    </div>
  </main>
</template>

<style scoped>
main {
  /* display: flex; */
  display: grid;
  grid-template-columns: min-content min-content min-content;
  justify-content: center;
}
.tags {
  display: grid;
  grid-column: 1 / span 3;
  grid-template-columns: subgrid;
}
</style>
