const apiBase = "http://localhost:5000";

const now = Date.now();
const email = `e2e_planner_${now}@gmail.com`;
const username = `e2e_planner_${now}`;
const password = "Test1234";

async function request(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, options);
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`${path} failed (${res.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

async function run() {
  console.log("Running planner E2E test...");

  await request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      fullName: "E2E Planner User",
    }),
  });

  const login = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const token = login.token;
  if (!token) {
    throw new Error("Login did not return token");
  }

  const generatePayload = {
    source: "Hyderabad, India",
    destination: "Zurich",
    date: "2026-04-15",
    days: 3,
    budget: "Moderate",
    companion: "Solo",
    accommodation: "Boutique Hotel",
    transport: "Public Transport",
    activities: ["Beaches", "Museums"],
    dietary: ["Vegetarian"],
    specialRequests:
      "Avoid random beach recommendations unless actually available.",
  };

  const generated = await request("/api/generate-itinerary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(generatePayload),
  });

  const savePayload = {
    source: generatePayload.source,
    destination: generatePayload.destination,
    tripName: `E2E Planner ${now}`,
    startDate: "2026-04-15",
    endDate: "2026-04-17",
    numberOfDays: 3,
    budget: generatePayload.budget,
    companion: generatePayload.companion,
    accommodation: generatePayload.accommodation,
    transport: generatePayload.transport,
    activities: generatePayload.activities,
    dietary: generatePayload.dietary,
    specialRequests: "e2e save check",
    itineraryData: generated,
  };

  const saved = await request("/api/itineraries/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(savePayload),
  });

  const summary = {
    user: email,
    generatedDays: generated?.itinerary?.length || 0,
    placeValidationApplied:
      generated?.placeValidation?.validationApplied || false,
    invalidCounts:
      (generated?.placeValidation?.days || [])
        .map((d) => d?.invalidPlaces?.length || 0)
        .join(",") || "",
    savedTripId: saved?.itinerary?._id,
    savedSource: saved?.itinerary?.source || null,
  };

  console.log("E2E planner test passed:");
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((err) => {
  console.error("E2E planner test failed:");
  console.error(err.message);
  process.exit(1);
});
