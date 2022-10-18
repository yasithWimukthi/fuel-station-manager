import FuelStation from '../Models/FuelStation.js';
import FuelStatus from '../Models/FuelStatus.js';

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

/**
 * @description - This function is used to get all the fuel stations by owner name
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getFuelStationByOwner = async (req,res) => {
    const owner = req.query.owner;
    try {
        const fuelStation = await FuelStation.find({owner:owner});
        res.status(200).json(fuelStation);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

/**
 * @description - This function is used to add fuel status to the fuel station
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const addFuelStatusToFuelStation = async (req,res) => {
    const fuelStatus = req.body;
    const newFuelStatus = new FuelStatus(fuelStatus);
    try {
        await newFuelStatus.save();
        res.status(201).json(newFuelStatus);
    } catch (error) {
        res.status(409).json({message:error.message});
    }
}

/**
 * @description - This function is used to get the fuel station details
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getAllFuelStations = async (req,res) => {
    try {
        const fuelStation = await FuelStation.find();
        res.status(200).json(fuelStation);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}



