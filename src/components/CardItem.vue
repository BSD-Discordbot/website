<script setup lang="ts">
import { Card, useCardStore } from '@/stores/cards'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useCardStore()

const props = defineProps<{
  id: string
  card: Card
}>()

const imgURL = ref('')

let hovered = ref(false)
let dragHovered = ref(false)

if (props.card !== undefined) {
  imgURL.value = store.getImageURL(props.id)
}

watch(
  () => props.id,
  async (newId) => {
    imgURL.value = store.getImageURL(newId)
  }
)

function dragover(e: DragEvent) {
  if (e.dataTransfer?.items[0].type === 'image/png') {
    e.preventDefault()
  }
}

function mouseenter() {
  hovered.value = true
}

function mouseleave() {
  hovered.value = false
}

function dragenter() {
  dragHovered.value = true
}

function dragleave() {
  dragHovered.value = false
}

async function drop(e: DragEvent) {
  dragHovered.value = false
  if (!e.dataTransfer) {
    return
  }
  const file = e.dataTransfer.files[0]
  setImage(file)
  store.uploadImage(file, props.id)
}

async function setImage(file: File){
  if (file === undefined) return
  imgURL.value = URL.createObjectURL(file)
}

function click(){
  router.push('/card/'+props.id)
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
    @click="click"
  >
    <img :src="imgURL" />
    <div :class="`cardOverlay ${dragHovered ? 'dragHovered' : ''}`">⟳</div>
    <h1 :class="`cardRarity ${hovered ? 'hovered' : ''}`">{{ '#' + id.toString().padStart(4, '0') }}</h1>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  cursor: pointer;
  display:flex;
  justify-content: center;
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
