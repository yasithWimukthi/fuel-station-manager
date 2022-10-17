import FuelQueue from '../Models/FuelQueue.js';

/**
 * @description - This function is used to create a new fuel queue document when a customer arrives at the fuel station
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const addFuelQueue = async (req,res) => {
    const fuelQueue = req.body;
    const newFuelQueue = new FuelQueue(fuelQueue);
    try {
        await newFuelQueue.save();
        res.status(201).json(newFuelQueue);
    } catch (error) {
        res.status(409).json({message:error.message});
    }
}

/**
 * @description - This function is used to update the fuel queue document when a customer leaves the fuel station or when the fuel queue is cancelled
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const updateFuelQueueStatusByCustomerName = async (req,res) => {
    const customerName = req.query.customerName;
    const status = req.query.status;
    const departTime = req.query.departTime;
    try {
        const fuelQueue = await FuelQueue.findOneAndUpdate({customerName:customerName},{status:status,departTime:departTime},{new:true});
        res.status(200).json(fuelQueue);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

/**
 * @description - This function is used to get the fuel queue document by fuel station name
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getFuelQueueByStationName = async (req,res) => {
    const fuelStation = req.query.stationName;
    try {
        const fuelQueue = await FuelQueue.find({fuelStation:fuelStation});
        res.status(200).json(fuelQueue);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}
