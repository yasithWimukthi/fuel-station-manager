import FuelStation from '../Models/FuelStation.js';

/**
 * @description - This function is used to create a new fuel station document
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const addFuelStation = async (req,res) => {
    const fuelStation = req.body;
    const newFuelStation = new FuelStation(fuelStation);
    try {
        await newFuelStation.save();
        res.status(201).json(newFuelStation);
    } catch (error) {
        res.status(409).json({message:error.message});
    }
}


export const getFuelStationByOw

