import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';


export const bookingVehicle=async (req, res) => {
  const { vehicleId, fromPincode, toPincode, startTime } = req.body;
  if (!vehicleId || !fromPincode || !toPincode || !startTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    const conflictingBooking = await Booking.findOne({
      vehicleId,
      $or: [
        { startTime: { $lte: endTime }, endTime: { $gte: start } },
        { startTime: { $gte: start, $lte: endTime } },
      ],
    });

    if (conflictingBooking) {
      return res.status(409).json({ message: 'Vehicle is already booked for this time slot' });
    }

    const booking = new Booking({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime,
      customerId: req.user.id,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const getBookings=async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      const vehicleIds = await Vehicle.find({ ownerId: req.user.id }).distinct('_id');
      query = { vehicleId: { $in: vehicleIds } };
    } else {
      query = { customerId: req.user.id };
    }

    const bookings = await Booking.find(query)
      .populate('vehicleId')       
      .populate('customerId');  

    res.json(bookings);
  } catch (error) {
    console.error('[GET /my-bookings ERROR]', error);
    res.status(500).json({ message: 'Server error' });
  }
}


export const cancelBooking=async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role === "user") {
      if (booking.customerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    } else if (req.user.role === "admin") {
      const vehicle = await Vehicle.findById(booking.vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found for booking" });
      }
      if (vehicle.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    }
    await booking.deleteOne(); 

    return res.json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("[BOOKING CANCEL ERROR]", error);
    res.status(500).json({ message: "Server error" });
  }
}