<script setup lang="ts">
import { Card, useCardStore } from '@/stores/cards';
import CardItem from './CardItem.vue';
import type { PropType } from 'vue';
const store = useCardStore()
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})


</script>

<template>
  <CardItem :id="store.cards[value].name" ></CardItem>
  =
  <div v-for="({amount, requirement_name}) in store.cards[value].upgrades" :key="requirement_name">
    <CardItem :id="store.cards[requirement_name].name" ></CardItem>
    {{ amount }}
    +
  </div>
</template>

<style scoped></style>
