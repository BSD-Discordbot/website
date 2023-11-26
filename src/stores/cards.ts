import { ref, unref, type Ref, triggerRef } from 'vue'
import { defineStore } from 'pinia'

export type Tag = {
  id: number
  name: string
}

export type UpgradeBase = {
  requirement_name: string
  amount: number
}

export class Upgrade implements UpgradeBase {
  _requirement_name: string
  _amount: number
  parentCard: Card
  constructor(
    parentCard: Card,
    {
      requirement_name,
      amount
    }: { requirement_name: Upgrade['_requirement_name']; amount: Upgrade['_amount'] }
  ) {
    this._requirement_name = requirement_name
    this._amount = amount
    this.parentCard = parentCard
  }

  public set requirement_name(v: string) {
    this._requirement_name = v
    this.parentCard.update()
  }

  public get requirement_name(): string {
    return this._requirement_name
  }

  public set amount(v: number) {
    this._amount = v
    this.parentCard.update()
  }

  public get amount(): number {
    return this._amount
  }

  toJSON() {
    return {
      requirement_name: this._requirement_name,
      amount: this._amount
    }
  }
}

export type Event = {
  id?: number
  default: boolean
  start_time?: Date
  end_time?: Date
  name: string
}

export declare class Card {
  readonly name: string
  readonly rarity: number
  readonly id: number
  tags: Array<number>
  events: Array<number>
  upgrades: Array<Upgrade>
  constructor({
    rarity = 1,
    events_ids = [],
    tags_ids = [],
    upgrades = [],
    name
  }: {
    rarity: Card['rarity']
    events_ids: Card['events']
    tags_ids: Card['tags']
    upgrades: Array<UpgradeBase>
    name: Card['name']
  })
  update(): Promise<void>
  refetch(): Promise<void>
  toJSON(): {
    rarity: number
    tags_ids: number[]
    events_ids: number[]
    upgrades: Upgrade[]
    name: string
  }
}

