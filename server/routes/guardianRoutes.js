import express from "express";
import { fetchPlacesByCategory } from "../services/geoapifyService.js";

const router = express.Router();

// GET /api/guardian/nearby?lat=..&lng=..&type=hospital
router.get("/nearby", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const type = (req.query.type || "hospital").toLowerCase();

    const categoryMap = {
      hospital: "healthcare.hospital",
      police: "service.police",
      fire: "service.fire_station",
    };

    const categories = categoryMap[type] || categoryMap.hospital;

    const results = await fetchPlacesByCategory({
      lat,
      lon: lng,
      categories,
      limit: 10,
      radiusM: 5000,
    });

    res.json({ ok: true, type, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
