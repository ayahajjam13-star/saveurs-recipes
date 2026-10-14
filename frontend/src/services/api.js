import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const getRecipes = () => axios.get(`${API_URL}/recipes`);
export const getRecipe = (id) => axios.get(`${API_URL}/recipes/${id}`);
export const getBySeason = (season) => axios.get(`${API_URL}/recipes/season/${season}`);
export const searchRecipes = (q) => axios.get(`${API_URL}/recipes/search?q=${q}`);