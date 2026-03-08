import { Polyline } from "react-leaflet";

export default function RouteLine({ cities }) {
  if (!cities || cities.length < 2) return null;

  const positions = cities.map((c) => [c.lat, c.lon]);

  return <Polyline positions={positions} color="blue" />;
}
