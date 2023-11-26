<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import { Card, useCardStore } from '@/stores/cards'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue';

const store = useCardStore()
const userStore = useUserStore()

interface OwnedCard extends Card {
  amount: number
}

const cards = computed<Array<OwnedCard>>(() => {
  const playerCards = userStore.player?.card_ownership
  if (playerCards === undefined) return []
  const inventory = playerCards.filter(c => (c.card_name in store.cards))
    .map(c => Object.assign(store.cards[c.card_name], { amount: c.amount }) as OwnedCard)
    .sort((a,b)=>{
      if(a.name > b.name) return 1
      if(b.name > a.name) return -1
      return 0
    })
  return inventory
})
</script>

<template>
  <main>
    <div v-for="card in cards" :key="card.name" class="cardContainer">
      <CardItem :name="card.name" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.cardContainer {
  /* height: 100%; */
  width: 144px;
  margin: 20px;
  object-fit: contain;
}
</style>
