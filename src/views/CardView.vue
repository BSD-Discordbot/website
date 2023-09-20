<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { useCardStore, type Card } from '@/stores/cards'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useCardStore()

const cardId = computed(()=>{
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    return id
  }
  return undefined
})

const card = computed<Card | undefined>(() => {
  if (cardId.value !== undefined) {
    return store.cards[cardId.value]
  }
  return undefined
})

const tags = computed<number[]>({
  get() {
    return card.value?.tags ?? []
  },
  set(value) {
    const id = cardId.value
    if (value !== undefined && id !== undefined) {
      store.assignTags(id, value)
    }
  }
})

const events = computed<number[]>({
  get() {
    const id = cardId.value
    if(id !== undefined){
      return Object.entries(store.events)
      .filter(([, value]) => value.cards.includes(id))
      .map((e) => Number(e[0]))
    }
    return []
  },
  set(value) {
    const id = cardId.value
    if (value !== undefined && id !== undefined) {
      store.assignEvents(id, value)
    }
  }
})

function isLastCard(id: number) {
  return Object.keys(store.cards).indexOf(id.toString()) === Object.keys(store.cards).length - 1
}

function isFirstCard(id: number) {
  return Object.keys(store.cards).indexOf(id.toString()) === 0
}

function nextCard() {
  if (cardId.value === undefined || isLastCard(cardId.value)) {
    return
  }

  const currentCardIndex = Object.keys(store.cards).indexOf(cardId.value.toString())

  router.push('/card/' + Object.keys(store.cards)[currentCardIndex + 1])
}

function previousCard() {
  if (cardId.value === undefined || isFirstCard(cardId.value)) {
    return
  }
  const currentCardIndex = Object.keys(store.cards).indexOf(cardId.value.toString())

  router.push('/card/' + Object.keys(store.cards)[currentCardIndex - 1])
}
</script>

<template>
  <main id="card-view">
    <div id="filters">
      <TagMultiselect v-model="tags"></TagMultiselect>
      <EventMultiselect v-model="events"></EventMultiselect>
    </div>

    <div id="controls">
      <button :disabled="cardId === undefined || isFirstCard(cardId)" @click="previousCard">
        &#8592;
      </button>
      <button :disabled="cardId === undefined || isLastCard(cardId)" @click="nextCard">
        &#8594;
      </button>
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

#filters {
  display: flex;
}
</style>
