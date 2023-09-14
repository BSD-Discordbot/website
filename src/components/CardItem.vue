<script setup lang="ts">
import type { Card } from '@/stores/cards'
import { useCardStore } from '@/stores/cards'
import { ref, watch } from 'vue'

const store = useCardStore()

const props = defineProps<{
  card: Card
}>()

const imgURL = ref('')

let hovered = ref(false)
let dragHovered = ref(false)

if (props.card) {
  imgURL.value = `${store.apiPath}/cards/images/${props.card.id.toString().padStart(4, '0')}`
}

watch(
  () => props.card,
  async (newCard, oldCard) => {
    imgURL.value = `${store.apiPath}/cards/images/${newCard.id.toString().padStart(4, '0')}`
  }
)

function dragover(e: DragEvent) {
  if (e.dataTransfer?.items[0].type === 'image/png') {
    e.preventDefault()
  }
}

function mouseenter(e: MouseEvent) {
  hovered.value = true
}

function mouseleave(e: MouseEvent) {
  hovered.value = false
}

function dragenter(e: DragEvent) {
  dragHovered.value = true
}

function dragleave(e: DragEvent) {
  dragHovered.value = false
}

async function drop(e: DragEvent) {
  dragHovered.value = false
  if (!e.dataTransfer) {
    return
  }
  const file = e.dataTransfer.files[0]
  if (!file) return
  imgURL.value = URL.createObjectURL(file)
  store.uploadImage(file, props.card.id)
}
</script>

<template>
  <div
    class="card"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    @dragenter.stop="dragenter"
    @dragleave.stop="dragleave"
    @drop.prevent="drop"
    @dragover="dragover"
  >
    <img :src="imgURL" />
    <div :class="`cardOverlay ${dragHovered ? 'dragHovered' : ''}`">⟳</div>
    <h1 :class="`cardRarity ${hovered ? 'hovered' : ''}`">{{ '#' + card.id.toString().padStart(4, '0') }}</h1>
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
  right:0;
}
.card img {
  height: 100%;
  width: 144px;
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

.cardRarity{
  display:none;
}
.dragHovered {
  background-color: black;
  display: block;
  outline-offset: -2em;
  outline: 0.25em dotted white;
}

.hovered {
  display: block;
  -webkit-text-stroke-width: 0.02em;
  -webkit-text-stroke-color: black;
}

</style>
