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

function dragenter(e: DragEvent) {
  hovered.value = true
}

function dragleave(e: DragEvent) {
  hovered.value = false
}

const promises = new Array<Promise<Response>>()

async function drop(e: DragEvent) {
  hovered.value = false
  if (!e.dataTransfer) {
    return
  }
  const files = Array.from(e.dataTransfer.files)
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
    promises.push(store.uploadImage(file, card_id))
    promises.push(store.createCard(card_id, rarity))
  })

  Promise.allSettled(promises).then(() => {
    store.fetchCards()
  })
}
</script>

<template>
    <div
      class="cardUpload"
      @dragenter="dragenter"
      @dragleave="dragleave"
      @drop.prevent="drop"
      @dragover="dragover"
    >
      <span class="uploadIcon">📤</span>
    </div>
</template>

<style scoped>


.cardUpload {
  font-size: 100%;
  /* padding: 0 auto; */
  width: 144px;
  height: 230.733px;
}
.uploadIcon{
  font-size: 100px;
}
</style>
