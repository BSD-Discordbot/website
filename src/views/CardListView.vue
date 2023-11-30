<script setup lang="ts">
import CardItem from '../components/CardItem.vue'
import CardUploader from '@/components/CardUploader.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import EventMultiselect from '@/components/EventMultiselect.vue'
import { Card, useCardStore } from '@/stores/cards'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const store = useCardStore()
const userStore = useUserStore()

// let cards = ref<typeof store.cards>(store.cards)
const tags = ref<number[]>([])
const events = ref<number[]>([])
const rarity = ref<number>()

const cards = computed<Array<Card>>(() => {
  let value = store.cards
  if (tags.value.length !== 0) {
    value = Object.fromEntries(
      Object.entries(value).filter(([, card]) =>
        tags.value.every((tag) => card.tags.includes(tag))
      ))
  }

  if (events.value.length !== 0) {
    value = Object.fromEntries(
      Object.entries(value).filter(([, card]) =>
        events.value.every((event) => card.events.includes(event))
      ))
  }

  if (rarity.value != undefined) {
    value = Object.keys(value).reduce((r, e) => {
      if (value[e].rarity == rarity.value) {
        r[e] = value[e]
      }
      return r
    }, {} as Record<string, typeof value[keyof typeof value]>)
  }
  return Object.keys(value).sort().map(e => value[e])
})

const cardsByRarity = computed<Array<Array<Card>>>(() => {
  const returnValue: Array<Array<Card>> = []
  cards.value.forEach(c => {
    if (returnValue[c.rarity - 1] === undefined) {
      returnValue[c.rarity - 1] = []
    }
    returnValue[c.rarity - 1].push(c)
  })
  return returnValue
})

const allRarities = computed<Array<number>>(() =>
  Array.from(Object.values(store.cards).reduce<Set<number>>((r, v) => {
    r.add(v.rarity)
    return r
  }, new Set())).sort()
)

</script>

<template>
  <main>
    <div id="filters">
      <TagMultiselect v-if="userStore.adminMode" v-model="tags" />
      <EventMultiselect v-model="events" />
      <div v-for="(stars) in allRarities" :key="stars" id="rarityFilter">
        <button @click="rarity = stars">{{ '★'.repeat(stars) }}</button>
      </div>
    </div>

    <CardUploader v-if="userStore.adminMode" />
    <div v-for="(rarityCards, stars) in cardsByRarity" :key="stars" class="rarity">
      <span v-if="rarityCards != undefined" class="rarityHeader">{{ '★'.repeat(stars + 1) }}</span>
      <div v-for="(card, id) in rarityCards" :key="id" class="cardContainer">
        <CardItem :name="card.name" />
      </div>
    </div>

  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 0;
}

#filters {
  padding-top: 1em;
  width: 100%;
  display: flex;
  z-index: 2;
  position: sticky;
  top: 0;
  background: var(--color-background)
}

.rarity {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.cardContainer {
  /* height: 100%; */
  width: 144px;
  margin: 20px;
  object-fit: contain;
}

.rarityHeader {
  font-size: 500%;
  width: 100%;
  height: 1em;
  text-align: center;
  position: sticky;
  top: 55px;
  z-index: 1;
  background: var(--color-background);
}
</style>
