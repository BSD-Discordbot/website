<script setup lang="ts">
import { useCardStore, Card } from '@/stores/cards'
import UpgradeSelector from '@/components/UpgradeSelector.vue';
import { computed } from 'vue';
const store = useCardStore()

const cardUpgrades = computed<Array<Card>>(()=>{
  return Object.values(store.cards).filter(c => c.upgrades.length > 0)
})
</script>

<template>
  <main>
    <UpgradeSelector></UpgradeSelector>
    <UpgradeSelector v-for="(card) in cardUpgrades" :key="card.name" :value="card.name"></UpgradeSelector>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
