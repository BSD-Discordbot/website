<script setup lang="ts">
import type { Card } from '@/stores/cards';
import { useCardStore } from '@/stores/cards';
import { computed, ref, watch } from 'vue';

const store = useCardStore()

const props = defineProps<{
  card: Card
}>()

const imgURL = ref('')

if(props.card){
  imgURL.value = `${store.apiPath}/cards/images/${props.card.card_id}`
}

watch(()=>props.card, async (newCard, oldCard)=>{
  imgURL.value = `${store.apiPath}/cards/images/${newCard.card_id}`
})

function dragover(e:DragEvent){
  if(e.dataTransfer?.items[0].type === "image/png"){
    e.preventDefault()
  }
}

function dragenter(e:DragEvent){

}

function dragleave(e:DragEvent){

}

async function drop(e:DragEvent){
  const file = e.dataTransfer?.files[0]
  if(!file) return
  imgURL.value = URL.createObjectURL(file);
}
</script>

<template>
  <div class="card" @dragenter="dragenter" @dragleave="dragleave" @drop.prevent="drop" @dragover="dragover">
    <h1 class="cardRarity">{{ card.card_id }}</h1>
    <img :src="imgURL" />
  </div>
</template>

<style scoped>
.card {
  position:relative;
}

.card .cardRarity{
  position: absolute;
  top:0;
}
.card img {
  height:30em;
  object-fit: contain;
}
</style>
