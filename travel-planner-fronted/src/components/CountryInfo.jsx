import { useState, useEffect } from "react";
import { getCountryInfo } from "../data/countryInfo";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop";

export const CountryInfo = ({ country, isOpen, onClose }) => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch country data when country changes
  useEffect(() => {
    if (!isOpen || !country) {
      setCountryData(null);
      return;
    }

    setLoading(true);
    getCountryInfo(country)
      .then((data) => {
        setCountryData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching country info:", error);
        setLoading(false);
      });
  }, [country, isOpen]);

  if (!isOpen || !country) return null;

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#121529] border border-indigo-400/35 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-300/30 border-t-cyan-300 rounded-full animate-spin" />
            <p className="text-indigo-100 font-semibold">
              Loading {country}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!countryData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#121529] border border-indigo-400/35 rounded-2xl p-8 shadow-2xl max-w-md">
          <p className="text-indigo-100 text-center">
            Failed to load country information. Please try again.
          </p>
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  const {
    capital,
    region,
    population,
    area,
    timezone,
    description,
    image,
    currency,
    language,
    bestTime,
    climate,
    cuisine,
    culture,
    accommodation,
    transportation,
    budgetRange,
    galleryImages = [],
    touristSpots,
    highlights = [],
    wikiLink,
  } = countryData;

  const safeCapital = capital || "N/A";
  const safeRegion = region || "N/A";
  const safePopulation = population || "N/A";
  const safeArea = area || "N/A";
  const safeTimezone = timezone || "N/A";
  const safeCurrency = currency || "N/A";
  const safeLanguage = language || "N/A";
  const safeBestTime = bestTime || "N/A";
  const safeCuisine = Array.isArray(cuisine) ? cuisine : [];
  const safeAccommodation = Array.isArray(accommodation) ? accommodation : [];
  const safeTouristSpots = Array.isArray(touristSpots) ? touristSpots : [];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-start justify-center z-[1100] p-4 pt-20 overflow-y-auto">
      <div className="bg-[#0e1020] text-indigo-50 rounded-2xl max-w-5xl w-full shadow-2xl my-8 border border-indigo-400/30">
        {/* Header with Country Image */}
        <div className="relative h-80 overflow-hidden rounded-t-2xl bg-gray-200">
          <img
            src={image}
            alt={country}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#121529]/90 hover:bg-[#171b33] text-indigo-100 rounded-full p-2 transition border border-indigo-300/35"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Country Title Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h1 className="text-5xl font-bold mb-2">{country}</h1>
            <p className="text-lg text-gray-100">{safeRegion}</p>
            <div className="mt-3 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white">
              Country Guide
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Quick Info Cards - Extended */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
            <div className="rounded-lg p-3 bg-[#171b33] border border-indigo-400/25 shadow-sm">
              <p className="text-indigo-300 text-xs font-semibold mb-1">
                Capital
              </p>
              <p className="font-bold text-indigo-50">{safeCapital}</p>
            </div>
            <div className="rounded-lg p-3 bg-[#171b33] border border-indigo-400/25 shadow-sm">
              <p className="text-indigo-300 text-xs font-semibold mb-1">
                Population
              </p>
              <p className="font-bold text-indigo-50">{safePopulation}</p>
            </div>
            <div className="rounded-lg p-3 bg-[#171b33] border border-indigo-400/25 shadow-sm">
              <p className="text-indigo-300 text-xs font-semibold mb-1">Area</p>
              <p className="font-bold text-indigo-50">{safeArea}</p>
            </div>
            <div className="rounded-lg p-3 bg-[#171b33] border border-indigo-400/25 shadow-sm">
              <p className="text-indigo-300 text-xs font-semibold mb-1">
                Timezone
              </p>
              <p className="font-bold text-indigo-50">{safeTimezone}</p>
            </div>
          </div>

          {/* More Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-sm">
            <div className="rounded-lg p-3 bg-[#171b33] border border-indigo-400/25 shadow-sm">
              <p className="text-indigo-300 text-xs font-semibold mb-1">
                Currency
              </p>
              <p className="font-bold text-indigo-50">{safeCurrency}</p>
            </div>
            <div className="rounded-lg p-3 bg-[#171b33] border border-indigo-400/25 shadow-sm">
              <p className="text-indigo-300 text-xs font-semibold mb-1">
                Language
              </p>
              <p className="font-bold text-indigo-50">{safeLanguage}</p>
            </div>
            <div className="rounded-lg p-3 bg-[#171b33] border border-indigo-400/25 shadow-sm">
              <p className="text-indigo-300 text-xs font-semibold mb-1">
                Best Time
              </p>
              <p className="font-bold text-indigo-50">{safeBestTime}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-50 mb-4">
              About {country}
            </h2>
            <p className="text-indigo-200 text-base leading-relaxed mb-4">
              {description}
            </p>
            {wikiLink && (
              <a
                href={wikiLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Source: Wikipedia
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          {/* Gallery Images */}
          {galleryImages && galleryImages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-50 mb-4">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden h-40 bg-gray-200"
                  >
                    <img
                      src={img}
                      alt={`${country} ${idx}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs for More Info */}
          <div className="mb-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["overview", "cuisine", "culture", "practical"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                      : "bg-[#171b33] text-indigo-100 hover:bg-[#1d2240] border border-indigo-400/20"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-100 mb-3">
                    Climate
                  </h3>
                  <p className="text-indigo-200">{climate}</p>
                </div>
                {highlights && highlights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-indigo-100 mb-3">
                      Highlights
                    </h3>
                    <ul className="space-y-2">
                      {highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-cyan-300 font-bold text-lg">
                            ✓
                          </span>
                          <span className="text-indigo-200">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Cuisine Tab */}
            {activeTab === "cuisine" && (
              <div>
                <h3 className="text-lg font-bold text-indigo-100 mb-4">
                  Traditional Dishes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {safeCuisine.map((dish, idx) => (
                    <div
                      key={idx}
                      className="bg-[#171b33] border border-indigo-400/20 rounded-lg p-3 text-center"
                    >
                      <p className="font-semibold text-indigo-100">{dish}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Culture Tab */}
            {activeTab === "culture" && (
              <div className="space-y-4">
                <p className="text-indigo-200 text-base leading-relaxed">
                  {culture}
                </p>
                {accommodation && (
                  <div>
                    <h3 className="text-lg font-bold text-indigo-100 mb-3 mt-4">
                      Accommodation Types
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {safeAccommodation.map((type, idx) => (
                        <div
                          key={idx}
                          className="bg-[#171b33] border border-indigo-400/20 rounded-lg p-3"
                        >
                          <p className="font-semibold text-indigo-100">
                            {type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Practical Info Tab */}
            {activeTab === "practical" && (
              <div className="space-y-4">
                <div className="bg-[#171b33] border border-indigo-400/20 rounded-lg p-4">
                  <p className="text-indigo-300 text-sm font-semibold mb-1">
                    Budget Range
                  </p>
                  <p className="text-xl font-bold text-indigo-50">
                    {budgetRange}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-100 mb-3">
                    Transportation
                  </h3>
                  <p className="text-indigo-200">{transportation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Famous Tourist Spots */}
          <div>
            <h2 className="text-2xl font-bold text-indigo-50 mb-6">
              Famous Tourist Spots
            </h2>

            {/* Spots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {safeTouristSpots.map((spot, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSpot(spot)}
                  className="cursor-pointer group overflow-hidden rounded-xl border border-indigo-400/20 hover:border-cyan-300/55 transition-all hover:shadow-lg bg-[#171b33]"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {spot.location && (
                      <div className="absolute bottom-3 left-3 bg-[#121529]/90 px-2 py-1 rounded text-xs font-semibold text-indigo-100 border border-indigo-300/30">
                        📍 {spot.location}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-[#171b33] group-hover:bg-[#1d2240] transition">
                    <h3 className="font-bold text-indigo-50 mb-2 text-lg">
                      {spot.name}
                    </h3>
                    {spot.bestFor && (
                      <p className="text-cyan-300 text-xs font-semibold mb-2">
                        Best for: {spot.bestFor}
                      </p>
                    )}
                    <p className="text-indigo-200 text-sm line-clamp-2">
                      {spot.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spot Details Modal */}
            {selectedSpot && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1200] p-4 overflow-y-auto">
                <div className="bg-[#121529] border border-indigo-400/25 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                    <button
                      onClick={() => setSelectedSpot(null)}
                      className="absolute top-4 right-4 bg-[#171b33]/90 hover:bg-[#1d2240] text-indigo-100 rounded-full p-2 transition border border-indigo-300/35"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-3xl font-bold text-indigo-50 mb-2">
                      {selectedSpot.name}
                    </h3>
                    {selectedSpot.location && (
                      <p className="text-cyan-300 font-semibold mb-3">
                        📍 Location: {selectedSpot.location}
                      </p>
                    )}
                    {selectedSpot.bestFor && (
                      <p className="text-pink-300 font-semibold mb-4">
                        ⭐ Best for: {selectedSpot.bestFor}
                      </p>
                    )}
                    <p className="text-indigo-200 text-base leading-relaxed mb-6">
                      {selectedSpot.description}
                    </p>
                    <button
                      onClick={() => setSelectedSpot(null)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#11172d] px-6 md:px-8 py-4 border-t border-indigo-400/20 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition font-semibold"
          >
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
