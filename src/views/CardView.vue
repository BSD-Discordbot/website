<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { useCardStore, type Card } from '@/stores/cards'
import { ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useCardStore()
const card = ref<Card>()
const cardId = ref<number>()

const events = ref<Array<number>>([])

function loadCard(id: number) {
  if (!isNaN(id)) {
    cardId.value = id
    card.value = store.cards[id]
    events.value = Object.entries(store.events).filter(([, value]) => value.cards.includes(id)).map(e=>Number(e[0]))
  }
}

watchEffect(()=>{
  loadCard(Number(route.params.id))
})


async function setTags(newTags: Array<number>) {
  if (card.value !== undefined && newTags !== undefined && cardId.value !== undefined) {
    store.assignTags(cardId.value, newTags)
  }
}

function setEvents(newEvents: Array<number> | undefined){
  if (card.value !== undefined && newEvents !== undefined && cardId.value !== undefined) {
    store.assignEvents(cardId.value, newEvents)
  }
}

function isLastCard(id: number){
  return (Object.keys(store.cards).indexOf(id.toString()) === Object.keys(store.cards).length - 1)
}

function isFirstCard(id: number){
  return (Object.keys(store.cards).indexOf(id.toString()) === 0)
}

function nextCard(){
  if(cardId.value === undefined || isLastCard(cardId.value)){
    return
  }

  const currentCardIndex = Object.keys(store.cards).indexOf(cardId.value.toString())

  router.push('/card/'+Object.keys(store.cards)[currentCardIndex+1])

}

function previousCard(){
  if(cardId.value === undefined || isFirstCard(cardId.value)){
    return
  }
  const currentCardIndex = Object.keys(store.cards).indexOf(cardId.value.toString())

  router.push('/card/'+Object.keys(store.cards)[currentCardIndex-1])
}
</script>

<template>
  <main id="card-view">
    <div id="filters">
      <TagMultiselect :value="card?.tags" @change="setTags"></TagMultiselect>
      <EventMultiselect v-model="events" @update:model-value="setEvents"></EventMultiselect>
    </div>
    
    <div id="controls">
      <button
        :disabled="cardId === undefined || isFirstCard(cardId)"
        @click="previousCard"
        >&#8592;</button>
      <button
        :disabled="cardId === undefined || isLastCard(cardId)"
        @click="nextCard"
        >&#8594;</button>
    </div>
    <CardItem v-if="card !== undefined && cardId !== undefined" :id="cardId" :card="card">
    </CardItem>
  </main>
</template>

<style scoped>
main {
  display: grid;
  width: 100%;
}

#controls {
  display: flex;
  justify-content: space-between;
}


#filters{
  display:flex;
}
</style>
