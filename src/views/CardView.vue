<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import { useCardStore, type Card } from '@/stores/cards'
import { ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useCardStore()
const card = ref<Card>()
const cardId = ref<number>()

const tags = ref<Array<number>>([])
watch(
  () => route.params.id,
  (id) => {
    loadCard(Number(id))
  }
)

function loadCard(id: number) {
  if (!isNaN(id)) {
    cardId.value = id
    card.value = store.cards[id]
    if (card.value !== undefined) {
      tags.value = card.value.tags
    }
  }

}

watchEffect(() => {
  loadCard(Number(route.params.id))
})

async function setTags(newTags: Array<number>) {
  if (card.value !== undefined && newTags !== undefined && cardId.value !== undefined) {
    store.assignTags(cardId.value, newTags)
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
  <main>
    <TagMultiselect @change="setTags" :value="tags"></TagMultiselect>
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
    <CardItem v-if="card !== undefined && cardId !== undefined" :card="card" :id="cardId">
    </CardItem>
  </main>
</template>

<style scoped>
main {
  display: grid;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

#controls {
  display: flex;
  justify-content: space-between;
}</style>
