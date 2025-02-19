import axios from "axios";

const API_URL = "http://localhost:3000/api/prikoli";

const PrikolService = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error loading prikols:", error);
      return [];
    }
  },

  create: async (text, possibleReactions) => {
    try {
      const response = await axios.post(API_URL, { text, possibleReactions });
      return response.data;
    } catch (error) {
      console.error("Error creating prikol:", error);
      throw error;
    }
  },

  update: async (id, text, possibleReactions) => {
    try { 
      const response = await axios.put(`${API_URL}/${id}`, { text, possibleReactions });
      return response.data;
    } catch (error) {
      console.error("Error updating prikol:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting prikol:", error);
      throw error;
    }
  },

  react: async (id, reaction) => {
    try {
      await axios.post(`${API_URL}/react/${id}`, { reaction });
    } catch (error) {
      console.error("Error reacting to prikol:", error);
      throw error;
    }
  }
};

export default PrikolService;
