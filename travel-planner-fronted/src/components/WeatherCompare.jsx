export default function WeatherCompare({ city1, city2 }) {
  if (!city1 || !city2) return null;

  return (
    <div className="glass">
      <h3>📊 Weather Comparison</h3>
      <p>
        {city1.name}: {Math.round(city1.main.temp)}°C
      </p>
      <p>
        {city2.name}: {Math.round(city2.main.temp)}°C
      </p>
    </div>
  );
}
