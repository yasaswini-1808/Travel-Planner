import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { validateBody, bookingSearchSchema } from "../middleware/validate.js";

const router = express.Router();

const buildGoogleFlightsUrl = ({
  source,
  destination,
  departureDate,
  returnDate,
}) => {
  const q = `${source} to ${destination} flights`;
  const datePart = returnDate
    ? `${departureDate} return ${returnDate}`
    : departureDate;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(`${q} ${datePart}`)}`;
};

const buildHotelsUrl = ({ destination, departureDate, returnDate }) => {
  const checkout = returnDate || departureDate;
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${encodeURIComponent(departureDate)}&checkout=${encodeURIComponent(checkout)}`;
};

const buildTrainUrl = ({ source, destination, departureDate }) => {
  return `https://www.google.com/search?q=${encodeURIComponent(`train from ${source} to ${destination} on ${departureDate}`)}`;
};

const buildBusUrl = ({ source, destination, departureDate }) => {
  return `https://www.google.com/search?q=${encodeURIComponent(`bus from ${source} to ${destination} on ${departureDate}`)}`;
};

router.post(
  "/search",
  authenticateToken,
  validateBody(bookingSearchSchema),
  async (req, res) => {
    try {
      const payload = req.body;

      const options = {
        flights: [
          {
            provider: "Google Flights",
            label: `${payload.source} to ${payload.destination}`,
            bookingUrl: buildGoogleFlightsUrl(payload),
          },
        ],
        hotels: [
          {
            provider: "Booking.com",
            label: `Stay in ${payload.destination}`,
            bookingUrl: buildHotelsUrl(payload),
          },
        ],
        trains: [
          {
            provider: "Train Search",
            label: `${payload.source} to ${payload.destination}`,
            bookingUrl: buildTrainUrl(payload),
          },
        ],
        buses: [
          {
            provider: "Bus Search",
            label: `${payload.source} to ${payload.destination}`,
            bookingUrl: buildBusUrl(payload),
          },
        ],
      };

      res.json({
        message: "Booking options generated",
        query: payload,
        options,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch booking options",
        details: error.message,
      });
    }
  },
);

export default router;
