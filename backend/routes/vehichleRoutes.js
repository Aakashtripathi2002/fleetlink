import express from 'express';
import auth from '../middleware/auth.js';
import { addVehicle, deleteVehicle, getAvailaibleVehicles, getVehicle, updateVehicle } from '../controllers/vehicleController.js';


const router = express.Router();

router.post('/', auth(['admin']),addVehicle);

router.get('/my-vehicles', auth(['admin']), getVehicle);
router.put('/:id', auth(['admin']), updateVehicle);
router.delete('/:id', auth(['admin']),deleteVehicle);
router.get('/available', auth(['user']),getAvailaibleVehicles);
export default router;