// frontend/src/api/unsplash.js

export const getDestinationImages = async (destination) => {
  try {
    console.log("🖼️ Fetching images for:", destination);

    // ✅ IMPORTANT: Full URL to backend server
    const res = await fetch(
      `http://localhost:5000/api/images/${encodeURIComponent(destination)}`,
    );

    if (!res.ok) {
      throw new Error(`Image fetch failed: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Got images:", data.images?.length || 0);

    return data.images || [];
  } catch (error) {
    console.error("❌ getDestinationImages error:", error);
    // Return empty array instead of throwing - so chat still works even if images fail
    return [];
  }
};
