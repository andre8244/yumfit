<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Ingredient } from '@/lib/ingredients'

////
const mode = import.meta.env.MODE

const API_URL =
  mode === 'development' ? 'http://localhost:3000/api' : 'https://yumfit-backend.onrender.com/api'

const ingredients = ref<Ingredient[]>([])

onMounted(() => {
  getIngredients()
})

const getIngredients = () => {
  return axios
    .get(`${API_URL}/ingredients`)
    .then((res) => (ingredients.value = res.data.ingredients as Array<Ingredient>))
    .catch((error) => {
      console.error('Error fetching ingredients:', error)
      ingredients.value = []
    })
}

const createIngredient = () => {
  //// TODO
}
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <h1 class="text-2xl">Ingredients</h1>
    <button v-if="mode === 'development'" @click="createIngredient" class="underline">
      Create ingredient
    </button>
    <ul>
      <li v-for="ingredient in ingredients" :key="ingredient.id">- {{ ingredient.name }}</li>
    </ul>
  </div>
</template>
