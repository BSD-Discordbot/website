<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import CardUploader from '@/components/CardUploader.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { Card, useCardStore } from '@/stores/cards'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const store = useCardStore()
const userStore = useUserStore()

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

  if(events.value.length !== 0){
    value = Object.fromEntries(
    Object.entries(value).filter(([, card]) =>
    events.value.every((event) => card.events.includes(event))
    ))
  }  
  return Object.keys(value).sort().map(e=>value[e])
})

const cardsByRarity = computed<Array<Array<Card>>>(()=>{
  const returnValue: Array<Array<Card>> = []
  cards.value.forEach(c=>{
    if(returnValue[c.rarity] === undefined){
      returnValue[c.rarity] = []
    }
    returnValue[c.rarity].push(c)
  })
  return returnValue
})
</script>

<template>
  <main>
    <div id="filters">
      <TagMultiselect v-if="userStore.adminMode" v-model="tags"></TagMultiselect>
      <EventMultiselect v-model="events" ></EventMultiselect>
    </div>
    
    <CardUploader v-if="userStore.adminMode"></CardUploader>
    <div v-for="(rarityCards, rarity) in cardsByRarity" :key="rarity" class="rarity">
      <span class="rarityHeader">{{ '★'.repeat(rarity) }}</span>
      <CardItem v-for="(card, id) in rarityCards" :id="card.name" :key="id"> </CardItem>
    </div>
    
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
.rarity{
  display:flex;
  flex-wrap: wrap;
  justify-content: center;
}

.rarityHeader{
  font-size: 500%;
  width:100%;
  text-align: center;
}

</style>
