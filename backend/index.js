import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehichleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import geocodeRoutes from "./routes/geocodeRoutes.js";
import pathRoutes from "./routes/pathRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();
app.get('/', (req, res) => {
  res.send('Backend is running!');
})
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/route", pathRoutes);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;  
