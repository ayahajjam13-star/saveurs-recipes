import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const getRecipes = () => axios.get(`${API_URL}/recipes`);
export const getByCategory = (category) =>
 axios.get(`${API_URL}/recipes/category/${encodeURIComponent(category)}`);
export const getRecipe = (id) => axios.get(`${API_URL}/recipes/${id}`);
export const getBySeason = (season) => axios.get(`${API_URL}/recipes/season/${season}`);
export const searchRecipes = (q) => axios.get(`${API_URL}/recipes/search?q=${q}`);
// What's in Your Fridge?
export const findByFridge = (ingredients, assumeStaples = true) =>
  axios.post(`${API_URL}/recipes/by-fridge`, {
    ingredients,
    assume_staples: assumeStaples,
  });