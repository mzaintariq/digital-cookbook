<template>
  <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
    <!-- Quantity with unit inside -->
    <div v-if="!ingredient.toTaste" class="md:col-span-2 relative">
      <input v-model.number="ingredient.quantity" type="number" min="0" step="any" placeholder="4"
        class="w-full px-2 py-1.5 pr-20 md:pr-18 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
      <div
        class="absolute inset-y-0 right-0 w-16 md:w-16 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
        <span class="text-xs md:text-sm text-gray-700 mr-1">{{ ingredient.unit }}</span>
        <IconChevronDown class="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
      </div>
      <select v-model="ingredient.unit" class="absolute inset-y-0 right-0 w-12 md:w-16 opacity-0 cursor-pointer">
        <option value="pcs">pcs</option>
        <option value="cup">cup</option>
        <option value="tbsp">tbsp</option>
        <option value="tsp">tsp</option>
        <option value="oz">oz</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
        <option value="lb">lb</option>
        <option value="pinch">pinch</option>
        <option value="clove">clove</option>
      </select>
    </div>
    <!-- "To taste" text when checked -->
    <div v-else class="md:col-span-1 flex items-center text-sm text-gray-600 italic">
      to taste
    </div>
    <!-- Alternate size with unit inside -->
    <div v-if="ingredient.detailedSize && !ingredient.toTaste" class="md:col-span-2 relative">
      <input v-model.number="ingredient.detailedSize.amount" type="number" min="0" step="any" placeholder="15"
        class="w-full px-2 py-1.5 pr-20 md:pr-18 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
      <div
        class="absolute inset-y-0 right-0 w-16 md:w-16 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
        <span class="text-xs md:text-sm text-gray-700 mr-1">{{ ingredient.detailedSize.unit }}</span>
        <IconChevronDown class="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
      </div>
      <select v-model="ingredient.detailedSize.unit"
        class="absolute inset-y-0 right-0 w-16 md:w-20 opacity-0 cursor-pointer">
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
        <option value="oz">oz</option>
      </select>
    </div>
    <input v-model="ingredient.name" type="text" placeholder="eg: Large bell peppers (any color)" :class="[
      'px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary',
      ingredient.detailedSize
        ? (ingredient.toTaste ? 'md:col-span-11' : 'md:col-span-8')
        : (ingredient.toTaste ? 'md:col-span-11' : 'md:col-span-10')
    ]" />
    <div class="md:col-span-12 flex flex-wrap items-center gap-3 md:gap-4 mt-1">
      <label class="flex items-center text-xs text-gray-600 cursor-pointer">
        <span class="mr-2">To taste</span>
        <button type="button" @click="handleToTasteToggle" :class="[
          'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          ingredient.toTaste ? 'bg-brand-primary' : 'bg-gray-300'
        ]">
          <span :class="[
            'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
            ingredient.toTaste ? 'translate-x-3.5' : 'translate-x-0.5'
          ]" />
        </button>
      </label>
      <label v-if="!ingredient.toTaste" class="flex items-center text-xs text-gray-600 cursor-pointer">
        <span class="mr-2">Alternate size</span>
        <button type="button" @click="handleDetailedSizeToggle" :class="[
          'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          ingredient.detailedSize ? 'bg-brand-primary' : 'bg-gray-300'
        ]">
          <span :class="[
            'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
            ingredient.detailedSize ? 'translate-x-3.5' : 'translate-x-0.5'
          ]" />
        </button>
      </label>
      <label class="flex items-center text-xs text-gray-600 cursor-pointer">
        <span class="mr-2">Alternate ingredient</span>
        <button type="button" @click="handleAlternateIngredientToggle" :class="[
          'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? 'bg-brand-primary' : 'bg-gray-300'
        ]">
          <span :class="[
            'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
            (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? 'translate-x-3.5' : 'translate-x-0.5'
          ]" />
        </button>
      </label>
    </div>
    <!-- Alternate Ingredient Text Field -->
    <div v-if="ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined"
      class="md:col-span-12 mt-2">
      <input v-model="ingredient.alternateIngredient" type="text" placeholder="eg: or use butter instead"
        class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconChevronDown from '~/components/icons/IconChevronDown.vue'

import type { Ingredient } from '~/types/recipe'

interface Props {
  ingredient: Ingredient
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'to-taste-change': [ingredient: Ingredient]
}>()

function handleToTasteToggle() {
  props.ingredient.toTaste = !props.ingredient.toTaste
  emit('to-taste-change', props.ingredient)
}

function handleDetailedSizeToggle() {
  props.ingredient.detailedSize = props.ingredient.detailedSize ? null : { amount: 0, unit: 'g' }
}

function handleAlternateIngredientToggle() {
  props.ingredient.alternateIngredient = (props.ingredient.alternateIngredient !== null && props.ingredient.alternateIngredient !== undefined) ? null : ''
}
</script>

<style scoped>
/* Hide number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
