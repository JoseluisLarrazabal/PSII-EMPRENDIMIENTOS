// src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/moocs"; // Ajustar según tu configuración

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
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
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const fetchSchools = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/schools`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

// Nueva función para obtener todos los datos de una vez
export const fetchAllMoocsData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all-courses`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all MOOC data:", error);
    throw error;
  }
};

export const fetchCourseById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

export const fetchCourseContent = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/${id}/content`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course content:", error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/courses`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await axios.put(`${BASE_URL}/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};
