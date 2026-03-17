// api/itineraryAPI.js - Frontend API calls for itineraries
import { apiUrl } from "./config";

const API_BASE_URL = apiUrl("/api/itineraries");

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Save new itinerary
export const saveItinerary = async (itineraryData) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Please login first to save your trip");
    }

    console.log("Saving itinerary with token:", token.substring(0, 20) + "...");
    console.log("API URL:", `${API_BASE_URL}/save`);
    console.log("Data being sent:", itineraryData);

    const response = await fetch(`${API_BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itineraryData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const text = await response.text();
    console.log("Response text:", text.substring(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error(
        "❌ Failed to parse JSON. Response was HTML:",
        text.substring(0, 500),
      );
      throw new Error(
        `Server returned HTML instead of JSON. Status: ${response.status}. This usually means the backend URL is incorrect or backend is unavailable.`,
      );
    }

    if (!response.ok) {
      throw new Error(data.details || data.error || "Failed to save itinerary");
    }

    return data;
  } catch (error) {
    console.error("Error saving itinerary:", error);
    throw error;
  }
};

// Get all user's itineraries
export const getMyItineraries = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/my-itineraries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch itineraries");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw error;
  }
};

// Get single itinerary by ID
export const getItineraryById = async (itineraryId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${itineraryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch itinerary");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    throw error;
  }
};

// Update itinerary
export const updateItinerary = async (itineraryId, updatesData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${itineraryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatesData),
    });

    if (!response.ok) {
      throw new Error("Failed to update itinerary");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating itinerary:", error);
    throw error;
  }
};

// Delete itinerary
export const deleteItinerary = async (itineraryId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${itineraryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete itinerary");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    throw error;
  }
};
