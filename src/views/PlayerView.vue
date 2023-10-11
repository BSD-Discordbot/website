<script setup lang="ts">
import { useCardStore } from '@/stores/cards';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import { useRouter } from 'vue-router';



const router = useRouter()
const store = useCardStore()
const userStore = useUserStore()

</script>

<template>
  <main>
    <img >
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
</style>
