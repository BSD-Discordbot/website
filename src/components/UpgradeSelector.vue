<script setup lang="ts">
import CardMultiselect from './CardMultiselect.vue'
import { Upgrade, useCardStore } from '@/stores/cards'
import { computed, ref, } from 'vue'

const store = useCardStore()

// those blocks are for the mail image only
const props = defineProps({
  value: {
    type: String,
    required: false,
    default: undefined
  }
})
// if this variable is not undefined, that means this selector has no main card given by default
let card_name = ref<string>()
const value = computed({
  get() {
    return props.value ?? card_name.value
  },
  set(value) {
    card_name.value = value
  }
})

const disabled = computed(() => {
  return props.value === undefined ? false : true
})

function addRequirement(card_name: string | undefined){
  if(value.value !== undefined && card_name !== undefined){
    const card = store.cards[value.value]
    if(card.upgrades.find(u => u.requirement_name === card_name)){
      return
    }
    card.upgrades.push(new Upgrade(card, {
      requirement_name: card_name,
      amount: 1
    }))
    card.update()

    if(card_name !== undefined){
      value.value = undefined
    }
  }
}

function changeRequirement(upgrade: Upgrade, requirement_name: string | undefined ){
  if(value.value === undefined){
    return
  }
  const card = store.cards[value.value]
  if(requirement_name === undefined || requirement_name === null){
    const index = card.upgrades.indexOf(upgrade)
    if(index > -1){
      card.upgrades.splice(index, 1)
    }
    card.update()
  }else{
    upgrade.requirement_name = requirement_name
  }
}
</script>

<template>
  <div class="createUpgrade">
    <CardMultiselect v-model="value" :disabled="disabled" />
    <span class="upgradeEquals">=</span>
    <div v-if="value !== undefined && value !== null" class="upgradeValues">
      <div v-for="(upgrade) in store.cards[value].upgrades" :key="upgrade.requirement_name" class="upgradeValues">
        <div class="upgradeDivContainer">
          <CardMultiselect :model-value="upgrade.requirement_name" @update:model-value="changeRequirement(upgrade, $event)" />
          <input v-model="upgrade.amount" type="number" />
        </div>
        <span class="upgradeEquals">+</span>
      </div>
      <CardMultiselect v-if="value !== undefined" @update:model-value="addRequirement" />
    </div>
  </div>
</template>

<style scoped>
.createUpgrade {
  display: flex;
  flex-wrap: nowrap;
  border-bottom: 1px solid var(--color-text);
  width: 100%;
  min-height: 145px;
}

.createUpgrade > span,
.createUpgrade > button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.upgradeDivContainer{
  max-width: 100px;
}
.upgradeValues{
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
}
.upgradeEquals {
  width: 50px;
  font-size: 40px;
}

.createUpgrade > * {
  max-width: 100px;
}

.createUpgrade input {
  max-width: 100%;
}

.delete {
  margin-left: auto;
}
</style>
