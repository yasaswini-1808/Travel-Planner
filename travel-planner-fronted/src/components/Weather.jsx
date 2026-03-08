import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/styles/glass.css";

const API_KEY = "6abb9aa1655ba2c0ed8f6106051281df";
const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [cities, setCities] = useState(null);
  const [events, setEvents] = useState([]);
  const [transport, setTransport] = useState([]);

  /** ---------- Weather & City Autocomplete ---------- **/

  const handleInput = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (!value) return setSuggestions([]);

    if (!cities) {
      try {
        const module = await import("../data/cities.json");
        setCities(module.default);
      } catch {
        setError("Failed to load city data");
        return;
      }
    }

    const filtered = cities
      .filter((c) => c.name.toLowerCase().startsWith(value.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
  };

  const selectSuggestion = (s) => {
    const query = `${s.name},${s.country}`;
    setCity(query);
    setSuggestions([]);
    checkWeather(query);
  };

  /** ---------- Fetch Weather ---------- **/

  const checkWeather = async (query) => {
    if (!query) return;
    try {
      const res = await fetch(`${WEATHER_URL}${query}&appid=${API_KEY}`);
      const result = await res.json();

      if (res.status === 404) {
        setError("City not found. Try selecting from suggestions.");
        setData(null);
        setEvents([]);
        return;
      }

      setError("");
      setData(result);

      // Fetch events for this city
      fetchEvents(result.name);
    } catch {
      setError("Failed to fetch weather");
    }
  };

  /** ---------- Current Location ---------- **/

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
        )
          .then((res) => res.json())
          .then((result) => {
            setData(result);
            setError("");
            fetchEvents(result.name);
          })
          .catch(() => setError("Failed to fetch weather"));
      },
      () => setError("Permission denied"),
    );
  };

  /** ---------- Eventbrite Integration ---------- **/

  const fetchEvents = async (cityName) => {
    if (!cityName) return;
    try {
      const token = import.meta.env.REACT_APP_EVENTBRITE_TOKEN;
      const res = await fetch(
        `https://www.eventbriteapi.com/v3/events/search/?location.address=${cityName}&sort_by=date`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      const cityEvents =
        data.events?.map((e) => ({
          name: e.name.text,
          date: e.start.local.split("T")[0],
        })) || [];
      setEvents(cityEvents);
    } catch (err) {
      console.error("Failed to fetch events", err);
      setEvents([]);
    }
  };

  /** ---------- Transport Markers (Dummy Data) ---------- **/

  useEffect(() => {
    if (!data?.coord) return;

    // Nearby stations / bus stops (example)
    setTransport([
      {
        name: "Central Station",
        lat: data.coord.lat + 0.01,
        lng: data.coord.lon + 0.01,
      },
      {
        name: "Bus Stop",
        lat: data.coord.lat - 0.01,
        lng: data.coord.lon - 0.01,
      },
    ]);
  }, [data]);

  /** ---------- Helper Functions ---------- **/

  const getIcon = (condition) => {
    if (condition === "Clouds") return "clouds.png";
    if (condition === "Clear") return "clear.png";
    if (condition === "Rain") return "rain.png";
    if (condition === "Drizzle") return "drizzle.png";
    if (condition === "Mist") return "mist.png";
    return "rain.png";
  };

  /** ---------- JSX ---------- **/

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-4 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between w-full max-w-md mb-4 gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded shadow hover:scale-105 transition-transform w-full sm:w-auto"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={getCurrentLocationWeather}
          className="px-4 py-2 rounded shadow hover:scale-105 transition-transform w-full sm:w-auto"
        >
          📍 Current Location
        </button>
      </div>

      {/* Search Card */}
      <div className="card w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-500 mb-4">
        <div className="relative flex gap-2">
          <input
            type="text"
            placeholder="Enter the city"
            value={city}
            onChange={handleInput}
            onKeyDown={(e) => e.key === "Enter" && checkWeather(city)}
            className="flex-1 px-3 py-2 rounded shadow focus:outline-none dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={() => checkWeather(city)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            🔍
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-white dark:bg-gray-700 w-full shadow mt-1 rounded z-10 max-h-40 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => selectSuggestion(s)}
                className="px-3 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              >
                {s.name}, {s.country}
              </li>
            ))}
          </ul>
        )}

        {/* Error */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Weather info */}
        {data && (
          <div className="weather flex flex-col items-center animate-fadeIn mt-4">
            <img
              src={`/Weather/${getIcon(data?.weather?.[0]?.main)}`}
              alt="weather"
              className="w-24 h-24 mb-2 transition-transform hover:scale-110"
            />
            <h1 className="text-4xl font-bold">
              {Math.round(data?.main?.temp)}°C
            </h1>
            <h2 className="text-2xl font-semibold">{data?.name}</h2>

            <div className="details flex flex-col sm:flex-row justify-around mt-4 w-full gap-4">
              <div className="col flex items-center space-x-2">
                <img src="/Weather/humidity.png" className="w-6 h-6" />
                <div>
                  <p className="font-bold">{data?.main?.humidity}%</p>
                  <p className="text-sm">Humidity</p>
                </div>
              </div>

              <div className="col flex items-center space-x-2">
                <img src="/Weather/wind.png" className="w-6 h-6" />
                <div>
                  <p className="font-bold">{data?.wind?.speed} km/hr</p>
                  <p className="text-sm">Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Events */}
      {events.length > 0 && (
        <div className="card w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Upcoming Events in {data?.name}
          </h2>
          <ul className="list-disc list-inside">
            {events.map((event, idx) => (
              <li key={idx}>
                {event.name} - {event.date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Map */}
      <div className="w-full max-w-5xl h-60 sm:h-[60vh] rounded-xl overflow-hidden shadow-lg mb-4">
        <MapContainer
          center={data?.coord ? [data.coord.lat, data.coord.lon] : [20, 0]}
          zoom={data?.coord ? 12 : 2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={0.5}
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={0.3}
          />

          {/* Weather Marker */}
          {data?.coord && (
            <Marker position={[data.coord.lat, data.coord.lon]}>
              <Popup>
                <strong>{data.name}</strong>
                <br />
                {Math.round(data.main?.temp)}°C, {data.weather?.[0]?.main}
              </Popup>
            </Marker>
          )}

          {/* Transport Markers */}
          {transport.map((t, idx) => (
            <Marker key={idx} position={[t.lat, t.lng]}>
              <Popup>{t.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(10px);}
            to {opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}
