<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import CardMultiselect from '@/components/CardMultiselect.vue'
import { ref } from 'vue';
const store = useCardStore()

const requirements = ref<Record<number, number>>({})

</script>

<template>
  <main>
    <CardMultiselect></CardMultiselect>
    <div id="createUpgrade">
      <CardMultiselect></CardMultiselect>
      <span id="upgradeEquals">=</span>
    </div>
    <div v-for="(upgrade, card) in store.upgrades" :key="card">
      {{ card }}
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
#createUpgrade {
  display: flex;
  flex-wrap: nowrap;
  border-bottom: 1px solid var(--color-text);
  width: 100%;
  min-height: 145px;
}

#createUpgrade > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

#upgradeEquals {
  width: 50px;
  font-size: 40px;
}
</style>

<style>
#createUpgrade > * {
  max-width: 100px;
}
</style>
