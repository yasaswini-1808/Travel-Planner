export const getWeather = async (city) => {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  return res.json();
};

export const getCurrentWeather = async (lat, lon) => {
  const res = await fetch(`/api/weather/current?lat=${lat}&lon=${lon}`);
  return res.json();
};
