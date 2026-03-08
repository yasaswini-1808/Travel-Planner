import Itinerary from "../models/Itinerary.js";

const STATIC_TRAVEL_KB = [
  {
    id: "packing-basics",
    title: "Packing Basics",
    text: "Pack light layers, weather-appropriate footwear, power adapter, medicines, and digital copies of passport and bookings.",
    tags: ["packing", "travel", "basics"],
  },
  {
    id: "budget-principles",
    title: "Budget Planning",
    text: "Split daily budget into stay, food, transport, and activities. Keep 10-15 percent emergency buffer and pre-book major tickets.",
    tags: ["budget", "cost", "planning"],
  },
  {
    id: "local-transport",
    title: "Local Transport Tips",
    text: "Use public transit cards where available. Check first/last train timings and keep an offline map for route reliability.",
    tags: ["transport", "train", "bus", "metro"],
  },
  {
    id: "safety-basics",
    title: "Travel Safety",
    text: "Prefer well-lit routes at night, avoid isolated zones, and keep emergency numbers and embassy contacts accessible.",
    tags: ["safety", "tips"],
  },
];

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "at",
  "from",
  "by",
  "is",
  "are",
  "be",
  "as",
  "it",
  "this",
  "that",
]);

const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && t.length > 1 && !STOP_WORDS.has(t));

const scoreDoc = (queryTokens, docTokens) => {
  if (!queryTokens.length || !docTokens.length) return 0;
  const docSet = new Set(docTokens);
  let score = 0;
  for (const qt of queryTokens) {
    if (docSet.has(qt)) score += 1;
  }
  return score;
};

const makePastTripDocs = async (userId) => {
  if (!userId) return [];

  const trips = await Itinerary.find({ userId })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  return trips.map((trip) => ({
    id: `trip-${trip._id}`,
    title: `Past trip: ${trip.tripName || trip.destination}`,
    text: `Destination ${trip.destination}. Budget ${trip.budget}. Companion ${trip.companion}. Activities ${(trip.activities || []).join(", ")}. Transport ${trip.transport || "unspecified"}.`,
    tags: ["past-trip", trip.destination, trip.budget, trip.companion].filter(
      Boolean,
    ),
  }));
};

const buildDocs = async ({ userId }) => {
  const pastTrips = await makePastTripDocs(userId);
  return [...STATIC_TRAVEL_KB, ...pastTrips];
};

export const retrieveContext = async ({ query, userId, limit = 5 }) => {
  const docs = await buildDocs({ userId });
  const queryTokens = tokenize(query);

  const ranked = docs
    .map((doc) => {
      const docTokens = tokenize(
        `${doc.title} ${doc.text} ${(doc.tags || []).join(" ")}`,
      );
      const score = scoreDoc(queryTokens, docTokens);
      return { ...doc, score };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, limit));

  const contextText = ranked
    .map((d, idx) => `${idx + 1}. ${d.title}: ${d.text}`)
    .join("\n");

  return {
    query,
    results: ranked,
    contextText,
  };
};
