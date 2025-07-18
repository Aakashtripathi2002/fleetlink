import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacityKg: { type: Number, required: true },
  tyres: { type: Number, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
export default mongoose.model('Vehicle', vehicleSchema);