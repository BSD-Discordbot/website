<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const store = useCardStore()
const userStore = useUserStore()

const card = computed(()=>{
  if(Array.isArray(route.params.id)){
    return undefined
  }
  return store.cards[route.params.id]
})

const sortedNames = computed(()=>{
  return Object.keys(store.cards).sort()
})

function isLastCard(id: string) {
  return sortedNames.value.indexOf(id) === Object.keys(store.cards).length - 1
}

function isFirstCard(id: string) {
  return sortedNames.value.indexOf(id) === 0
}

function nextCard() {
  if (card.value === undefined || isLastCard(card.value.name)) {
    return
  }

  const currentCardIndex = sortedNames.value.indexOf(card.value.name)

  router.push('/card/' + sortedNames.value[currentCardIndex + 1])
}

function previousCard() {
  if (card.value === undefined || isFirstCard(card.value.name)) {
    return
  }
  const currentCardIndex = sortedNames.value.indexOf(card.value.name)

  router.push('/card/' + sortedNames.value[currentCardIndex - 1])
}
</script>

<template>
  <main>
    <div id="filters">
      <TagMultiselect v-if="card && userStore.adminMode" v-model="card.tags" />
      <EventMultiselect v-if="card && userStore.adminMode" v-model="card.events" />
    </div>

    <div id="controls">
      <button :disabled="card === undefined || isFirstCard(card.name)" @click="previousCard">
        &#8592;
      </button>
      <button :disabled="card === undefined || isLastCard(card?.name)" @click="nextCard">
        &#8594;
      </button>
    </div>
    <div class="card">
      <CardItem v-if="card !== undefined && card !== undefined" :name="card.name" :card="card" />
    </div>
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
.card{
  width:288px;
  margin:auto;
}
</style>
