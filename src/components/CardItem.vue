<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { useUserStore } from '@/stores/user';
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useCardStore()
const userStore = useUserStore()

const props = defineProps<{
  name: string
}>()

// eslint-disable-next-line vue/no-setup-props-destructure
const imgURL = computed(()=>{
  return store.images[props.name]
})


let hovered = ref(false)
let dragHovered = ref(false)

function dragover(e: DragEvent) {
  if(!userStore.adminMode) return
  if (e.dataTransfer?.items[0].type === 'image/png') {
    e.preventDefault()
  }
}

function mouseenter() {
  if(!userStore.adminMode) return
  hovered.value = true
}

function mouseleave() {
  if(!userStore.adminMode) return
  hovered.value = false
}

function dragenter() {
  if(!userStore.adminMode) return
  dragHovered.value = true
}

function dragleave() {
  if(!userStore.adminMode) return
  dragHovered.value = false
}

async function drop(e: DragEvent) {
  if(!userStore.adminMode) return
  dragHovered.value = false
  if (!e.dataTransfer) {
    return
  }
  const file = e.dataTransfer.files[0]
  // setImage(file)
  await store.uploadImage(file, props.name)
}

// async function setImage(file: File){
//   if (file === undefined) return
//   imgURL.value = URL.createObjectURL(file)
// }

function click(){
  router.push('/card/'+props.name)
}
</script>

<template>
  <div
    :class="'card ' + (userStore.player?.card_ownership.find(c=>c.card_name == name) ? 'owned' : '')"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    @dragenter.stop="dragenter"
    @dragleave.stop="dragleave"
    @drop.prevent="drop"
    @dragover="dragover"
    @click="click"
  >
    <img :src="imgURL"/>
    <div :class="`cardOverlay ${dragHovered ? 'dragHovered' : ''}`">⟳</div>
    <h1 :class="`cardRarity ${hovered ? 'hovered' : ''}`">{{ '#' + name.padStart(4, '0') }}</h1>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  width: 100%;
  cursor: pointer;
  display:flex;
  justify-content: center;
  filter: grayscale(100%);
}

.owned {
  filter:unset;
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
  width: 100%;
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
