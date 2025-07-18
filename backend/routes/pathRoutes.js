import express from "express";
import axios from "axios";

const router = express.Router();

// OSRM base URL (use public demo or self-hosted OSRM)
const OSRM_URL = "https://router.project-osrm.org"; // Public OSRM server (demo only)

router.get("/", async (req, res) => {
  const { fromLat, fromLon, toLat, toLon } = req.query;

  if (!fromLat || !fromLon || !toLat || !toLon) {
    return res.status(400).json({ message: "Missing coordinates" });
  }

  try {
    // OSRM requires lon,lat format
    const url = `${OSRM_URL}/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}`;
    const { data } = await axios.get(url, {
      params: {
        overview: "full",
        geometries: "polyline", // compact polyline
      },
    });

    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ message: "No route found" });
    }

    const route = data.routes[0];

    res.json({
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      polyline: route.geometry, // frontend can decode
    });
  } catch (error) {
    console.error("OSRM error:", error.message);
    res.status(500).json({ message: "Routing service failed" });
  }
});

export default router;
