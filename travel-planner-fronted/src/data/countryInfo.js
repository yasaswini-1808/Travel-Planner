// Dynamic country information fetched from Wikipedia and Unsplash APIs
// Solves hardcoding issue - all 195+ countries get fresh, real data automatically
import { getDestinationImages } from "../api/unsplash";

const countryCache = new Map();
const imageCache = new Map();
const profileCache = new Map();
const spotImageCache = new Map();
const wikiExtractCache = new Map();
const wikiAttractionsCache = new Map();

// Wikipedia API endpoint
const WIKI_API = "https://en.wikipedia.org/api/rest_v1";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&auto=format&fit=crop",
];

// Pre-curated famous tourist spots for major countries
export const touristSpotsDatabase = {
  France: [
    {
      name: "Eiffel Tower",
      location: "Paris",
      bestFor: "Photography, Views, History",
      description: "Iconic iron lattice monument and symbol of Paris.",
    },
    {
      name: "Louvre Museum",
      location: "Paris",
      bestFor: "Art, Culture, Museums",
      description: "World's largest art museum housing the Mona Lisa.",
    },
    {
      name: "Palace of Versailles",
      location: "Versailles",
      bestFor: "History, Architecture, Gardens",
      description: "Magnificent royal palace with stunning gardens.",
    },
    {
      name: "Notre-Dame Cathedral",
      location: "Paris",
      bestFor: "Architecture, History, Photography",
      description: "Gothic cathedral on Île de la Cité.",
    },
    {
      name: "Mont-Saint-Michel",
      location: "Normandy",
      bestFor: "History, Architecture, Scenic",
      description: "Medieval abbey on tidal island.",
    },
    {
      name: "Arc de Triomphe",
      location: "Paris",
      bestFor: "History, Photography, Views",
      description: "Monumental arch symbolizing national victory.",
    },
  ],
  Japan: [
    {
      name: "Tokyo Skytree",
      location: "Tokyo",
      bestFor: "Views, Modern, Photography",
      description: "Tallest structure in Japan with observation decks.",
    },
    {
      name: "Fushimi Inari Shrine",
      location: "Kyoto",
      bestFor: "Spirituality, Photography, Culture",
      description: "Famous shrine with thousands of vermillion torii gates.",
    },
    {
      name: "Arashiyama Bamboo Forest",
      location: "Kyoto",
      bestFor: "Nature, Photography, Peaceful",
      description: "Dense bamboo grove creating a serene tunnel.",
    },
    {
      name: "Kinkaku-ji",
      location: "Kyoto",
      bestFor: "Architecture, Photography, History",
      description: "Golden Buddhist temple reflected in mirror pool.",
    },
    {
      name: "Mount Fuji",
      location: "Shizuoka",
      bestFor: "Hiking, Photography, Nature",
      description: "Japan's iconic volcano and highest mountain.",
    },
    {
      name: "Shibuya Crossing",
      location: "Tokyo",
      bestFor: "Culture, Photography, Modern",
      description: "World's busiest pedestrian crossing.",
    },
  ],
  India: [
    {
      name: "Taj Mahal",
      location: "Agra",
      bestFor: "Photography, History, Architecture",
      description: "White marble mausoleum, one of 7 wonders of the world.",
    },
    {
      name: "Varanasi Ghats",
      location: "Varanasi",
      bestFor: "Spirituality, Culture, Photography",
      description: "Holiest city for Hindus with spiritual ghats.",
    },
    {
      name: "Hawa Mahal",
      location: "Jaipur",
      bestFor: "Photography, History, Architecture",
      description: "Five-story pink structure known as Palace of Winds.",
    },
    {
      name: "City Palace",
      location: "Jaipur",
      bestFor: "Architecture, History, Culture",
      description: "Blend of Mughal and Hindu architecture.",
    },
    {
      name: "Khajuraho Temples",
      location: "Madhya Pradesh",
      bestFor: "Architecture, History, Art",
      description: "Medieval temples with intricate stone carvings.",
    },
    {
      name: "Mysore Palace",
      location: "Mysore",
      bestFor: "Architecture, History, Photography",
      description: "Royal palace with Indo-Saracenic architecture.",
    },
  ],
  Brazil: [
    {
      name: "Christ the Redeemer",
      location: "Rio de Janeiro",
      bestFor: "Views, Photography, Iconic",
      description: "Colossal statue overlooking Rio with panoramic views.",
    },
    {
      name: "Iguazu Falls",
      location: "Misiones",
      bestFor: "Nature, Photography, Adventure",
      description: "World's largest waterfall system.",
    },
    {
      name: "Amazon Rainforest",
      location: "Manaus",
      bestFor: "Nature, Adventure, Wildlife",
      description: "Largest tropical rainforest with biodiversity.",
    },
    {
      name: "Copacabana Beach",
      location: "Rio de Janeiro",
      bestFor: "Beach, Relaxation, Nightlife",
      description: "Iconic beach with vibrant atmosphere.",
    },
    {
      name: "Sugarloaf Mountain",
      location: "Rio de Janeiro",
      bestFor: "Views, Cable Car, Photography",
      description: "Granite mountain with cable car and 360-degree views.",
    },
    {
      name: "Lençóis Maranhenses",
      location: "Maranhão",
      bestFor: "Nature, Photography, Adventure",
      description: "National park with sand dunes and lagoons.",
    },
  ],
  Italy: [
    {
      name: "Colosseum",
      location: "Rome",
      bestFor: "History, Architecture, Photography",
      description: "Ancient Roman amphitheater and Rome's iconic symbol.",
    },
    {
      name: "Sistine Chapel",
      location: "Vatican City",
      bestFor: "Art, History, Spirituality",
      description: "Chapel with Michelangelo's famous ceiling frescoes.",
    },
    {
      name: "Leaning Tower of Pisa",
      location: "Pisa",
      bestFor: "Photography, Architecture, Historic",
      description: "Famous bell tower known for unintended lean.",
    },
    {
      name: "Grand Canal",
      location: "Venice",
      bestFor: "Gondola, Photography, Romantic",
      description: "Main waterway in Venice with Renaissance palaces.",
    },
    {
      name: "Amalfi Coast",
      location: "Campania",
      bestFor: "Scenic, Beach, Driving",
      description: "Picturesque coastal drive with cliffside villages.",
    },
    {
      name: "Uffizi Gallery",
      location: "Florence",
      bestFor: "Art, Museums, Renaissance",
      description: "World-class art museum with Renaissance masterpieces.",
    },
  ],
  Spain: [
    {
      name: "Sagrada Familia",
      location: "Barcelona",
      bestFor: "Architecture, Photography, Iconic",
      description: "Gaudí's ongoing basilica masterpiece.",
    },
    {
      name: "Alhambra",
      location: "Granada",
      bestFor: "Architecture, History, Photography",
      description: "Moorish palace complex with stunning Islamic art.",
    },
    {
      name: "Park Güell",
      location: "Barcelona",
      bestFor: "Architecture, Views, Photography",
      description: "Gaudí's whimsical urban park with colorful mosaics.",
    },
    {
      name: "Prado Museum",
      location: "Madrid",
      bestFor: "Art, Museums, Culture",
      description: "One of Europe's finest art museums.",
    },
    {
      name: "Seville Cathedral",
      location: "Seville",
      bestFor: "Architecture, History, Photography",
      description: "Gothic cathedral, one of the largest churches.",
    },
    {
      name: "Flamenco Shows",
      location: "Madrid & Seville",
      bestFor: "Culture, Dance, Entertainment",
      description: "Traditional Spanish flamenco performances.",
    },
  ],
  Germany: [
    {
      name: "Brandenburg Gate",
      location: "Berlin",
      bestFor: "History, Photography, Iconic",
      description: "Iconic landmark symbolizing reunification.",
    },
    {
      name: "Neuschwanstein Castle",
      location: "Bavaria",
      bestFor: "Architecture, Photography, Fairy-tale",
      description: "19th-century castle on Alpine mountain.",
    },
    {
      name: "Berlin Wall Memorial",
      location: "Berlin",
      bestFor: "History, Photography, Culture",
      description: "Remaining fragments and memorial of Berlin Wall.",
    },
    {
      name: "Cologne Cathedral",
      location: "Cologne",
      bestFor: "Architecture, History, Photography",
      description: "Gothic cathedral, UNESCO World Heritage Site.",
    },
    {
      name: "Marienplatz",
      location: "Munich",
      bestFor: "Architecture, Culture, Photography",
      description: "Central square with Gothic revival building.",
    },
    {
      name: "Bavarian Alps",
      location: "Bavaria",
      bestFor: "Hiking, Nature, Scenic",
      description: "Beautiful mountain range with alpine villages.",
    },
  ],
  USA: [
    {
      name: "Statue of Liberty",
      location: "New York",
      bestFor: "Icons, History, Photography",
      description: "Colossal neoclassical sculpture symbolizing freedom.",
    },
    {
      name: "Grand Canyon",
      location: "Arizona",
      bestFor: "Nature, Hiking, Scenic",
      description: "Massive canyon carved by Colorado River.",
    },
    {
      name: "Golden Gate Bridge",
      location: "San Francisco",
      bestFor: "Icons, Photography, Scenic",
      description: "Iconic orange suspension bridge.",
    },
    {
      name: "Yellowstone",
      location: "Wyoming",
      bestFor: "Nature, Geysers, Wildlife",
      description: "First national park with geysers and hot springs.",
    },
    {
      name: "Hollywood Sign",
      location: "Los Angeles",
      bestFor: "Icons, Culture, Photography",
      description: "Famous landmark overlooking Los Angeles.",
    },
    {
      name: "Niagara Falls",
      location: "New York",
      bestFor: "Nature, Scenic, Romantic",
      description: "Powerful waterfall system spanning US-Canada border.",
    },
  ],
};

