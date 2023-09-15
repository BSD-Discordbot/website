import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Card = {
  id: number
  rarity: number
  tags: Array<number>
}

export type Tag = {
  id:number
  name:string
}


export const useCardStore = defineStore('card', () => {
  const cards = ref(new Array<Card>())
  const tags = ref(new Array<Tag>())
  const apiPath = 'http://127.0.0.1:8080'
  // const doubleCount = computed(() => count.value * 2)
  async function fetchCards() {
    const data = await fetch(apiPath + '/cards')
    const json = await data.json()
    cards.value = json
  }

  async function uploadImage(file: File, card_id: number) {
    const formData = new FormData()
    const urlID = card_id.toString().padStart(4, '0')
    formData.append('image', file)
    return await fetch(`${apiPath}/cards/images/${urlID}`, {
      method: 'PUT',
      body: formData
    })
  }

  async function createCard(card_id: number, rarity: number) {
    return await fetch(`${apiPath}/cards/${card_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rarity })
    })
  }

  async function assignTags(card_id: number, tags:Array<number>){
    await fetch(`${apiPath}/cards/${card_id}/tags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( tags )
    })
    const card = cards.value.find(c => c.id === card_id)
    console.log(card)
    if(card !== undefined){
      card.tags = tags
      console.log(card.tags)
    }
  }

  async function fetchTags(){
    const data = await fetch(apiPath + '/tags')
    const json = await data.json()
    tags.value = json
  }

  async function createTag(name: string) {
    const req = await fetch(`${apiPath}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    const result: Tag = await req.json()
    if(req.ok){
      tags.value.push(result)
    }
  }

  async function deleteTag(id: number){
    const req = await fetch(`${apiPath}/tags/${id}`, {
      method: 'DELETE'
    })
    if(req.ok){
      const index = tags.value.findIndex(tag=>tag.id === id)
      tags.value.splice(index, 1)
    }
  }

  return { apiPath, cards, tags, fetchCards, uploadImage, createCard, fetchTags, createTag, deleteTag, assignTags }
})
