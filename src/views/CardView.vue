<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useCardStore()


const card = computed(()=>{
  if(Array.isArray(route.params.id)){
    return undefined
  }
  return store.cards[route.params.id]
})

// const card = Array.isArray(route.params.id) ? undefined : store.cards[route.params.id]
// console.log(card)

// const events = computed<number[]>({
//   get() {
//     const id = cardId.value
//     if(id !== undefined){
//       return Object.entries(store.events)
//       .filter(([, value]) => value.cards.includes(id))
//       .map((e) => Number(e[0]))
//     }
//     return []
//   },
//   set(value) {
//     const id = cardId.value
//     if (value !== undefined && id !== undefined) {
//       store.assignEvents(id, value)
//     }
//   }
// })

function isLastCard(id: string) {
  return Object.keys(store.cards).indexOf(id) === Object.keys(store.cards).length - 1
}

function isFirstCard(id: string) {
  return Object.keys(store.cards).indexOf(id) === 0
}

function nextCard() {
  if (card.value === undefined || isLastCard(card.value.name)) {
    return
  }

  const currentCardIndex = Object.keys(store.cards).indexOf(card.value.name)

  router.push('/card/' + Object.keys(store.cards)[currentCardIndex + 1])
}

function previousCard() {
  if (card.value === undefined || isFirstCard(card.value.name)) {
    return
  }
  const currentCardIndex = Object.keys(store.cards).indexOf(card.value.name)

  router.push('/card/' + Object.keys(store.cards)[currentCardIndex - 1])
}
</script>

<template>
  <main id="card-view">
    <div id="filters">
      <TagMultiselect v-if="card" v-model="card.tags"></TagMultiselect>
      <!-- <EventMultiselect v-model="events"></EventMultiselect> -->
    </div>

    <div id="controls">
      <button :disabled="card === undefined || isFirstCard(card.name)" @click="previousCard">
        &#8592;
      </button>
      <button :disabled="card === undefined || isLastCard(card?.name)" @click="nextCard">
        &#8594;
      </button>
    </div>
    <CardItem v-if="card !== undefined && card !== undefined" :id="card.name" :card="card">
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

#filters {
  display: flex;
}
</style>
