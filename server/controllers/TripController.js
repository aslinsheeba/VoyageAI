import axios from "axios";
import Trip from "../models/Trip.js";

// --- HELPERS ---
function daysBetween(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCoords(feature) {
  if (!feature) return { lat: 0, lng: 0 };
  if (feature.properties.lat && feature.properties.lon) {
    return { lat: feature.properties.lat, lng: feature.properties.lon };
  }
  if (feature.geometry && feature.geometry.coordinates) {
    return { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] };
  }
  return { lat: 0, lng: 0 };
}

// --- 1. GET TRIPS ---
export const getTripsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Trip.find({ userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- 2. GENERATE TRIP ---
export const generateTrip = async (req, res) => {
  try {
    console.log("📥 Received Trip Request:", req.body);
    const { userId, city, budget, travelers, startDate, endDate } = req.body;
    const apiKey = process.env.GEOAPIFY_KEY;

    if (!city || !budget || !travelers || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const duration = daysBetween(startDate, endDate);
    const userBudget = Number(budget);
    const people = Number(travelers);

    // 1. Geocoding
    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&apiKey=${apiKey}`;
    const geoRes = await axios.get(geoUrl);

    if (!geoRes.data.features || geoRes.data.features.length === 0) {
      return res.status(404).json({ success: false, error: "City not found" });
    }
    const { lat, lon } = geoRes.data.features[0].properties;

    // 2. Fetch Places
    const radius = 10000;
    const sightsPromise = axios.get(`https://api.geoapify.com/v2/places?categories=tourism.sights,entertainment&filter=circle:${lon},${lat},${radius}&limit=20&apiKey=${apiKey}`);
    const foodPromise = axios.get(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},${radius}&limit=20&apiKey=${apiKey}`);
    const hotelPromise = axios.get(`https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},${radius}&limit=10&apiKey=${apiKey}`);

    const [sightsRes, foodRes, hotelRes] = await Promise.all([sightsPromise, foodPromise, hotelPromise]);

    const sights = sightsRes.data.features;
    const restaurants = foodRes.data.features;
    const hotels = hotelRes.data.features;

    if (hotels.length === 0 || sights.length === 0) {
      return res.status(404).json({ success: false, error: "Not enough data found." });
    }

    // 3. Logic & Itinerary Building
    const hotelBase = randInt(2000, 6000); 
    const foodBase = randInt(200, 600);
    const sightBase = randInt(0, 500);
    
    const nights = Math.max(1, duration - 1);
    const totalHotelCost = hotelBase * nights;
    const totalFoodCost = foodBase * people * 2 * duration;
    const totalSights = Math.min(sights.length, duration * 2);
    const totalSightCost = sightBase * people * totalSights;
    const estimatedTotalCost = totalHotelCost + totalFoodCost + totalSightCost;
    const status = estimatedTotalCost <= userBudget ? "Within Budget" : "Over Budget";

    const itinerary = [];
    let sightIndex = 0;
    let foodIndex = 0;
    
    const pickedHotelFeature = hotels[0];
    const pickedHotelCoords = getCoords(pickedHotelFeature);
    const pickedHotelName = pickedHotelFeature.properties.name || "City Hotel";

    for (let d = 1; d <= duration; d++) {
      const dayActivities = [];

      // Add 2 Sights
      for (let i = 0; i < 2 && sightIndex < sights.length; i++) {
        const sFeature = sights[sightIndex++];
        const sCoords = getCoords(sFeature);
        const name = sFeature.properties.name || "Beautiful Sight";
        
        // 👇 FIXED URL ENCODING HERE
        const prompt = `view of ${name} in ${city}, travel photography, 4k`;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;

        dayActivities.push({
          type: "sight",
          name: name,
          cost: sightBase * people,
          image: imageUrl,
          coords: sCoords
        });
      }

      // Add 2 Restaurants
      for (let i = 0; i < 2 && foodIndex < restaurants.length; i++) {
        const rFeature = restaurants[foodIndex++];
        const rCoords = getCoords(rFeature);
        const name = rFeature.properties.name || "Local Restaurant";

        // 👇 FIXED URL ENCODING HERE
        const prompt = `delicious food at ${name} in ${city}, professional food photography`;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;

        dayActivities.push({
          type: "food",
          name: name,
          cost: foodBase * people,
          image: imageUrl,
          coords: rCoords
        });
      }

      // Hotel
      const hotelPrompt = `luxury hotel room ${pickedHotelName} in ${city}, interior design`;
      const hotelImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(hotelPrompt)}?width=800&height=600&nologo=true`;

      itinerary.push({
        day: d,
        activities: dayActivities,
        hotel: {
          name: pickedHotelName,
          cost: d === 1 ? totalHotelCost : 0,
          image: hotelImage,
          coords: pickedHotelCoords
        }
      });
    }

    // 4. Save to Database
    let savedTripId = null;
    if (userId) {
       const newTrip = await Trip.create({
         userId,
         tripName: `${city} Trip`,
         city,
         days: duration,
         budget: userBudget,
         members: people,
         locations: itinerary.flatMap(day => 
           day.activities.map(act => ({
             name: act.name,
             lat: act.coords.lat,
             lng: act.coords.lng,
             cost: act.cost,
             type: act.type,
             day: day.day
           })).concat({
             name: day.hotel.name,
             lat: day.hotel.coords.lat,
             lng: day.hotel.coords.lng,
             cost: day.hotel.cost,
             type: "hotel",
             day: day.day
           })
         ),
         itinerary,
         budgetBreakdown: { userBudget, estimatedTotalCost, status, hotelCost: totalHotelCost, foodCost: totalFoodCost, sightCost: totalSightCost }
       });
       savedTripId = newTrip._id;
    }

    res.status(201).json({ success: true, savedTripId });

  } catch (err) {
    console.error("Generate Trip Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 3. DELETE FUNCTIONS ---
export const clearAllTrips = async (req, res) => {
  try {
    await Trip.deleteMany({});
    res.json({ success: true, message: "💥 All trips deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.json({ success: true, message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};