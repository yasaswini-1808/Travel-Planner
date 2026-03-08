export const getWeather = async (city) => {
  const res = await fetch(`http://localhost:5000/api/weather?city=${city}`);
  return res.json();
};
