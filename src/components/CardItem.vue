<script setup lang="ts">
import type { Card } from '@/stores/cards'
import { useCardStore } from '@/stores/cards'
import { computed, ref, watch } from 'vue'

const store = useCardStore()

const props = defineProps<{
  card: Card
}>()

const imgURL = ref('')

let hovered = ref(false)

if (props.card) {
  imgURL.value = `${store.apiPath}/cards/images/${props.card.card_id.toString().padStart(4, '0')}`
}

watch(
  () => props.card,
  async (newCard, oldCard) => {
    imgURL.value = `${store.apiPath}/cards/images/${newCard.card_id.toString().padStart(4, '0')}`
  }
)

function dragover(e: DragEvent) {
  if (e.dataTransfer?.items[0].type === 'image/png') {
    e.preventDefault()
  }
}

function dragenter(e: DragEvent) {
  hovered.value = true
}

function dragleave(e: DragEvent) {
  hovered.value = false
}

async function drop(e: DragEvent) {
  hovered.value = false
  if (!e.dataTransfer) {
    return
  }
  const file = e.dataTransfer.files[0]
  if (!file) return
  imgURL.value = URL.createObjectURL(file)
  store.uploadImage(file, props.card.card_id)
}
</script>

<template>
  <div
    class="card"
    @dragenter.stop="dragenter"
    @dragleave.stop="dragleave"
    @drop.prevent="drop"
    @dragover="dragover"
  >
    <img :src="imgURL" />
    <div :class="`cardOverlay ${hovered ? 'hovered' : ''}`">⟳</div>
    <h1 class="cardRarity">{{ card.card_id.toString().padStart(4, '0') }}</h1>
  </div>
</template>

<style scoped>
.card {
  position: relative;
}

.card * {
  pointer-events: none;
}
.card .cardRarity {
  position: absolute;
  top: 0;
}
.card img {
  height: 30em;
  object-fit: contain;
}

.cardOverlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: none;
}

.hovered {
  background-color: black;
  display: block;
  outline-offset: -2em;
  outline: 0.25em dotted white;
}
</style>
