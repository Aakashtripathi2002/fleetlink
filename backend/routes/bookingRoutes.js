import express from 'express';

import auth from '../middleware/auth.js';
import { bookingVehicle, cancelBooking, getBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', auth(['user']), bookingVehicle);

router.get('/my-bookings', auth(['user', 'admin']), getBookings);


router.delete("/:id", auth(["user", "admin"]), cancelBooking);

export default router;