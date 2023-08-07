import { ref, computed } from 'vue'
import { defineStore } from 'pinia'



export type Card = {
  card_id:number;
  rarity:number;
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

  return { apiPath, cards, fetchCards }
})
