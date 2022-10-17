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

