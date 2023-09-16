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
    <form id="createTag">
      <input v-model="newTagName" />
      <span></span>
      <button @click="createTag">+</button>
    </form>
    
    <b>Tag</b>
    <b>Cards</b>

    <div class="tags" v-for="(tag, id) in store.tags" :key="id">
      <span>{{ tag.name }}</span>
      <span>{{
        Object.values(store.cards).reduce((acc, card) => card.tags.includes(Number(id)) ? acc + 1: acc, 0)
      }}</span>
      <button @click="deleteTag(id)">X</button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: min-content min-content min-content;
  justify-content: center;
}
.tags {
  display: grid;
  grid-column: 1 / span 3;
  grid-template-columns: subgrid;
}
#createTag{
  display:grid;
  grid-column: 1 / span 3;
  grid-template-columns: subgrid;
}
</style>
