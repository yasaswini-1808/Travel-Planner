import { useLocation, useNavigate } from "react-router-dom";

const Itinerary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if no state (user accessed directly)
  if (!state) {
    navigate("/travel-preferences");
    return null;
  }

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Your Travel Itinerary ✈️</h3>
      <div className="card p-4 shadow-lg rounded-4">
        <p>
          <b>Destination:</b> {state.destination}
        </p>
        <p>
          <b>Travel Date:</b> {state.date}
        </p>
        <p>
          <b>Days:</b> {state.days}
        </p>
        <p>
          <b>Budget:</b> {state.budget}
        </p>
        <p>
          <b>Travel Companion:</b> {state.companion}
        </p>
        <p>
          <b>Activities:</b> {state.activities.join(", ") || "None"}
        </p>
        <p>
          <b>Dietary Preferences:</b> {state.dietary.join(", ") || "None"}
        </p>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/feedback")}
          >
            Share Feedback
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/planner")}
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
