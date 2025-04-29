// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/moocs'; // Ajustar según tu configuración

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchCoursesByCategory = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/${category}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching courses for ${category}:`, error);
    throw error;
  }
};

export const fetchSubjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/subjects`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

export const fetchSchools = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/schools`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};