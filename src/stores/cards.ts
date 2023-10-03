import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Card = {
  rarity: number
  tags: Array<number>
}

export type Tag = {
  name: string
}

export type Event = {
  default: boolean
  start_time?: Date
  end_time?: Date
  name: string
  cards: number[]
}

export type Upgrade = Record<number, number>

export const useCardStore = defineStore('card', () => {
  const cards = ref<Record<number, Card>>({})
  const tags = ref<Record<number, Tag>>({})
  const upgrades = ref<Record<number, Upgrade>>({})
  const events = ref<Record<number, Event>>({})
  const apiPath = import.meta.env.VITE_API_PATH
  // const doubleCount = computed(() => count.value * 2)

  function getImageURL(card: number) {
    return `${apiPath}/cards/images/${card.toString().padStart(4, '0')}`
  }
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

  async function assignTags(card_id: number, tags: Array<number>) {
    await fetch(`${apiPath}/cards/${card_id}/tags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tags)
    })
    const card = cards.value[card_id]
    if (card !== undefined) {
      card.tags = tags
    }
  }

  async function fetchTags() {
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
    const id: number = await req.json()
    if (req.ok) {
      tags.value[id] = { name }
    }
    return id
  }

  async function deleteTag(id: number) {
    const req = await fetch(`${apiPath}/tags/${id}`, {
      method: 'DELETE'
    })
    if (req.ok) {
      //remove tag
      delete tags.value[id]
      //remove tag from cards
      //Should probably find another way
      fetchCards()
    }
  }

  async function fetchUpgrades() {
    const data = await fetch(apiPath + '/upgrades')
    const json = await data.json()
    upgrades.value = json
  }

  async function createUpgrade(card: number, requirements: Upgrade) {
    const req = await fetch(`${apiPath}/upgrades/${card}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requirements)
    })
    if (req.ok) {
      upgrades.value[card] = requirements
    }
  }

  async function deleteUpgrade(card: number) {
    const req = await fetch(`${apiPath}/upgrades/${card}`, {
      method: 'DELETE'
    })
    if (req.ok) {
      delete upgrades.value[card]
    }
  }

  async function fetchEvents() {
    const data = await fetch(apiPath + '/events')
    const json = await data.json()
    events.value = json
  }

  async function createEvent(
    name: string,
    isdefault: boolean = false,
    start_time?: Date,
    end_time?: Date
  ) {
    const result = await fetch(`${apiPath}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, start_time, end_time, default: isdefault })
    })
    const id = await result.json()
    if (result.ok) {
      events.value[Number(id)] = {
        default: isdefault,
        name,
        start_time,
        end_time,
        cards: []
      }
    }
  }

  async function assignEvents(card_id: number, _events: Array<number>) {
    const result = await fetch(`${apiPath}/cards/${card_id}/events`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_events)
    })
    if (result.ok) {
      Object.keys(events.value).forEach((event_id) => {
        const event = events.value[Number(event_id)]
        event.cards = event.cards.filter((c) => c != card_id)
      })

      _events.forEach((e) => {
        events.value[e].cards.push(card_id)
      })
    }
  }

  async function deleteEvent(id: number) {
    const req = await fetch(`${apiPath}/events/${id}`, {
      method: 'DELETE'
    })
    if (req.ok) {
      //remove tag
      delete events.value[id]
      //remove tag from cards
      //Should probably find another way
      fetchEvents()
    }
  }

  return {
    apiPath,
    cards,
    tags,
    upgrades,
    events,
    getImageURL,
    fetchCards,
    uploadImage,
    createCard,
    fetchTags,
    createTag,
    deleteTag,
    assignTags,
    fetchUpgrades,
    createUpgrade,
    deleteUpgrade,
    fetchEvents,
    createEvent,
    assignEvents,
    deleteEvent
  }
})
