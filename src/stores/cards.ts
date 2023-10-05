import { ref, watch, type Ref, reactive } from 'vue'
import { defineStore } from 'pinia'



export type Tag = {
  id: number
  name: string
}

export type Upgrade = {
  requirement: string
  amount: number
}

export type Event = {
  default: boolean
  start_time?: Date
  end_time?: Date
  name: string
  cards: number[]
}

// export type Upgrade = Record<string, string>

export const useCardStore = defineStore('card', () => {

  const apiPath = import.meta.env.VITE_API_PATH

  class Card {
    readonly id: number
    readonly name: string
    readonly rarity: number
    _tags: Array<number>
    _upgrades: Array<Upgrade>
    constructor({id, rarity=1, tags=[], upgrades=[], name}: {id: Card['id'], rarity: Card['rarity'], tags: Card['tags'], upgrades: Card['upgrades'], name: Card['name']}){
      this.rarity = rarity
      this._tags = tags
      this._upgrades = upgrades
      this.name = name
      this.id = id
    }
    
    public set tags(v : Array<number>) {
      this._tags = v;
      this.update()
    }

    public get tags() : Array<number> {
      return this._tags
    }

    public set upgrades(v : Array<Upgrade>) {
      this._upgrades = v;
      this.update()
    }

    public get upgrades() : Array<Upgrade> {
      return this._upgrades
    }
    
    
    public async update(){
      const response = await fetch(`${apiPath}/cards/${this.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this)
      })
      if(!response.ok){
        this.refetch()
      } 
    }

    public async refetch(){
      const card = await fetch(`${apiPath}/cards/${this.id}`, {
        method: 'GET',
      })
      delete cards.value[this.name]
      if(!card.ok){
        throw new Error(`Couldn't fetch card ${this.name}`)
      }
      cards.value[this.name] = new Card(await card.json())
    }

    public toJSON(){
      return {
        rarity: this.rarity,
        tags: this.tags,
        upgrades: this.upgrades,
        name: this.name,
        id: this.id
      }
    }
  }

  const cards = ref<Record<string, Card>>({})
  const tags = ref<Record<number, Tag>>({})
  // const upgrades = ref<Record<number, Upgrade>>({})
  // const events = ref<Record<number, Event>>({})
  // const doubleCount = computed(() => count.value * 2)

  function getImageURL(card: string) {
    return `${apiPath}/cards/${card}/image`
  }
  async function fetchCards() {
    const data = await fetch(apiPath + '/cards')
    const json = await data.json()
    if(!Array.isArray(json)){
      throw new Error(`Couldn't parse cards at ${apiPath}/cards`)
    }
    const mapping = {} as Record<string, Card>
    json.forEach(c => { 
      mapping[c.name] = new Card(c)
    })

    cards.value = mapping
  }

  async function uploadImage(file: File, card: string) {
    const formData = new FormData()
    const urlID = card
    formData.append('file', file)
    return await fetch(`${apiPath}/cards/${urlID}/images`, {
      method: 'PUT',
      body: formData
    })
  }

  async function createCard(card_id: string, rarity: number) {
    return await fetch(`${apiPath}/cards/${card_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rarity })
    })
  }

  async function fetchTags() {
    const data = await fetch(apiPath + '/tags')
    const json = await data.json()

    const mapping = {} as Record<string, Tag>
    json.forEach((t: Tag) => { 
      mapping[t.id] = t
    })
    tags.value = mapping
  }

  async function createTag(name: string) {
    const req = await fetch(`${apiPath}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    const tag: Tag = await req.json()
    if (req.ok) {
      tags.value[tag.id] = tag
    }
    return tag
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

  // async function fetchUpgrades() {
  //   const data = await fetch(apiPath + '/upgrades')
  //   const json = await data.json()
  //   upgrades.value = json
  // }

  // async function createUpgrade(card: string, requirements: Upgrade) {
  //   const req = await fetch(`${apiPath}/upgrades/${card}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(requirements)
  //   })
  //   if (req.ok) {
  //     upgrades.value[card] = requirements
  //   }
  // }

  // async function deleteUpgrade(card: string) {
  //   const req = await fetch(`${apiPath}/upgrades/${card}`, {
  //     method: 'DELETE'
  //   })
  //   if (req.ok) {
  //     delete upgrades.value[card]
  //   }
  // }

  // async function fetchEvents() {
  //   const data = await fetch(apiPath + '/events')
  //   const json = await data.json()
  //   events.value = json
  // }

  // async function createEvent(
  //   name: string,
  //   isdefault: boolean = false,
  //   start_time?: Date,
  //   end_time?: Date
  // ) {
  //   const result = await fetch(`${apiPath}/events`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ name, start_time, end_time, default: isdefault })
  //   })
  //   const id = await result.json()
  //   if (result.ok) {
  //     events.value[Number(id)] = {
  //       default: isdefault,
  //       name,
  //       start_time,
  //       end_time,
  //       cards: []
  //     }
  //   }
  // }

  // async function assignEvents(card_id: string, _events: Array<number>) {
  //   const result = await fetch(`${apiPath}/cards/${card_id}/events`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(_events)
  //   })
  //   if (result.ok) {
  //     Object.keys(events.value).forEach((event_id) => {
  //       const event = events.value[Number(event_id)]
  //       event.cards = event.cards.filter((c) => c != card_id)
  //     })

  //     _events.forEach((e) => {
  //       events.value[e].cards.push(card_id)
  //     })
  //   }
  // }

  // async function deleteEvent(id: number) {
  //   const req = await fetch(`${apiPath}/events/${id}`, {
  //     method: 'DELETE'
  //   })
  //   if (req.ok) {
  //     //remove tag
  //     delete events.value[id]
  //     //remove tag from cards
  //     //Should probably find another way
  //     fetchEvents()
  //   }
  // }

  return {
    apiPath,
    cards,
    tags,
    // upgrades,
    // events,
    getImageURL,
    fetchCards,
    uploadImage,
    createCard,
    fetchTags,
    createTag,
    deleteTag,
    // assignTags,
    // fetchUpgrades,
    // createUpgrade,
    // deleteUpgrade,
    // fetchEvents,
    // createEvent,
    // assignEvents,
    // deleteEvent
  }
})
