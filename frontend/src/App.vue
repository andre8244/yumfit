<script setup lang="ts">
////
const mode = import.meta.env.MODE
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <h1 class="text-2xl">YumFit</h1>
    <p>Mode: {{ mode }}</p>
    <div class="flex gap-4">
      <router-link to="ingredients" class="underline"> Ingredients </router-link>
      <router-link to="recipes" class="underline"> Recipes </router-link>
    </div>
    <div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
