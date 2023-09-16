<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import CardUploader from '@/components/CardUploader.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import { useCardStore } from '@/stores/cards'
import { ref, watchEffect } from 'vue'

const store = useCardStore()

let cards = ref<typeof store.cards>(store.cards)
let filter = ref<number[]>([])

function setFilter(value: Array<number>) {
  filter.value = value
  if (value.length === 0) {
    cards.value = store.cards
    return
  }
  cards.value = Object.fromEntries(
    Object.entries(store.cards).filter(([, card]) =>
      value.every((tag) => card.tags.includes(tag))
    )
  )
}

watchEffect(() => {
  setFilter(filter.value)
})
</script>

<template>
  <main>
    <TagMultiselect @change="setFilter"></TagMultiselect>
    <CardUploader></CardUploader>
    <CardItem v-for="(card, id) in cards" :id="Number(id)" :key="id" :card="card"> </CardItem>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
