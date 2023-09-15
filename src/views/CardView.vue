<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import TagMultiselect from '@/components/TagMultiselect.vue';
import { useCardStore, type Card, type Tag } from '@/stores/cards'
import { ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const store = useCardStore()
const card = ref<Card>()

const tags = ref<Array<Tag>>()
watch(
  () => route.params.id,
  (id) => {
    loadCard(Number(id))
  }
)

function loadCard(id: number) {
  if (!isNaN(id)) {
    card.value = store.cards.find(c => c.id === id)
    if(card.value !== undefined){
      tags.value = card.value.tags.map<Tag | undefined>(cardTag=>store.tags.find(tag => tag.id == cardTag)).filter<Tag>((e) : e is Tag => {return e !== undefined})
      console.log(tags.value)
    }
  }
}

watchEffect(()=>{
  loadCard(Number(route.params.id))
})

async function setTags(newTags: Array<Tag>){
  if(card.value && newTags !== undefined){
    console.log(newTags)
    store.assignTags(card.value.id, newTags.map(e=>e.id))
  }
}

</script>

<template>
  <main>
    <TagMultiselect @change="setTags" :value="tags"></TagMultiselect>
    <CardItem v-if="card !== undefined" :card="card">
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
