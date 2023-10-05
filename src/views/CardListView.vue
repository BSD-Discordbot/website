<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import CardUploader from '@/components/CardUploader.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { Card, useCardStore } from '@/stores/cards'
import { ref, type Ref, computed } from 'vue'

const store = useCardStore()

// let cards = ref<typeof store.cards>(store.cards)
const tags = ref<number[]>([])
const events = ref<number[]>([])

const cards = computed<Array<Card>>(() => {
  let value = store.cards
  if (tags.value.length !== 0) {
    value = Object.fromEntries(
    Object.entries(value).filter(([, card]) =>
    tags.value.every((tag) => card.tags.includes(tag))
    ))
  }

  // if(((e): e is Ref<number[]> => e.value !== undefined && e.value !== null)(events)){
  //   value = Object.fromEntries(
  //   Object.entries(value).filter(([id]) =>
  //   events.value.every(event => store.events[event].cards.includes(Number(id)))))
  // }  
  return Object.keys(value).sort().map(e=>value[e])
})
</script>

<template>
  <main>
    <div id="filters">
      <TagMultiselect v-model="tags"></TagMultiselect>
      <!-- <EventMultiselect v-model="events" ></EventMultiselect> -->
    </div>
    
    <CardUploader></CardUploader>
    <CardItem v-for="(card, id) in cards" :id="card.name" :key="id" :card="card"> </CardItem>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
#filters{
  width:100%;
  display:flex;
}

</style>
