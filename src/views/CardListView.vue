<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import CardUploader from '@/components/CardUploader.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { useCardStore } from '@/stores/cards'
import { ref, watch, watchEffect, type Ref } from 'vue'

const store = useCardStore()

let cards = ref<typeof store.cards>(store.cards)
let tags = ref<number[]>([])
const events = ref<number[]>([])

watch(events, ()=>{
  filterCards()
})

function filterCards(){

  cards.value = store.cards
  if (tags.value.length !== 0) {
    cards.value = Object.fromEntries(
    Object.entries(cards.value).filter(([, card]) =>
    tags.value.every((tag) => card.tags.includes(tag))
    ))
  }
  if(((e): e is Ref<number[]> => e.value !== undefined && e.value !== null)(events)){
    cards.value = Object.fromEntries(
    Object.entries(cards.value).filter(([id]) =>
    events.value.every(event => store.events[event].cards.includes(Number(id)))))
  }
}

function setTagsFilter(value: Array<number>) {
  tags.value = value
  if (value.length === 0) {
    cards.value = store.cards
    return
  }
  cards.value = Object.fromEntries(
    Object.entries(store.cards).filter(([, card]) =>
      value.every((tag) => card.tags.includes(tag))
    )
  )
}

watchEffect(() => {
  setTagsFilter(tags.value)
})
</script>

<template>
  <main>
    <div id="filters">
      <TagMultiselect @change="setTagsFilter"></TagMultiselect>
      <EventMultiselect v-model="events" ></EventMultiselect>
    </div>
    
    <CardUploader></CardUploader>
    <CardItem v-for="(card, id) in cards" :id="Number(id)" :key="id" :card="card"> </CardItem>
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
