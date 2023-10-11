<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { ref } from 'vue'

const store = useCardStore()

let hovered = ref(false)

function dragover(e: DragEvent) {
  if (!e.dataTransfer) {
    return
  }
  if (Array.from(e.dataTransfer.items).every((e) => e.type === 'image/png')) {
    e.preventDefault()
  }
}

function dragenter() {
  hovered.value = true
}

function dragleave() {
  hovered.value = false
}

async function drop(e: DragEvent) {
  hovered.value = false
  if (!e.dataTransfer) {
    return
  }
  uploadFiles(e.dataTransfer.files)
}

async function change(e: Event){
  const element = e.target as HTMLInputElement
  if(element.files !== null){
    uploadFiles(element.files)
  }
}
async function uploadFiles(fileList: FileList){
  const cardUpload = new Array<Promise<File>>()

  const files = Array.from(fileList)
  if (!files.every((e) => e.type === 'image/png')) {
    alert('all files must be png images')
    return
  }

  if (
    !files.every((e) => {
      const name = e.name.slice(0, -4)
      const extension = e.name.slice(-4)
      return extension === '.png' && /^\d+$/.test(name) && name.length === 4
    })
  ) {
    alert('all files must be png images with a name like 0000.png')
    return
  }

  files.forEach((file) => {
    const name = file.name.slice(0, -4)
    const card_id = Number(name)
    let rarity = Number(name[0])
    if(rarity === 0){
      rarity = 1
    }
    if (isNaN(card_id)) {
      alert('error file with name ' + file.name)
      return
    }
    const existing = Object.values(store.cards).find(e=>e.name === name)
    if(!existing){
      cardUpload.push(store.createCard(name, rarity).then(()=>file))
    }else{
      cardUpload.push((async ()=>file)())
    }
  })

  const images = await Promise.all(cardUpload)
  await Promise.allSettled(images.map(img=>store.uploadImage(img, img.name.slice(0, -4))))
  store.fetchCards()
  
}
</script>

<template>
  <input ref="input" type="file" multiple="true" accept=".png" hidden="true" @change="change">
    <div
      class="cardUpload"
      @dragenter="dragenter"
      @dragleave="dragleave"
      @drop.prevent="drop"
      @dragover="dragover"
      @click="($refs.input as HTMLInputElement).click()"
    >
      <span class="uploadIcon">📤</span>
      <span class="uploadText">Upload a card</span>
    </div>
</template>

<style scoped>


.cardUpload {
  font-size: 100%;
  /* padding: 0 auto; */
  width: 144px;
  height: 230.733px;
  cursor:pointer;
  border: 1px dotted white;
  border-radius: 5%;
}
.uploadIcon{
  font-size: 100px;
}
.uploadText{
  font-size: 25px;
  text-align: center;
  width:100%;
  display:inline-block;
}
</style>
