<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import UpgradeSelector from '@/components/UpgradeSelector.vue';
const store = useCardStore()

</script>

<template>
  <main>
    <UpgradeSelector></UpgradeSelector>
    <UpgradeSelector v-for="(upgrade, card) in store.upgrades" :key="card" :value="Number(card)"></UpgradeSelector>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
