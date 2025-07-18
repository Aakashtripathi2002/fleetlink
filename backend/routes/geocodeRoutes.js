import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/geocode?pincode=440001
router.get("/", async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) {
    return res.status(400).json({ message: "Pincode is required" });
  }

  try {
    // Use OpenStreetMap Nominatim API
    const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        postalcode: pincode,
        countrycodes: "in",   // restrict to India
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "FleetLinkApp/1.0" // required by Nominatim
      }
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Pincode not found" });
    }

    const { lat, lon } = data[0];
    res.json({ pincode, lat: parseFloat(lat), lon: parseFloat(lon) });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Geocoding failed" });
  }
});

export default router;
