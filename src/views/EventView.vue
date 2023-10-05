<script setup lang="ts">
import { useCardStore } from '@/stores/cards'
import { ref } from 'vue'

const store = useCardStore()

const newEventName = ref<string>('')
const newEventStart = ref<string>('')
const newEventEnd = ref<string>('')
const newEventDefault = ref<boolean>(false)

function createEvent() {
  let startDate: Date | undefined
  if (isNaN(Date.parse(newEventStart.value))) {
    startDate = undefined
  } else {
    startDate = new Date(newEventStart.value)
  }

  let endDate: Date | undefined
  if (isNaN(Date.parse(newEventEnd.value))) {
    endDate = undefined
  } else {
    endDate = new Date(newEventEnd.value)
  }
  store.createEvent(newEventName.value, newEventDefault.value, startDate, endDate)
}

function deleteEvent(id: number) {
  store.deleteEvent(id)
}
</script>

<template>
  <main>
    <form id="createEvent" @submit.prevent>
      <input v-model="newEventName" placeholder="event name" />
      <input v-model="newEventStart" type="datetime-local" />
      <input v-model="newEventEnd" type="datetime-local" />
      <input v-model="newEventDefault" type="checkbox" :true-value="true" :false-value="false" />
      <span></span>
      <button @click="createEvent">+</button>
    </form>

    <b>Event</b>
    <b>Start</b>
    <b>End</b>
    <b>Default</b>
    <b>Cards</b>

    <div v-for="(event, id) in store.events" :key="id" class="event">
      <span>{{ event.name }}</span>
      <input
        type="datetime-local"
        :value="event.start_time && new Date(event.start_time).toISOString().slice(0, 16)"
        disabled="true"
      />
      <input
        type="datetime-local"
        :value="event.end_time && new Date(event.end_time).toISOString().slice(0, 16)"
        disabled="true"
      />
      <input type="checkbox" :checked="event.default" disabled="true" />
      <span>{{ event.cards_names.length }}</span>
      <button @click="deleteEvent(id)">X</button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: repeat(8, min-content);
  justify-content: center;
  column-gap: 1ch;
}
.event {
  display: grid;
  grid-column: 1 / span 8;
  grid-template-columns: subgrid;
}

#createEvent {
  display: grid;
  grid-column: 1 / span 8;
  grid-template-columns: subgrid;
}
</style>
