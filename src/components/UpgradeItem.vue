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
  <div class="upgradeContainer">
    <div class="upgrade upgradeCard">
    <CardItem :name="store.cards[value].name" ></CardItem>
    =
    </div>
    <div class="upgradeItemContainer">
      <div v-for="({amount, requirement_name}) in store.cards[value].upgrades" :key="requirement_name" class="upgrade upgradeItem">
        <CardItem :name="store.cards[requirement_name].name" ></CardItem>
        {{ amount }}
      </div>
    </div>
    
  </div>
  
</template>

<style scoped>
.upgradeContainer{
  display:grid;
  grid-template-areas: "card item";
  grid-template-columns: min-content 1fr;
  margin-bottom: 40px;
}
.upgrade{
  display:flex;
  align-items: center;
}
.upgradeCard{
  grid-area: card;
  flex-direction: row;
}
.upgradeCard{
  align-self: baseline;
}
.upgradeItem{
  grid-area: item;
  flex-direction: column;
}
.upgradeItem .card{
  margin: 20px 20px -20px 20px;
  width: 144px;
  object-fit: contain;
}
.upgradeItemContainer{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