export const useCardStore = defineStore('card', () => {
  const apiPath = import.meta.env.VITE_API_PATH

  class Card implements Card {
    readonly name: string
    readonly rarity: number
    readonly id: number
    _tags: Array<number>
    _events: Array<number>
    _upgrades: Array<Upgrade>
    constructor({
      id,
      rarity = 1,
      events_ids = [],
      tags_ids = [],
      upgrades = [],
      name
    }: {
      id: Card['id']
      rarity: Card['rarity']
      events_ids: Card['events']
      tags_ids: Card['tags']
      upgrades: Array<UpgradeBase>
      name: Card['name']
    }) {
      this.id = id
      this.rarity = rarity
      this._tags = tags_ids
      this._events = events_ids
      this._upgrades = upgrades.map((e) => new Upgrade(this, e))
      this.name = name
    }

    public set tags(v: Array<number>) {
      this._tags = v
      this.update()
    }

    public get tags(): Array<number> {
      return this._tags
    }

    public set events(v: Array<number>) {
      this._events = v
      this.update()
    }

    public get events(): Array<number> {
      return this._events
    }

    public set upgrades(v: Array<Upgrade>) {
      this._upgrades = v
      this.update()
    }

    public get upgrades(): Array<Upgrade> {
      return this._upgrades
    }

    public async update() {
      const response = await fetch(`${apiPath}/cards/${this.name}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this)
      })
      if (!response.ok) {
        this.refetch()
      }
    }

    public async refetch() {
      const card = await fetch(`${apiPath}/cards/${this.name}`, {
        method: 'GET'
      })
      delete cards.value[this.name]
      if (!card.ok) {
        throw new Error(`Couldn't fetch card ${this.name}`)
      }
      cards.value[this.name] = new Card(await card.json())
    }

    public toJSON() {
      return {
        rarity: this.rarity,
        tags_ids: this.tags,
        events_ids: this.events,
        upgrades: this.upgrades,
        name: this.name
      }
    }
  }

  const cards = ref<Record<string, Card>>({})
  const tags = ref<Record<number, Tag>>({})
  // const upgrades = ref<Record<number, Upgrade>>({})
  const events = ref<Record<number, Event>>({})
  const images = ref<Record<string, string>>({})
  // const doubleCount = computed(() => count.value * 2)

  async function fetchCards() {
    const data = await fetch(apiPath + '/cards')
    const json = await data.json()
    if (!Array.isArray(json)) {
      throw new Error(`Couldn't parse cards at ${apiPath}/cards`)
    }
    const mapping = {} as Record<string, Card>
    json.forEach((c) => {
      mapping[c.name] = new Card(c)
    })

    cards.value = mapping
    images.value = Object.fromEntries(
      Object.entries(cards.value).map(([n, card]) => [
        n,
        `/src/assets/cartes_${card.rarity}etoile.png`
      ])
    )
    const atlas = await fetch(apiPath + '/atlas')
    const atlasBitmap = await createImageBitmap(await atlas.blob())
    

    const cardHeight = 450//atlasBitmap.height
    const cardWidth = 288//atlasBitmap.width / Object.keys(mapping).length

    if ((atlasBitmap.width / cardWidth % 1) != 0 || (atlasBitmap.height / cardHeight %1) != 0) {
      throw new Error('Invalid atlas dimensions')
    }
    function indexToCoordinates(index: number){
      const nmbWidth = atlasBitmap.width / cardWidth
      return {x:index%nmbWidth, y:Math.floor(index/nmbWidth)}
    }
    const canvas = new OffscreenCanvas(cardWidth, cardHeight)
    // const context = canvas.getContext('bitmaprenderer')
    const context = canvas.getContext('2d')
    console.log("y")
    await Promise.all(
      Object.values(cards.value).sort((a,b)=>a.name.localeCompare(b.name)).map(async (card, index) => {
        const coords = indexToCoordinates(index)
        const bitmap = await createImageBitmap(
          atlasBitmap,
          coords.x*cardWidth,
          coords.y*cardHeight,
          cardWidth,
          cardHeight
        )
        context?.drawImage(bitmap, 0, 0)
        // context?.transferFromImageBitmap(bitmap)
        bitmap.close()
        return { url: URL.createObjectURL(await canvas.convertToBlob()), card }
      })
    ).then((e) => {
      e.forEach(({ url, card }) => {
        images.value[card.name] = url
      })
    })
    triggerRef(images)
    atlasBitmap.close()
    console.log("z")
  }

  async function uploadImage(file: File, card: string) {
    const formData = new FormData()
    formData.append('file', file)
    return await fetch(`${apiPath}/cards/${card}/image`, {
      method: 'PUT',
      credentials: 'include',
      body: formData
    })
  }

  async function createCard(name: string, rarity: number) {
    return await fetch(`${apiPath}/cards/${name}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rarity,
        tags_ids: [],
        events_ids: [],
        upgrades: [],
        name: name
      })
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
      credentials: 'include',
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
      method: 'DELETE',
      credentials: 'include'
    })
    if (req.ok) {
      //remove tag
      delete tags.value[id]
      //Should probably find another way
      fetchTags()
    }
  }

  async function fetchEvents() {
    const data = await fetch(apiPath + '/events')
    const json = await data.json()
    const mapping = {} as Record<string, Event>
    json.forEach((t: Event) => {
      mapping[t.id!] = t
    })
    events.value = mapping
  }

  async function createEvent(
    name: string,
    isdefault: boolean = false,
    start_time?: Date,
    end_time?: Date
  ) {
    const result = await fetch(`${apiPath}/events`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, start_time, end_time, default: isdefault, cards_names: [] })
    })
    const event: Event = await result.json()
    if (result.ok && event.id !== undefined) {
      events.value[event.id] = {
        default: isdefault,
        name,
        start_time,
        end_time
      }
    }
  }

  async function deleteEvent(id: number) {
    const req = await fetch(`${apiPath}/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (req.ok) {
      delete events.value[id]
      //Should probably find another way
      fetchEvents()
    }
  }

  return {
    cards,
    tags,
    events,
    images,
    fetchCards,
    uploadImage,
    createCard,
    fetchTags,
    createTag,
    deleteTag,
    fetchEvents,
    createEvent,
    deleteEvent
  }
})
