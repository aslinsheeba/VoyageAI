import express from "express";
// 👇 IMPORT deleteTrip HERE
import { generateTrip, clearAllTrips, getTripsByUser, deleteTrip } from "../controllers/tripController.js";

const router = express.Router();

// 1. Generate Trip
router.post("/generate", generateTrip);

// 2. Delete ALL Trips
router.delete("/clear", clearAllTrips);

// 3. Get User's Trips
router.get("/:userId", getTripsByUser);

// 4. Delete ONE Trip
router.delete("/:id", deleteTrip);

export default router;