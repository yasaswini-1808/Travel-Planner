// backend/server.js - UPDATED WITH TRAVEL PLANNER + AUTHENTICATION

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import Groq from "groq-sdk";
import db from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import bookingsRoutes from "./routes/bookingsRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import { authenticateToken } from "./middleware/auth.js";
import { generateItineraryLimiter } from "./middleware/rateLimit.js";
import {
  validateBody,
  generateItinerarySchema,
} from "./middleware/validate.js";
import { retrieveContext } from "./services/ragService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const OPENWEATHER_API_KEY =
  process.env.OPENWEATHER_API_KEY ||
  process.env.WEATHER_API_KEY ||
  process.env.VITE_OPENWEATHER_API_KEY;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.get("/api/itineraries/test", (req, res) => {
  res.json({ status: "ok", message: "Itinerary routes are accessible" });
});

/* =========================
   WEATHER API (SERVER-SIDE KEY)
========================= */
app.get("/api/weather", async (req, res) => {
  const city = String(req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({ error: "City query is required" });
  }

  if (!OPENWEATHER_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing OPENWEATHER_API_KEY on server" });
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          units: "metric",
          appid: OPENWEATHER_API_KEY,
        },
        timeout: 10000,
      },
    );

    return res.json(response.data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message || "Failed to fetch weather data";
    return res.status(status).json({ error: message });
  }
});

app.get("/api/weather/current", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ error: "Valid lat and lon are required" });
  }

  if (!OPENWEATHER_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing OPENWEATHER_API_KEY on server" });
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          units: "metric",
          appid: OPENWEATHER_API_KEY,
        },
        timeout: 10000,
      },
    );

    return res.json(response.data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      "Failed to fetch current location weather";
    return res.status(status).json({ error: message });
  }
});

/* =========================
   AUTHENTICATION ROUTES
========================= */
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes loaded");

/* =========================
  ITINERARY ROUTES
========================= */
app.use("/api/itineraries", itineraryRoutes);
console.log("✅ Itinerary routes loaded");

/* =========================
  FEEDBACK ROUTES
========================= */
app.use("/api/feedback", feedbackRoutes);
console.log("✅ Feedback routes loaded");

/* =========================
  BOOKING ROUTES
========================= */
app.use("/api/bookings", bookingsRoutes);
console.log("✅ Booking routes loaded");

/* =========================
  BUDGET ROUTES
========================= */
app.use("/api/budget", budgetRoutes);
console.log("✅ Budget routes loaded");

/* =========================
  RAG ROUTES
========================= */
app.use("/api/rag", ragRoutes);
console.log("✅ RAG routes loaded");

/* =========================
   AI CHAT API
========================= */
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    console.log("📥 Received:", message);

    const retrieved = await retrieveContext({ query: message, limit: 4 });

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful travel assistant. Suggest destinations, itineraries, and tips. Use provided context when relevant.",
      },
      {
        role: "system",
        content: `RAG Context:\n${retrieved.contextText || "No relevant context."}`,
      },
      ...history,
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* =========================
   BUDGET HELPERS
========================= */
const getBudgetContext = (budget) => {
  switch (budget) {
    case "Budget":
      return {
        label: "budget/backpacker (total $500–$1500)",
        accommodation: "hostels, guesthouses, budget hotels under $50/night",
        dining: "street food, local markets, cheap eats under $15/meal",
        activities: "free attractions, public transport, self-guided tours",
        dailySpend: "$50–$150 per person per day",
        costRange: "$80 - $150",
      };
    case "Moderate":
      return {
        label: "moderate/mid-range (total $1500–$3000)",
        accommodation: "3-star hotels, boutique stays, Airbnb $80–$150/night",
        dining: "mid-range restaurants, local favourites $20–$40/meal",
        activities: "paid attractions, occasional tours, mix of transport",
        dailySpend: "$150–$300 per person per day",
        costRange: "$200 - $350",
      };
    case "Luxury":
      return {
        label: "luxury/premium (total $3000+)",
        accommodation: "5-star hotels, luxury resorts, suites $300+/night",
        dining:
          "fine dining, Michelin-starred restaurants, rooftop bars $80+/meal",
        activities:
          "private tours, exclusive experiences, business/first class transport",
        dailySpend: "$500–$1000+ per person per day",
        costRange: "$600 - $900",
      };
    default:
      return {
        label: "moderate",
        accommodation: "mid-range hotels",
        dining: "mix of local and mid-range restaurants",
        activities: "popular attractions",
        dailySpend: "$150–$300 per person per day",
        costRange: "$200 - $350",
      };
  }
};

