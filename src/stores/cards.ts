import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type Card = {
  card_id: number
  rarity: number
}

export const useCardStore = defineStore('card', () => {
  const cards = ref(new Array<Card>())
  const apiPath = 'http://192.168.2.104:8080'
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

  return { apiPath, cards, fetchCards, uploadImage, createCard }
})
