import mongoose from "mongoose";

/* =========================
   LOCATION (Map Pins)
   ========================= */
const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    type: { type: String }, // sight | food | hotel
    day: { type: Number },  // which day (for timeline grouping)
  },
  { _id: false }
);

/* =========================
   ACTIVITY (Timeline)
   ========================= */
const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // sight | food
    name: { type: String, required: true },
    cost: { type: Number, default: 0 },
    image: { type: String },
    coords: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: false }
);

/* =========================
   DAY PLAN
   ========================= */
const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    activities: { type: [activitySchema], default: [] },
    hotel: {
      name: String,
      cost: Number,
      image: String,
      coords: {
        lat: Number,
        lng: Number,
      },
    },
  },
  { _id: false }
);

/* =========================
   TRIP
   ========================= */
const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Firebase UID

  tripName: { type: String, required: true },
  city: { type: String, required: true },

  days: { type: Number, default: 1 },
  budget: { type: Number, default: 0 },
  members: { type: Number, default: 1 },

  /* 🔴 Used by MapCanvas */
  locations: { type: [locationSchema], default: [] },

  /* 🟢 Used by Timeline (day-wise plan) */
  itinerary: { type: [daySchema], default: [] },

  /* 💰 Used by Budget Bar */
  budgetBreakdown: {
    userBudget: Number,
    estimatedTotalCost: Number,
    status: String, // Within Budget | Over Budget
    hotelCost: Number,
    foodCost: Number,
    sightCost: Number,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Trip", tripSchema);