const getCompanionContext = (companion) => {
  switch (companion) {
    case "Solo":
      return "a solo traveller — recommend solo-friendly activities, safe neighbourhoods, social hostels/bars, solo dining spots, and solo travel safety tips";
    case "Couple":
      return "a couple — include romantic experiences, couples' dining, scenic spots perfect for two, sunset viewpoints, and intimate activities";
    case "Family with Kids":
      return "a family with children — prioritise kid-friendly attractions, theme parks, interactive museums, family restaurants, and avoid overly strenuous activities";
    case "Friends":
      return "a group of friends — include group activities, nightlife options, social dining, adventure experiences, and budget-splitting tips";
    default:
      return "travellers";
  }
};

const NOMINATIM_HEADERS = {
  "User-Agent": "trip-navigator-ai/1.0 (travel-itinerary-validation)",
  Accept: "application/json",
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const destinationTokens = (destination) =>
  normalizeText(destination)
    .split(" ")
    .filter((t) => t.length >= 3);

const toRad = (v) => (v * Math.PI) / 180;

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const getDestinationCoordinates = async (destination) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: destination,
        format: "jsonv2",
        limit: 1,
        addressdetails: 1,
      },
      headers: NOMINATIM_HEADERS,
      timeout: 10000,
    },
  );

  const first = response.data?.[0];
  if (!first) return null;

  return {
    lat: Number(first.lat),
    lon: Number(first.lon),
    displayName: first.display_name || destination,
    address: first.address || {},
  };
};

