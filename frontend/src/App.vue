<script setup lang="ts">
import { NeHeading, NeLink } from '@nethesis/vue-components'
import { isDevelopmentMode } from '@/lib/config'
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <div class="flex items-end gap-4">
      <NeHeading tag="h1">YumFit</NeHeading>
      <p v-if="isDevelopmentMode">dev</p>
    </div>
    <div class="flex gap-4">
      <NeLink>
        <router-link to="ingredients"> Ingredients </router-link>
      </NeLink>
      <NeLink>
        <router-link to="recipes"> Recipes </router-link>
      </NeLink>
      <NeLink>
        <router-link to="compare"> Compare </router-link>
      </NeLink>
    </div>
    <div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
