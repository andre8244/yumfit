<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type Ingredient, getIngredients } from '@/lib/ingredients'
import { NeHeading, NeButton } from '@nethesis/vue-components'
import ManageIngredientModal from '@/components/ManageIngredientModal.vue'
import { isDevelopmentMode } from '@/lib/config'

const ingredients = ref<Ingredient[]>([])
const currentIngredient = ref<Ingredient | undefined>()
const isShownManageIngredientModal = ref(false)

onMounted(() => {
  getIngredients()
    .then((res) => (ingredients.value = res.data.ingredients as Array<Ingredient>))
    .catch((error) => {
      console.error('Error fetching ingredients:', error)
      ingredients.value = []
    })
})

const showCreateIngredient = () => {
  currentIngredient.value = undefined
  isShownManageIngredientModal.value = true
}

const showEditIngredient = (ingredient: Ingredient) => {
  currentIngredient.value = ingredient
  isShownManageIngredientModal.value = true
}
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <NeHeading tag="h3">Ingredients</NeHeading>
    <NeButton v-if="isDevelopmentMode" kind="secondary" @click.prevent="showCreateIngredient">
      Create ingredient
    </NeButton>
    <ul>
      <li v-for="ingredient in ingredients" :key="ingredient.id">
        - {{ ingredient }} <NeButton @click="() => showEditIngredient(ingredient)">Edit</NeButton>
      </li>
    </ul>
  </div>
  <ManageIngredientModal
    :visible="isShownManageIngredientModal"
    :ingredient="currentIngredient"
    @close="isShownManageIngredientModal = false"
  />
</template>