const validatePlaceForDestination = async (place, destination, destCoords) => {
  if (!place || !destCoords) return false;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${place}, ${destination}`,
          format: "jsonv2",
          limit: 1,
          addressdetails: 1,
        },
        headers: NOMINATIM_HEADERS,
        timeout: 10000,
      },
    );

    let first = response.data?.[0] || null;

    // Fallback lookup without forcing destination in query to avoid false negatives.
    if (!first) {
      const fallback = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: place,
            format: "jsonv2",
            limit: 5,
            addressdetails: 1,
          },
          headers: NOMINATIM_HEADERS,
          timeout: 10000,
        },
      );

      first =
        (fallback.data || []).find((item) => {
          const lat = Number(item.lat);
          const lon = Number(item.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;

          const dist = haversineKm(destCoords.lat, destCoords.lon, lat, lon);
          return dist <= 280;
        }) || null;
    }

    if (!first) return false;

    const lat = Number(first.lat);
    const lon = Number(first.lon);
    const dist = haversineKm(destCoords.lat, destCoords.lon, lat, lon);
    const display = normalizeText(first.display_name || "");
    const tokens = destinationTokens(destination);
    const tokenMatch = tokens.some((t) => display.includes(t));

    const placeAddr = first.address || {};
    const destAddr = destCoords.address || {};
    const sameState =
      normalizeText(placeAddr.state) &&
      normalizeText(placeAddr.state) === normalizeText(destAddr.state);
    const sameCountry =
      normalizeText(placeAddr.country) &&
      normalizeText(placeAddr.country) === normalizeText(destAddr.country);

    if (tokenMatch) return true;
    if (sameState && dist <= 280) return true;
    if (sameCountry && dist <= 160) return true;

    return dist <= 120;
  } catch {
    return false;
  }
};

const fetchFallbackPlaces = async (destination, count = 5) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `tourist attractions in ${destination}`,
          format: "jsonv2",
          limit: Math.max(count, 8),
        },
        headers: NOMINATIM_HEADERS,
        timeout: 10000,
      },
    );

    return (response.data || [])
      .map((item) => item?.name || item?.display_name?.split(",")?.[0])
      .filter(Boolean)
      .slice(0, count);
  } catch {
    return [];
  }
};

const validateItineraryPlaces = async (destination, itineraryDays) => {
  const destCoords = await getDestinationCoordinates(destination);
  if (!destCoords) {
    return {
      itinerary: itineraryDays,
      report: {
        validationApplied: false,
        reason: "Destination geocoding failed",
      },
    };
  }

  const fallbackPool = await fetchFallbackPlaces(destination, 10);
  let fallbackIndex = 0;
  const reportDays = [];

  const validatedDays = [];
  for (const day of itineraryDays || []) {
    const rawPlaces = Array.isArray(day.places) ? day.places : [];
    const candidatePlaces = rawPlaces
      .map((p) => String(p || "").trim())
      .filter(Boolean)
      .slice(0, 6);

    const validPlaces = [];
    const invalidPlaces = [];

    for (const place of candidatePlaces) {
      const isValid = await validatePlaceForDestination(
        place,
        destination,
        destCoords,
      );
      if (isValid) {
        validPlaces.push(place);
      } else {
        invalidPlaces.push(place);
      }
    }

    while (validPlaces.length < 3 && fallbackIndex < fallbackPool.length) {
      const replacement = fallbackPool[fallbackIndex++];
      if (replacement && !validPlaces.includes(replacement)) {
        validPlaces.push(replacement);
      }
    }

    reportDays.push({
      day: day.day,
      validCount: validPlaces.length,
      invalidPlaces,
    });

    validatedDays.push({
      ...day,
      places: validPlaces,
    });
  }

  return {
    itinerary: validatedDays,
    report: {
      validationApplied: true,
      destination: destCoords.displayName,
      days: reportDays,
    },
  };
};

/* =========================
   TRAVEL PLANNER API - PROTECTED
========================= */
app.post(
  "/api/generate-itinerary",
  authenticateToken,
  generateItineraryLimiter,
  validateBody(generateItinerarySchema),
  async (req, res) => {
    try {
      const form = req.body;
      console.log("🗺️ Generating itinerary for:", form.destination);

      const budgetCtx = getBudgetContext(form.budget);
      const companionCtx = getCompanionContext(form.companion);

      const hasActivities = form.activities && form.activities.length > 0;
      const hasDietary = form.dietary && form.dietary.length > 0;
      const hasSpecial =
        form.specialRequests && form.specialRequests.trim().length > 0;

      const ragQuery = [
        form.destination,
        form.source,
        form.budget,
        form.companion,
        ...(form.activities || []),
      ]
        .filter(Boolean)
        .join(" ");

      const retrieved = await retrieveContext({
        query: ragQuery,
        userId: req.user?.id,
        limit: 6,
      });

      const prompt = `You are an expert travel planner creating a HIGHLY PERSONALISED itinerary. Every single recommendation MUST be tailored to the specific details below — do NOT give generic suggestions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRIP DETAILS (USE ALL OF THESE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Destination:     ${form.destination}
Starting from:   ${form.source}
Travel Date:     ${form.date || "Not specified"}
Duration:        ${form.days} days
Budget Level:    ${budgetCtx.label}
  → Stay at:     ${budgetCtx.accommodation}
  → Eat at:      ${budgetCtx.dining}
  → Activities:  ${budgetCtx.activities}
  → Daily spend: ${budgetCtx.dailySpend}
Travelling as:   ${companionCtx}
Accommodation:   ${form.accommodation || "No preference"}
Transport:       ${form.transport || "No preference"}
Interests:       ${hasActivities ? form.activities.join(", ") : "General sightseeing"}
Dietary needs:   ${hasDietary ? form.dietary.join(", ") : "None"}
Special notes:   ${hasSpecial ? form.specialRequests : "None"}

RAG CONTEXT (GROUNDING NOTES)
${retrieved.contextText || "No additional context found."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT PERSONALISATION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0. GEOGRAPHY ACCURACY (HIGHEST PRIORITY):
  - NEVER invent attractions that do not exist in ${form.destination}.
  - NEVER suggest beaches/coastal activities unless ${form.destination} is coastal or island-based.
  - If a requested interest is not realistically available in ${form.destination}, explicitly say it is limited/unavailable and provide the closest valid alternative in that destination.

1. BUDGET: Every restaurant, hotel, activity MUST match the "${form.budget}" budget tier. 
   - Budget → street food stalls, free parks, public buses, hostels
   - Moderate → mid-range cafes, paid museums, Grab/Uber, 3-star hotels  
   - Luxury → fine dining, private guides, taxis/limo, 5-star resorts
   Never mix tiers (e.g. do NOT suggest a luxury restaurant for a Budget traveller).

2. COMPANION: Tailor ALL activities specifically for ${form.companion}.
   - Solo → mention solo-safe areas, solo dining bars, meeting other travellers
   - Couple → romantic dinners, couples' spa, sunset spots
   - Family → kid-friendly, short activity durations, mention child admission prices
   - Friends → group bookings, nightlife, split-cost tips

3. INTERESTS: The activities each day MUST primarily feature: ${hasActivities ? form.activities.join(", ") : "general sightseeing"}.
   Do not fill days with irrelevant activities.

4. DIETARY: All food recommendations MUST offer ${hasDietary ? form.dietary.join(", ") : "standard"} options. 
   Name specific dishes or restaurants known for these dietary requirements.

5. TRANSPORT:
  - First, include a practical way to reach ${form.destination} from ${form.source} (route/mode/time estimate).
  - Then use "${form.transport || "public transport"}" as the primary local mode for day-by-day movement.
  - Give specific directions or app names (e.g. "Take MRT Line 3", "Rent a scooter from X").

6. ACCOMMODATION: Suggest specific real hotel/hostel names matching "${form.accommodation || "any"}" type 
   AND the "${form.budget}" budget level.

7. COSTS:
  - estimatedCost MUST be a single numeric value with currency, not a range (example: "$240 per person").
  - Keep each day's estimatedCost realistic for ${form.budget} in ${form.destination}.
  - totalEstimatedCost MUST be a numeric total for ${form.days} days and consistent with daily costs.

${hasSpecial ? `8. SPECIAL REQUESTS: "${form.specialRequests}" — incorporate this throughout the itinerary.` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT — VALID JSON ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1: [Catchy title referencing ${form.destination}]",
      "places": ["3 to 5 real place names in ${form.destination}"],
      "morning": "Specific morning plan with real place names, opening times, and ${form.budget}-appropriate costs. Mention how to get there via ${form.transport || "public transport"}.",
      "afternoon": "Specific afternoon activities matching [${hasActivities ? form.activities.join(", ") : "sightseeing"}] interests. Include ${form.budget}-tier entry costs.",
      "evening": "Evening suited for ${form.companion} — specific venue names, atmosphere, cost estimate.",
      "dining": "Breakfast: [specific ${form.budget}-tier spot with ${hasDietary ? form.dietary.join("/") : "standard"} options]. Lunch: [specific place]. Dinner: [specific restaurant with dish recommendations].",
      "tips": "Practical tips specific to ${form.destination} for ${form.companion} on a ${form.budget} budget. Include booking advice, best times, local hacks.",
      "estimatedCost": "$240 per person"
    }
  ],
  "summary": "2-3 sentences summarising this specific trip for ${form.companion} on a ${form.budget} budget in ${form.destination}, highlighting the ${hasActivities ? form.activities[0] : "sightseeing"} focus.",
  "totalEstimatedCost": "Realistic total for ${form.days} days on ${form.budget} budget",
  "packingTips": [
    "Packing tip specific to ${form.destination} climate/culture on travel date ${form.date || "the travel period"}",
    "Item relevant to ${hasActivities ? form.activities.join("/") : "sightseeing"} activities",
    "Item for ${form.companion} travellers",
    "Budget-appropriate item (e.g. reusable water bottle for budget, luggage lock for hostel)"
  ],
  "localTips": [
    "Cultural tip specific to ${form.destination}",
    "Safety tip for ${form.companion} in ${form.destination}",
    "Transport tip using ${form.transport || "local transport"} in ${form.destination}",
    "Money-saving tip relevant to ${form.budget} budget in ${form.destination}"
  ]
}

Repeat the itinerary array for all ${form.days} days. Use REAL venue names in ${form.destination}. No placeholder text. No markdown. Valid JSON only.`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are an expert travel planner. You ALWAYS respond with valid JSON only — no markdown, no extra commentary, no code fences. Every recommendation must be specific to the destination, budget, and traveller type provided.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 6000,
      });

      const aiResponse = completion.choices[0].message.content;

      // Clean up the response
      let cleanedText = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Extract JSON if there's any leading/trailing text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleanedText = jsonMatch[0];

      const parsedData = JSON.parse(cleanedText);

      // Fetch destination-specific images
      const images = await fetchDestinationImages(
        form.destination,
        form.days,
        PORT,
      );

      const validated = await validateItineraryPlaces(
        form.destination,
        parsedData.itinerary || [],
      );

      // Add images to each day
      const itineraryWithImages = validated.itinerary.map((day, index) => ({
        ...day,
        image: images[index % images.length],
      }));

      console.log(
        `✅ Generated personalised ${form.days}-day itinerary for ${form.destination}`,
      );

      res.json({
        ...parsedData,
        itinerary: itineraryWithImages,
        placeValidation: validated.report,
      });
    } catch (error) {
      console.error("❌ Itinerary generation error:", error.message);
      res.status(500).json({
        error: "Failed to generate itinerary",
        message: error.message,
      });
    }
  },
);

/* =========================
   IMAGE FETCHER HELPER
========================= */
async function fetchDestinationImages(destination, days, port) {
  const needed = Math.max(days, 4);

  // 1️⃣ Try Pexels
  if (process.env.PEXELS_API_KEY) {
    try {
      const queries = [
        `${destination} landmark`,
        `${destination} travel`,
        `${destination} city`,
        `${destination} tourism`,
      ];

      const allImages = [];

      for (const query of queries) {
        if (allImages.length >= needed) break;
        const response = await axios.get("https://api.pexels.com/v1/search", {
          params: { query, per_page: 4, orientation: "landscape" },
          headers: { Authorization: process.env.PEXELS_API_KEY },
        });
        const photos = response.data.photos || [];
        photos.forEach((p) => allImages.push(p.src.large));
      }

      if (allImages.length > 0) {
        console.log(
          `✅ Got ${allImages.length} Pexels images for "${destination}"`,
        );
        return allImages;
      }
    } catch (e) {
      console.warn("⚠️ Pexels failed:", e.message);
    }
  }

  // 2️⃣ Try Pixabay
  if (process.env.PIXABAY_API_KEY) {
    try {
      const response = await axios.get("https://pixabay.com/api/", {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: `${destination} travel tourism`,
          image_type: "photo",
          per_page: needed,
          orientation: "horizontal",
          safesearch: true,
        },
      });
      const hits = response.data.hits || [];
      if (hits.length > 0) {
        console.log(
          `✅ Got ${hits.length} Pixabay images for "${destination}"`,
        );
        return hits.map((h) => h.largeImageURL);
      }
    } catch (e) {
      console.warn("⚠️ Pixabay failed:", e.message);
    }
  }

  // 3️⃣ Fallback: Unsplash Source (free, destination-aware, no API key needed)
  console.log(`⚠️ Using Unsplash fallback for "${destination}"`);
  const encodedDest = encodeURIComponent(destination);
  return Array.from(
    { length: needed },
    (_, i) =>
      `https://source.unsplash.com/800x600/?${encodedDest},travel,${i + 1}`,
  );
}

