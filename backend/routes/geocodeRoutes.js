import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) {
    return res.status(400).json({ message: "Pincode is required" });
  }

  try {
    const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        postalcode: pincode,
        countrycodes: "in",  
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "FleetLinkApp/1.0" 
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
