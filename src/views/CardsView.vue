<script setup lang="ts">
import { computed } from 'vue';
import CardItem from '../components/CardItem.vue'
import { useCardStore, type Card } from '@/stores/cards';

const store = useCardStore()
store.fetchCards()

const cardsByRarity = computed(() => {
  const rarities: Record<number, Array<Card>> = {
    1: new Array<Card>(),
    2: new Array<Card>(),
    3: new Array<Card>(),
    4: new Array<Card>(),
    5: new Array<Card>()
  }

  store.cards.forEach(card=>{
    rarities[card.rarity].push(card)
  })

  return rarities
})

</script>

<template>
  <main>
    <div v-for="(cardArray, stars) in cardsByRarity" :key="stars">
      <CardItem :card="card" v-for="card in cardArray" :key="card.card_id" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: nowrap;
}
</style>