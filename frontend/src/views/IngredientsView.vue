<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

////
const mode = import.meta.env.MODE

const API_URL =
  mode === 'development' ? 'http://localhost:3000/api' : 'https://yumfit-backend.onrender.com/api'

const ingredients = ref([])

onMounted(() => {
  getIngredients()
})

const getIngredients = () => {
  return axios
    .get(`${API_URL}/ingredients`)
    .then((res) => (ingredients.value = res.data.ingredients))
    .catch((error) => {
      console.error('Error fetching ingredients:', error)
      ingredients.value = []
    })
}
</script>

<template>
  <h1>Ingredients</h1>
  <div>
    <button @click="getIngredients">Get ingredients</button>
    <div>
      {{ ingredients }}
    </div>
  </div>
</template>
