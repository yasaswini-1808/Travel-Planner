const API_BASE_URL = "http://localhost:5000/api/bookings";

const getAuthToken = () => localStorage.getItem("token");

export const searchBookings = async (payload) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login to fetch booking options");
  }

  const response = await fetch(`${API_BASE_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch booking options");
  }

  return data;
};