/**
 * Fetch country description from Wikipedia API
 * Works for all 195+ countries
 */
async function fetchWikipediaData(countryName) {
  if (countryCache.has(countryName)) {
    return countryCache.get(countryName);
  }

  try {
    const response = await fetch(
      `${WIKI_API}/page/summary/${encodeURIComponent(countryName)}`,
    );

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    const data = await response.json();

    const countryData = {
      description: data.extract || `Discover the wonders of ${countryName}`,
      wikiLink:
        data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${countryName}`,
      image: data.originalimage?.source || null,
      title: data.title || countryName,
    };

    countryCache.set(countryName, countryData);
    return countryData;
  } catch (error) {
    console.warn(
      `Wikipedia data unavailable for ${countryName}:`,
      error.message,
    );
    return {
      description: `Explore the unique attractions and culture of ${countryName}`,
      wikiLink: `https://en.wikipedia.org/wiki/${countryName}`,
      image: null,
      title: countryName,
    };
  }
}

async function fetchWikipediaExtract(pageTitle) {
  const cacheKey = String(pageTitle || "").toLowerCase();
  if (wikiExtractCache.has(cacheKey)) {
    return wikiExtractCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&origin=*&titles=${encodeURIComponent(pageTitle)}`,
    );

    if (!response.ok) {
      throw new Error(`Wikipedia extract error: ${response.status}`);
    }

    const data = await response.json();
    const pages = data?.query?.pages || {};
    const firstPage = Object.values(pages)[0] || {};
    const extract = String(firstPage?.extract || "").trim();

    wikiExtractCache.set(cacheKey, extract);
    return extract;
  } catch (error) {
    console.warn(
      `Wikipedia extract unavailable for ${pageTitle}:`,
      error.message,
    );
    wikiExtractCache.set(cacheKey, "");
    return "";
  }
}

function sentencesFromText(text) {
  if (!text) return [];
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);
}

function topSentencesByKeywords(sentences, keywords, limit = 2) {
  const scoreSentence = (s) => {
    const lower = s.toLowerCase();
    return keywords.reduce(
      (score, keyword) => score + (lower.includes(keyword) ? 1 : 0),
      0,
    );
  };

  const ranked = sentences
    .map((sentence) => ({ sentence, score: scoreSentence(sentence) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.sentence);

  return ranked;
}

function pickCuisineKeywords(text) {
  if (!text) return [];

  const candidates = [
    "cuisine",
    "food",
    "dish",
    "dishes",
    "meal",
    "meals",
    "bread",
    "rice",
    "noodle",
    "spice",
    "soup",
    "tea",
    "coffee",
  ];

  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const hits = lines
    .filter((line) =>
      candidates.some((word) => line.toLowerCase().includes(word)),
    )
    .slice(0, 5)
    .map((line) => line.replace(/\[[^\]]+\]/g, ""));

  return hits;
}

function buildWikipediaInsights(countryName, summaryText, extractText) {
  const allText = [summaryText, extractText].filter(Boolean).join(" ");
  const sentences = sentencesFromText(allText);

  const climateSentences = topSentencesByKeywords(
    sentences,
    ["climate", "temperature", "rainfall", "season", "weather"],
    2,
  );

  const cultureSentences = topSentencesByKeywords(
    sentences,
    ["culture", "tradition", "festival", "religion", "language", "art"],
    2,
  );

  const transportSentences = topSentencesByKeywords(
    sentences,
    ["transport", "rail", "airport", "road", "metro", "bus"],
    2,
  );

  const staySentences = topSentencesByKeywords(
    sentences,
    ["tourism", "hotel", "resort", "hostel", "accommodation", "visitor"],
    2,
  );

  const cuisineLines = pickCuisineKeywords(extractText || summaryText);

  const highlights = [
    ...topSentencesByKeywords(
      sentences,
      ["largest", "famous", "known", "heritage", "capital", "major"],
      4,
    ),
  ].slice(0, 4);

  return {
    bestTime:
      climateSentences[0] ||
      `Weather patterns vary across ${countryName}; check seasonal forecasts before travel.`,
    climate:
      climateSentences.join(" ") ||
      `Climate details for ${countryName} are available in its Wikipedia profile.`,
    culture:
      cultureSentences.join(" ") ||
      `${countryName} has a rich cultural heritage documented on Wikipedia.`,
    transportation:
      transportSentences.join(" ") ||
      `Transportation options in ${countryName} include domestic and local transit systems.`,
    accommodation: staySentences.length
      ? staySentences
      : [
          `Accommodation options in ${countryName} range from budget stays to premium hotels.`,
        ],
    cuisine: cuisineLines.length
      ? cuisineLines
      : [
          `Traditional food and regional dishes in ${countryName} are highlighted in Wikipedia entries.`,
        ],
    highlights: highlights.length
      ? highlights
      : [
          `Discover major landmarks and cultural experiences in ${countryName}.`,
        ],
  };
}

async function fetchWikipediaAttractions(countryName) {
  const cacheKey = String(countryName || "").toLowerCase();
  if (wikiAttractionsCache.has(cacheKey)) {
    return wikiAttractionsCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(countryName + " tourist attractions")}&limit=6&namespace=0&format=json&origin=*`,
    );

    if (!response.ok) {
      throw new Error(`Wikipedia attractions error: ${response.status}`);
    }

    const data = await response.json();
    const titles = data?.[1] || [];
    const descriptions = data?.[2] || [];

    const spots = await Promise.all(
      titles.slice(0, 6).map(async (title, index) => {
        const fallback = FALLBACK_GALLERY[index % FALLBACK_GALLERY.length];
        const image = await fetchSpotImage(countryName, title, fallback);

        return {
          name: title,
          location: countryName,
          bestFor: "History, Culture, Sightseeing",
          description:
            descriptions[index] ||
            `Learn more about ${title} in ${countryName}.`,
          image,
        };
      }),
    );

    const filtered = spots.filter(
      (spot) => spot?.name?.toLowerCase() !== countryName.toLowerCase(),
    );

    wikiAttractionsCache.set(cacheKey, filtered);
    return filtered;
  } catch (error) {
    console.warn(
      `Wikipedia attractions unavailable for ${countryName}:`,
      error.message,
    );
    wikiAttractionsCache.set(cacheKey, []);
    return [];
  }
}

