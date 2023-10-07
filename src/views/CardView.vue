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

const events = computed<number[]>({
  get() {
    if(card.value !== undefined){
      return card.value._events
    }
    return []
  },
  set(value) {
    const card_name = card.value?.name
    if (value !== undefined && card_name !== undefined) {
      // store.assignEvents(id, value)
    }
  }
})

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
      <EventMultiselect v-if="card" v-model="card.events"></EventMultiselect>
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
