import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const getMealPlan = (weekStart) =>
  axios.get(`${API_URL}/meal-plans`, { params: { week_start: weekStart } });

export const saveMealPlan = (weekStart, meals) =>
  axios.post(`${API_URL}/meal-plans`, { week_start: weekStart, meals });

export const addRecipeToDay = (weekStart, day, recipeId) =>
  axios.post(`${API_URL}/meal-plans/add`, { week_start: weekStart, day, recipe_id: recipeId });

export const removeRecipeFromDay = (weekStart, day, recipeId) =>
  axios.post(`${API_URL}/meal-plans/remove`, { week_start: weekStart, day, recipe_id: recipeId });

export const getShoppingList = (weekStart) =>
  axios.get(`${API_URL}/shopping-list`, { params: { week_start: weekStart } });