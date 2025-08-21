<script setup lang="ts">
////
const mode = import.meta.env.MODE
</script>

<template>
  <h1>YumFit</h1>
  <p>Mode: {{ mode }}</p>
  <router-link to="ingredients"> Ingredients </router-link>
  &nbsp;
  <router-link to="recipes"> Recipes </router-link>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>