function formatNumber(value) {
  if (!value && value !== 0) return "N/A";
  return Number(value).toLocaleString("en-US");
}

function formatArea(area) {
  if (!area) return "N/A";
  return `${formatNumber(area)} km2`;
}

function formatPopulation(population) {
  if (!population) return "N/A";
  return formatNumber(population);
}

function parseRestCountry(restCountry) {
  const currenciesObj = restCountry.currencies || {};
  const languagesObj = restCountry.languages || {};
  const currencyList = Object.values(currenciesObj)
    .map((cur) => cur?.name)
    .filter(Boolean);
  const languageList = Object.values(languagesObj).filter(Boolean);

  return {
    capital: restCountry.capital?.[0] || "N/A",
    region: restCountry.region || "N/A",
    population: formatPopulation(restCountry.population),
    area: formatArea(restCountry.area),
    timezone: restCountry.timezones?.[0] || "N/A",
    currency: currencyList.join(", ") || "N/A",
    language: languageList.join(", ") || "N/A",
  };
}

async function fetchCountryProfile(countryName) {
  if (profileCache.has(countryName)) {
    return profileCache.get(countryName);
  }

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`,
    );

    if (!response.ok) {
      throw new Error(`REST Countries API error: ${response.status}`);
    }

    const data = await response.json();
    const profile = parseRestCountry(data[0] || {});
    profileCache.set(countryName, profile);
    return profile;
  } catch (error) {
    console.warn(
      `Country profile unavailable for ${countryName}:`,
      error.message,
    );
    return {
      capital: "N/A",
      region: "N/A",
      population: "N/A",
      area: "N/A",
      timezone: "N/A",
      currency: "N/A",
      language: "N/A",
    };
  }
}

/**
 * Fetch images from backend destination image API
 * Uses provider fallbacks server-side and avoids exposing keys in frontend.
 */
async function fetchCountryImages(countryName, count = 6) {
  if (imageCache.has(countryName)) {
    return imageCache.get(countryName);
  }

  try {
    const images = await getDestinationImages(`${countryName} landmarks`);

    while (images.length < count) {
      images.push(FALLBACK_GALLERY[images.length % FALLBACK_GALLERY.length]);
    }

    imageCache.set(countryName, images);
    return images.slice(0, count);
  } catch (error) {
    console.warn(
      `Country images unavailable for ${countryName}:`,
      error.message,
    );
    return FALLBACK_GALLERY.slice(0, count);
  }
}

async function fetchSpotImage(countryName, spotName, fallback) {
  const cacheKey = `${countryName}::${spotName}`;
  if (spotImageCache.has(cacheKey)) {
    return spotImageCache.get(cacheKey);
  }

  try {
    const images = await getDestinationImages(`${spotName} ${countryName}`);
    const resolved = images[0] || fallback;
    spotImageCache.set(cacheKey, resolved);
    return resolved;
  } catch (error) {
    console.warn(`Spot image unavailable for ${spotName}:`, error.message);
    return fallback;
  }
}

/**
 * Get tourist spots for a country
 * Returns pre-curated spots for major countries, generic template for others
 */
function getTouristSpots(countryName) {
  return (
    touristSpotsDatabase[countryName] || [
      {
        name: "Historic Landmarks",
        location: "City Center",
        bestFor: "Photography, Culture",
        description: "Explore important historical monuments and structures.",
      },
      {
        name: "Local Markets",
        location: "Downtown",
        bestFor: "Shopping, Culture, Food",
        description: "Experience traditional markets and local commerce.",
      },
      {
        name: "Natural Attractions",
        location: "Outskirts",
        bestFor: "Nature, Adventure",
        description:
          "Discover beautiful parks, mountains, and natural wonders.",
      },
      {
        name: "Museums & Galleries",
        location: "Cultural District",
        bestFor: "Art, History, Culture",
        description: "Learn about the country's art, history, and heritage.",
      },
      {
        name: "Religious Sites",
        location: "Various",
        bestFor: "Spirituality, Culture, Photography",
        description: "Visit temples, churches, and sacred sites.",
      },
      {
        name: "Local Cuisine",
        location: "Restaurants",
        bestFor: "Food, Culture",
        description: "Taste authentic dishes and traditional specialties.",
      },
    ]
  );
}

/**
 * MAIN FUNCTION - Get comprehensive country info dynamically
 * Fetches real data from Wikipedia and Unsplash for ALL countries
 * No more hardcoded, duplicate, or generic information!
 */
export async function getCountryInfo(countryName) {
  try {
    // Fetch real data in parallel for performance
    const [wikiData, images, profile] = await Promise.all([
      fetchWikipediaData(countryName),
      fetchCountryImages(countryName),
      fetchCountryProfile(countryName),
    ]);

    const [wikiExtract, wikiAttractions] = await Promise.all([
      fetchWikipediaExtract(wikiData.title || countryName),
      fetchWikipediaAttractions(countryName),
    ]);

    const insights = buildWikipediaInsights(
      countryName,
      wikiData.description,
      wikiExtract,
    );

    const touristSpots = wikiAttractions.length
      ? wikiAttractions
      : getTouristSpots(countryName);

    const enrichedSpots = await Promise.all(
      touristSpots.slice(0, 6).map(async (spot, index) => {
        const fallback =
          images[(index + 1) % images.length] || FALLBACK_GALLERY[0];
        const spotImage = await fetchSpotImage(
          countryName,
          spot.name,
          fallback,
        );
        return {
          ...spot,
          image: spotImage,
        };
      }),
    );

    return {
      country: countryName,
      ...profile,
      description:
        wikiData.description || `Experience the wonders of ${countryName}`,
      image: images[0] || FALLBACK_GALLERY[0],
      bestTime: insights.bestTime,
      climate: insights.climate,
      cuisine: insights.cuisine,
      culture: insights.culture,
      accommodation: insights.accommodation,
      transportation: insights.transportation,
      budgetRange: `Costs vary by city and season in ${countryName}`,
      galleryImages: images.slice(0, 4),
      touristSpots: enrichedSpots,
      highlights: insights.highlights,
      wikiLink: wikiData.wikiLink,
    };
  } catch (error) {
    console.error(`Error getting info for ${countryName}:`, error);
    // Graceful fallback
    return {
      country: countryName,
      capital: "N/A",
      region: "N/A",
      population: "N/A",
      area: "N/A",
      timezone: "N/A",
      description: `Discover ${countryName} with its unique attractions and culture.`,
      image: FALLBACK_GALLERY[0],
      currency: "N/A",
      language: "N/A",
      bestTime: "Check local climate",
      climate: "Varies",
      cuisine: ["Local cuisine"],
      culture: "Rich traditions",
      accommodation: ["Hotels", "Hostels"],
      transportation: "Available",
      budgetRange: "Varies",
      galleryImages: FALLBACK_GALLERY,
      touristSpots: getTouristSpots(countryName),
      highlights: ["Explore this destination"],
      wikiLink: `https://en.wikipedia.org/wiki/${countryName}`,
    };
  }
}

// Legacy support
export const countryInformation = {};