/* =========================
   IMAGE API ROUTE
========================= */
app.get("/api/images/:destination", async (req, res) => {
  try {
    const { destination } = req.params;
    console.log("🖼️ Fetching images for:", destination);
    const images = await fetchDestinationImages(destination, 4, PORT);
    res.json({ images, source: "auto" });
  } catch (error) {
    console.error("❌ Image fetch error:", error.message);
    res.json({
      images: Array.from(
        { length: 4 },
        (_, i) => `https://picsum.photos/800/600?random=${i}`,
      ),
      source: "error-fallback",
    });
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    groqConfigured: !!process.env.GROQ_API_KEY,
    pexelsConfigured: !!process.env.PEXELS_API_KEY,
    pixabayConfigured: !!process.env.PIXABAY_API_KEY,
  });
});

/* =========================
   START SERVER
========================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/...`);
  console.log(
    `✅ Groq API: ${process.env.GROQ_API_KEY ? "Configured" : "❌ MISSING"}`,
  );
  console.log(
    `✅ Pexels API: ${process.env.PEXELS_API_KEY ? "Configured" : "⚠️ Not set"}`,
  );
  console.log(
    `✅ Pixabay API: ${process.env.PIXABAY_API_KEY ? "Configured" : "⚠️ Not set"}`,
  );

  if (!process.env.PEXELS_API_KEY && !process.env.PIXABAY_API_KEY) {
    console.warn(
      "\n⚠️  No image API keys — using Unsplash free fallback (destination-aware)",
    );
    console.warn("Get free Pexels key: https://www.pexels.com/api/\n");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${PORT} is already in use. Stop the existing backend process before starting another one.`,
    );
    process.exit(1);
  }

  console.error("❌ Server startup failed:", error.message);
  process.exit(1);
});
