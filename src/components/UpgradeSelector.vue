<script setup lang="ts">
import CardMultiselect from './CardMultiselect.vue'
import { useCardStore } from '@/stores/cards'
import { ref, watchEffect } from 'vue'

const store = useCardStore()

const props = defineProps({
  value: {
    type: Number,
    required: false,
    default: undefined
  }
})

const current = ref<number>()
const requirements = ref<Record<number, number>>({})
const disabled = ref<boolean>(false)

watchEffect(() => {
  current.value = props.value
  if (props.value !== undefined) {
    disabled.value = true
    requirements.value = store.upgrades[props.value]
  }
})

function addRequirement(value: number | undefined) {
  if (value === undefined) {
    return
  }
  requirements.value[value] = 1
}

function changeRequirementAmount(e: Event, requirementId: number) {
  const amount = Number((e.target as HTMLInputElement).value)
  if (amount <= 0) {
    return delete requirements.value[requirementId]
  }
  requirements.value[requirementId] = amount
}

function createUpgrade() {
  if (
    current.value === undefined ||
    isNaN(current.value) ||
    Object.keys(requirements.value).length === 0
  ) {
    return
  }
  store.createUpgrade(current.value, requirements.value)
  current.value = undefined
  requirements.value = {}
}

function deleteUpgrade() {
  if (current.value !== undefined) {
    store.deleteUpgrade(current.value)
  }
}
</script>

<template>
  <div class="createUpgrade">
    <CardMultiselect v-model="current" :disabled="disabled"></CardMultiselect>
    <span class="upgradeEquals">=</span>

    <div v-for="(amount, id) in requirements" :key="id">
      <CardMultiselect :model-value="Number(id)"></CardMultiselect>
      <input type="number" :value="amount" @change="changeRequirementAmount($event, id)" />
    </div>

    <CardMultiselect v-if="current !== undefined" @update:model-value="addRequirement"></CardMultiselect>
    <button :disabled="Object.keys(requirements).length === 0" @click="createUpgrade">Save</button>
    <button v-if="current !== undefined" :disabled="!(current in store.upgrades)" class="delete" @click="deleteUpgrade">
      Delete
    </button>
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

.createUpgrade>span,
.createUpgrade>button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.upgradeEquals {
  width: 50px;
  font-size: 40px;
}

.createUpgrade>* {
  max-width: 100px;
}

.createUpgrade input {
  max-width: 100%;
}

.delete {
  margin-left: auto
}
</style>
