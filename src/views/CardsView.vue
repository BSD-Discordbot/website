<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import CardUploader from '@/components/CardUploader.vue';
import TagMultiselect from '@/components/TagMultiselect.vue';
import { useCardStore, type Card, type Tag } from '@/stores/cards'
import { ref, watchEffect } from 'vue';

const store = useCardStore()
store.fetchCards()
store.fetchTags()

let cards = ref<Array<Card>>(store.cards)

function setFilter(value: Array<Tag>){
  const tags = value.map(e=>e.id)
  if(value.length === 0 ){
    cards.value = store.cards
    return
  }
  console.log(tags)
  console.log(store.cards.filter(c=>c.tags.length > 0))
  cards.value = store.cards.filter(c=>tags.every(tag=>c.tags.includes(tag)))
}

watchEffect(()=>{
  
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
