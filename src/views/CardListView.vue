<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import CardUploader from '@/components/CardUploader.vue';
import TagMultiselect from '@/components/TagMultiselect.vue';
import { useCardStore, type Card, type Tag } from '@/stores/cards'
import { ref, unref, watch, watchEffect } from 'vue';

const store = useCardStore()

const cards = ref<Array<Card>>(store.cards)
const filter = ref<Array<Tag>>([])

function setFilter(value: Array<Tag>){
  filter.value = value
  const tags = value.map(e=>e.id)
  if(value.length === 0 ){
    cards.value = store.cards
    return
  }
  cards.value = store.cards.filter(c=>tags.every(tag=>c.tags.includes(tag)))
}

watchEffect(()=>{
  setFilter(filter.value)
})

</script>

<template>
  <main>
    <TagMultiselect @change="setFilter"></TagMultiselect>
    <CardUploader></CardUploader>
    <CardItem v-for="card in cards" :key="card.id" :card="card">
    </CardItem>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
