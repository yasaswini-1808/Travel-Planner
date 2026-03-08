export default function WeatherWarnings({ weather }) {
  if (!weather) return null;

  const temp = weather.main.temp;
  const condition = weather.weather[0].main;

  let warning = null;

  if (temp > 40) warning = "🔥 Extreme Heat Alert";
  if (temp < 5) warning = "❄️ Cold Weather Warning";
  if (condition === "Rain") warning = "🌧️ Heavy Rain Expected";
  if (condition === "Thunderstorm") warning = "⛈️ Storm Alert";

  return (
    warning && (
      <div className="glass warning">
        <strong>{warning}</strong>
      </div>
    )
  );
}
