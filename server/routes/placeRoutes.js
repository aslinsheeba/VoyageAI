import express from "express";
import { addPlaceToTrip } from "../controllers/placeController.js";

const router = express.Router();

router.post("/add", addPlaceToTrip);

export default router;
