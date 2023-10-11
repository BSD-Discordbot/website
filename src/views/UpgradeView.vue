<script setup lang="ts">
import { useCardStore, type Card } from '@/stores/cards'
import UpgradeSelector from '@/components/UpgradeSelector.vue';
import UpgradeItem from '@/components/UpgradeItem.vue';
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
const store = useCardStore()
const userStore = useUserStore()
const cardUpgrades = computed<Array<Card>>(()=>{
  return Object.values(store.cards).filter(c => c.upgrades.length > 0)
})
</script>

<template>
  <main v-if="userStore.adminMode">
    <UpgradeSelector></UpgradeSelector>
    <UpgradeSelector v-for="(card) in cardUpgrades" :key="card.name" :value="card.name"></UpgradeSelector>
  </main>
  <main v-if="!userStore.adminMode">
    <UpgradeItem v-for="(card) in cardUpgrades" :key="card.name" :value="card.name"></UpgradeItem>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
