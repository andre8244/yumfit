<script setup lang="ts">
import { NeButton, NeTextInput, NeModal, focusElement } from '@nethesis/vue-components'
import { ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { type Ingredient, putIngredient, postIngredient } from '@/lib/ingredients'

const { visible = false, ingredient = undefined } = defineProps<{
  visible: boolean
  ingredient: Ingredient | undefined
}>()

const emit = defineEmits(['close'])

const name = ref('')
const calories = ref('')
const protein = ref('')
const carbs = ref('')
const sugar = ref('')
const fat = ref('')
const saturatedFat = ref('')
const fiber = ref('')
const salt = ref('')
const servingSize = ref('100')
const nameRef = useTemplateRef<HTMLInputElement>('nameRef')

function saveIngredient() {
  const ingredientToSave: Partial<Ingredient> = {
    name: name.value,
    serving_size: parseInt(servingSize.value),
    calories: parseInt(calories.value),
    protein: parseInt(protein.value),
    carbohydrates: parseInt(carbs.value),
    sugar: parseInt(sugar.value),
    fat: parseInt(fat.value),
    saturated_fat: parseInt(saturatedFat.value),
    fiber: parseInt(fiber.value),
    sodium: parseInt(salt.value),
  }

  if (ingredient) {
    // Update existing ingredient
    ingredientToSave.id = ingredient.id
    putIngredient(ingredientToSave as Ingredient)
      .then(() => {
        emit('close')
      })
      .catch((error) => {
        console.error('Error updating ingredient:', error)
      })
  } else {
    // Create new ingredient
    postIngredient(ingredientToSave as Ingredient)
      .then(() => {
        emit('close')
      })
      .catch((error) => {
        console.error('Error creating ingredient:', error)
      })
  }
}

function onShow() {
  focusElement(nameRef)

  if (ingredient) {
    name.value = ingredient.name
    servingSize.value = ingredient.serving_size.toString()
    calories.value = ingredient.calories.toString()
    protein.value = ingredient.protein.toString()
    carbs.value = ingredient.carbohydrates.toString()
    sugar.value = ingredient.sugar.toString()
    fat.value = ingredient.fat.toString()
    saturatedFat.value = ingredient.saturated_fat.toString()
    fiber.value = ingredient.fiber.toString()
    salt.value = ingredient.sodium.toString()
  } else {
    name.value = ''
    servingSize.value = '100'
    calories.value = ''
    protein.value = ''
    carbs.value = ''
    sugar.value = ''
    fat.value = ''
    saturatedFat.value = ''
    fiber.value = ''
    salt.value = ''
  }
}
</script>

<template>
  <NeModal
    :visible="visible"
    :title="ingredient ? 'Edit ingredient' : 'Create ingredient'"
    :primary-label="ingredient ? 'Save' : 'Create'"
    cancel-label="Cancel"
    primary-button-kind="primary"
    close-aria-label="Close"
    @close="emit('close')"
    @primary-click="saveIngredient"
    @show="onShow"
  >
    <form @submit.prevent>
      <div class="space-y-6">
        <NeTextInput ref="nameRef" v-model.trim="name" label="Name" />
        <p class="font-semibold">Nutrition facts for 100g</p>
        <NeTextInput v-model="calories" label="Calories" type="number">
          <template #suffix>kcal</template>
        </NeTextInput>
        <NeTextInput v-model="protein" label="Protein" type="number">
          <template #suffix>g</template>
        </NeTextInput>
        <NeTextInput v-model="carbs" label="Carbs" type="number">
          <template #suffix>g</template>
        </NeTextInput>
        <NeTextInput v-model="sugar" label="Sugar" type="number">
          <template #suffix>g</template>
        </NeTextInput>
        <NeTextInput v-model="fat" label="Fat" type="number">
          <template #suffix>g</template>
        </NeTextInput>
        <NeTextInput v-model="saturatedFat" label="Saturated fat" type="number">
          <template #suffix>g</template>
        </NeTextInput>
        <NeTextInput v-model="fiber" label="Fiber" type="number">
          <template #suffix>g</template>
        </NeTextInput>
        <NeTextInput v-model="salt" label="Salt" type="number">
          <template #suffix>g</template>
        </NeTextInput>
        <NeTextInput v-model="servingSize" label="Serving size" type="number">
          <template #suffix>g</template>
        </NeTextInput>
      </div>
    </form>
  </NeModal>
</template>
