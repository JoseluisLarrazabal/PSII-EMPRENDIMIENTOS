// src/services/api.js
import axios from "axios";

<<<<<<< HEAD
const BASE_URL = "http://localhost:8000/api/moocs"; // Ajustar según tu configuración
=======
const BASE_URL = "http://localhost:5000/api/moocs"; // Ajustar según tu configuración
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf

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
<<<<<<< HEAD

export const fetchCourseById = async (id) => {
  const response = await axios.get(`http://localhost:8000/api/moocs/courses/${id}`);
  return response.data.data;
};

export const createCourse = async (courseData, token) => {
  const response = await axios.post(
    "http://localhost:8000/api/moocs/courses",
    courseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const fetchSlidesByCourseId = async (id) => {
  const response = await axios.get(`http://localhost:8000/api/moocs/courses/${id}/slides`);
  return response.data.data;
};

export const fetchMyCourses = async (token) => {
  const response = await axios.get('http://localhost:8000/api/moocs/my-courses', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const updateCourse = async (id, courseData, token) => {
  const response = await axios.put(
    `http://localhost:8000/api/moocs/courses/${id}`,
    courseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
=======
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
