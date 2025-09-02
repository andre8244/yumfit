import axios from 'axios'
import { API_URL } from './config'

export type Ingredient = {
  id: number
  name: string
  category: string
  unit: string
  serving_size: number
  serving_unit: string
  calories: number
  protein: number
  carbohydrates: number
  fiber: number
  sugar: number
  fat: number
  saturated_fat: number
  sodium: number
}

export type IngredientsResponse = {
  ingredients: Ingredient[]
}

export const postIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
  return axios.post(`${API_URL}/ingredients`, ingredient)
}

export const getIngredients = () => {
  return axios.get<IngredientsResponse>(`${API_URL}/ingredients`)
}

export const putIngredient = (ingredient: Ingredient) => {
  return axios.put(`${API_URL}/ingredients/${ingredient.id}`, ingredient)
}

export const deleteIngredient = (id: number) => {
  return axios.delete(`${API_URL}/ingredients/${id}`)
}
