import { useState, useEffect } from "react";
import { getCountryInfo } from "../data/countryInfo";

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
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-gray-700 font-semibold">Loading {country}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!countryData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md">
          <p className="text-gray-700 text-center">
            Failed to load country information. Please try again.
          </p>
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
  } = countryData;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-2xl max-w-4xl w-full shadow-2xl my-8">
        {/* Header with Country Image */}
        <div className="relative h-80 overflow-hidden rounded-t-2xl">
          <img
            src={image}
            alt={country}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition"
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
            <p className="text-lg text-gray-200">{region}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Quick Info Cards - Extended */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-semibold mb-1">
                Capital
              </p>
              <p className="font-bold text-indigo-600">{capital}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-semibold mb-1">
                Population
              </p>
              <p className="font-bold text-green-600">{population}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-semibold mb-1">Area</p>
              <p className="font-bold text-blue-600">{area}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-semibold mb-1">
                Timezone
              </p>
              <p className="font-bold text-amber-600">{timezone}</p>
            </div>
          </div>

          {/* More Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-sm">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-semibold mb-1">
                Currency
              </p>
              <p className="font-bold text-rose-600">{currency}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-semibold mb-1">
                Language
              </p>
              <p className="font-bold text-violet-600">{language}</p>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-semibold mb-1">
                Best Time
              </p>
              <p className="font-bold text-sky-600">{bestTime}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {country}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {description}
            </p>
          </div>

          {/* Gallery Images */}
          {galleryImages && galleryImages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden h-40">
                    <img
                      src={img}
                      alt={`${country} ${idx}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Climate
                  </h3>
                  <p className="text-gray-700">{climate}</p>
                </div>
                {highlights && highlights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Highlights
                    </h3>
                    <ul className="space-y-2">
                      {highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-indigo-600 font-bold text-lg">
                            ✓
                          </span>
                          <span className="text-gray-700">{highlight}</span>
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Traditional Dishes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {cuisine.map((dish, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 text-center"
                    >
                      <p className="font-semibold text-gray-800">{dish}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Culture Tab */}
            {activeTab === "culture" && (
              <div className="space-y-4">
                <p className="text-gray-700 text-base leading-relaxed">
                  {culture}
                </p>
                {accommodation && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 mt-4">
                      Accommodation Types
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {accommodation.map((type, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3"
                        >
                          <p className="font-semibold text-gray-800">{type}</p>
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
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Budget Range
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {budgetRange}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Transportation
                  </h3>
                  <p className="text-gray-700">{transportation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Famous Tourist Spots */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Famous Tourist Spots
            </h2>

            {/* Spots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {touristSpots.map((spot, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSpot(spot)}
                  className="cursor-pointer group overflow-hidden rounded-xl border-2 border-gray-200 hover:border-indigo-500 transition-all hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {spot.location && (
                      <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-800">
                        📍 {spot.location}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white group-hover:bg-gray-50 transition">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      {spot.name}
                    </h3>
                    {spot.bestFor && (
                      <p className="text-indigo-600 text-xs font-semibold mb-2">
                        Best for: {spot.bestFor}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {spot.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spot Details Modal */}
            {selectedSpot && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
                  <div className="relative h-96">
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedSpot(null)}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition"
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
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedSpot.name}
                    </h3>
                    {selectedSpot.location && (
                      <p className="text-indigo-600 font-semibold mb-3">
                        📍 Location: {selectedSpot.location}
                      </p>
                    )}
                    {selectedSpot.bestFor && (
                      <p className="text-purple-600 font-semibold mb-4">
                        ⭐ Best for: {selectedSpot.bestFor}
                      </p>
                    )}
                    <p className="text-gray-700 text-base leading-relaxed mb-6">
                      {selectedSpot.description}
                    </p>
                    <button
                      onClick={() => setSelectedSpot(null)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
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
        <div className="bg-gray-50 px-6 md:px-8 py-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
