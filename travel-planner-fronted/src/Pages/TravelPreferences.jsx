import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyItineraries,
  updateItinerary,
  deleteItinerary,
  getItineraryById,
} from "../api/itineraryAPI";
import "./TravelPreferences.css";

function TravelPreferences() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await getMyItineraries();
      setTrips(response.itineraries || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load trips");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openDetails = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const openEdit = (trip) => {
    setEditingTrip({ ...trip });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTrip(null);
    setEditingTrip(null);
  };

  const saveEdit = async () => {
    try {
      if (!editingTrip) return;

      const updateData = {
        tripName: editingTrip.tripName,
        destination: editingTrip.destination,
        startDate: editingTrip.startDate,
        endDate: editingTrip.endDate,
        numberOfDays: editingTrip.numberOfDays,
        budget: editingTrip.budget,
        companion: editingTrip.companion,
        accommodation: editingTrip.accommodation,
        transport: editingTrip.transport,
        activities: editingTrip.activities,
        dietary: editingTrip.dietary,
        specialRequests: editingTrip.specialRequests,
        status: editingTrip.status,
      };

      await updateItinerary(editingTrip._id, updateData);

      // Update local state
      setTrips(
        trips.map((t) =>
          t._id === editingTrip._id ? { ...t, ...updateData } : t,
        ),
      );

      setError("");
      closeModal();
      alert("✅ Trip updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update trip");
      console.error(err);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await deleteItinerary(tripId);
      setTrips(trips.filter((t) => t._id !== tripId));
      setDeleteConfirm(null);
      setError("");
      alert("✅ Trip deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete trip");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your trips...</p>
      </div>
    );
  }

  return (
    <div className="travel-preferences">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>My Trips 🗺️</h1>
          <span className="badge bg-primary fs-5">{trips.length} trips</span>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {trips.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            <h4>No trips yet</h4>
            <p>Start planning your first adventure!</p>
          </div>
        ) : (
          <div className="row">
            {trips.map((trip) => (
              <div key={trip._id} className="col-md-6 col-lg-4 mb-4">
                <div className="trip-card">
                  <div className="trip-header">
                    <h5 className="trip-title">
                      {trip.tripName || trip.destination}
                    </h5>
                    <span className={`badge status-${trip.status}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="trip-info">
                    <p>
                      <strong>📍 Destination:</strong> {trip.destination}
                    </p>
                    <p>
                      <strong>📅 Duration:</strong> {trip.numberOfDays} days
                    </p>
                    <p>
                      <strong>💰 Budget:</strong>{" "}
                      {trip.budget.charAt(0).toUpperCase() +
                        trip.budget.slice(1)}
                    </p>
                    <p>
                      <strong>👥 Companion:</strong>{" "}
                      {trip.companion.charAt(0).toUpperCase() +
                        trip.companion.slice(1)}
                    </p>
                    <p>
                      <strong>📆 Dates:</strong> {formatDate(trip.startDate)} to{" "}
                      {formatDate(trip.endDate)}
                    </p>
                  </div>

                  <div className="trip-actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => openDetails(trip)}
                    >
                      👁️ View
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => openEdit(trip)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeleteConfirm(trip._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedTrip && !editingTrip && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{selectedTrip.tripName || selectedTrip.destination}</h4>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h6>Trip Details</h6>
                <p>
                  <strong>Destination:</strong> {selectedTrip.destination}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedTrip.numberOfDays} days
                </p>
                <p>
                  <strong>Budget:</strong>{" "}
                  {selectedTrip.budget.charAt(0).toUpperCase() +
                    selectedTrip.budget.slice(1)}
                </p>
                <p>
                  <strong>Companion Type:</strong>{" "}
                  {selectedTrip.companion.charAt(0).toUpperCase() +
                    selectedTrip.companion.slice(1)}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {formatDate(selectedTrip.startDate)}
                </p>
                <p>
                  <strong>End Date:</strong> {formatDate(selectedTrip.endDate)}
                </p>
              </div>

              {selectedTrip.accommodation && (
                <div className="detail-section">
                  <h6>Accommodation</h6>
                  <p>{selectedTrip.accommodation}</p>
                </div>
              )}

              {selectedTrip.transport && (
                <div className="detail-section">
                  <h6>Transport</h6>
                  <p>{selectedTrip.transport}</p>
                </div>
              )}

              {selectedTrip.activities &&
                selectedTrip.activities.length > 0 && (
                  <div className="detail-section">
                    <h6>Activities</h6>
                    <ul>
                      {selectedTrip.activities.map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedTrip.dietary && selectedTrip.dietary.length > 0 && (
                <div className="detail-section">
                  <h6>Dietary Preferences</h6>
                  <ul>
                    {selectedTrip.dietary.map((diet, idx) => (
                      <li key={idx}>{diet}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTrip.specialRequests && (
                <div className="detail-section">
                  <h6>Special Requests</h6>
                  <p>{selectedTrip.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => openEdit(selectedTrip)}
              >
                ✏️ Edit Trip
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingTrip && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Edit Trip</h4>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group mb-3">
                <label>Trip Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingTrip.tripName || ""}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, tripName: e.target.value })
                  }
                />
              </div>

              <div className="form-group mb-3">
                <label>Destination</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingTrip.destination || ""}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      destination: e.target.value,
                    })
                  }
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        editingTrip.startDate
                          ? editingTrip.startDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        editingTrip.endDate
                          ? editingTrip.endDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Number of Days</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingTrip.numberOfDays || ""}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      numberOfDays: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>Budget</label>
                    <select
                      className="form-control"
                      value={editingTrip.budget || ""}
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip,
                          budget: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Budget</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>Companion Type</label>
                    <select
                      className="form-control"
                      value={editingTrip.companion || ""}
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip,
                          companion: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="solo">Solo</option>
                      <option value="couple">Couple</option>
                      <option value="family">Family</option>
                      <option value="friends">Friends</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Accommodation</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Hotel, Airbnb, Resort"
                  value={editingTrip.accommodation || ""}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      accommodation: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group mb-3">
                <label>Transport</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Flight, Train, Car"
                  value={editingTrip.transport || ""}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      transport: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group mb-3">
                <label>Status</label>
                <select
                  className="form-control"
                  value={editingTrip.status || "planned"}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, status: e.target.value })
                  }
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Special Requests</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Any special requests..."
                  value={editingTrip.specialRequests || ""}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      specialRequests: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={saveEdit}>
                💾 Save Changes
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Delete Trip?</h4>
              <button
                className="close-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete this trip? This action cannot be
                undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={() => deleteTrip(deleteConfirm)}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelPreferences;
