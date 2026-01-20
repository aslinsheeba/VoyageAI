import axios from "axios";
import Trip from "../models/Trip.js";

export const addPlaceToTrip = async (req, res) => {
  try {
    const { tripId, type, query } = req.body;

    if (!tripId || !type || !query) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 🔹 Get trip
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // 🔹 Geoapify search
    const geoRes = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          text: query,
          filter: `circle:${trip.locations[0]?.lng || 0},${trip.locations[0]?.lat || 0},50000`,
          categories:
            type === "hotel"
              ? "accommodation.hotel"
              : type === "restaurant"
              ? "catering.restaurant"
              : "tourism.sights",
          limit: 1,
          apiKey: process.env.GEOAPIFY_KEY,
        },
      }
    );

    const place = geoRes.data.features[0];
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // 🔹 Simulate cost
    const cost =
      type === "hotel"
        ? Math.floor(Math.random() * 3000 + 2000)
        : type === "restaurant"
        ? Math.floor(Math.random() * 500 + 300)
        : Math.floor(Math.random() * 300);

    const newLocation = {
      name: place.properties.name,
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
      cost,
    };

    // 🔹 Save to DB
    trip.locations.push(newLocation);
    await trip.save();

    res.status(201).json({
      success: true,
      location: newLocation,
    });
  } catch (err) {
    console.error("Add place error:", err.message);
    res.status(500).json({ error: "Failed to add place" });
  }
};
