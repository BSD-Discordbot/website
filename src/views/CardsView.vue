<script setup lang="ts">
import { computed } from 'vue'
import CardRarities from '../components/CardRarities.vue'
import { useCardStore, type Card } from '@/stores/cards'

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

  store.cards.forEach((card) => {
    rarities[card.rarity].push(card)
  })

  return rarities
})
</script>

<template>
  <main>
    <CardRarities
      v-for="(cardArray, stars) in cardsByRarity"
      :key="stars"
      :cardArray="cardArray"
      :rarity="Number(stars)"
    ></CardRarities>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}

.rarities {
  display: flex;
}

.cardUpload {
  width: 288px;
  font-size: 200px;
  padding: 0 auto;
}
</style>
