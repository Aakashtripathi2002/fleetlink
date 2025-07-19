import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';

export const addVehicle= async (req, res) => {
  const { name, capacityKg, tyres } = req.body;
  if (!name || !capacityKg || !tyres) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const vehicle = new Vehicle({ name, capacityKg, tyres, ownerId: req.user.id });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const getVehicle=async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user.id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const updateVehicle=async (req, res) => {
  const { name, capacityKg, tyres } = req.body;
  if (!name || !capacityKg || !tyres) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    vehicle.name = name;
    vehicle.capacityKg = capacityKg;
    vehicle.tyres = tyres;

    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const deleteVehicle= async (req, res) => {
  try {
    const deleted = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Vehicle delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getAvailaibleVehicles= async (req, res) => {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
  if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
    return res.status(400).json({ message: 'All query parameters are required' });
  }

  try {
    const estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    const vehicles = await Vehicle.find({ capacityKg: { $gte: parseInt(capacityRequired) } });
    const bookings = await Booking.find({
      vehicleId: { $in: vehicles.map(v => v._id) },
      $or: [
        { startTime: { $lte: endTime }, endTime: { $gte: start } },
        { startTime: { $gte: start, $lte: endTime } },
      ],
    });

    const bookedVehicleIds = bookings.map(b => b.vehicleId.toString());
    const availableVehicles = vehicles.filter(v => !bookedVehicleIds.includes(v._id.toString()));

    res.json({ vehicles: availableVehicles, estimatedRideDurationHours });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}