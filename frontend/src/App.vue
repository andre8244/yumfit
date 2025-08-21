<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const mode = import.meta.env.MODE

const API_URL =
  mode === 'development' ? 'http://localhost:3000/api' : 'https://yumfit-backend.onrender.com/api'

const ingredients = ref([])

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
  <h1>YumFit</h1>
  <p>Mode: {{ mode }}</p>
  <button @click="getIngredients">Get ingredients</button>
  <div>
    {{ ingredients }}
  </div>
</template>

<style scoped></style>
