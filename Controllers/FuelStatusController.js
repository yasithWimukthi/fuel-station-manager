const FuelStatus = require("../Models/FuelStatus");
const mongoose = require("mongoose");

/**
 * @description - This function is used to create a new fuel status
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.addFueStatus = async (req, res) => {
  let fuelStatus = req.body;

  const newFuelStatus = new FuelStatus(fuelStatus);
  try {
    await newFuelStatus.save();
    res.status(201).json(newFuelStatus);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * @description - This function is used to update the fuel status by fuel station name
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateFuelStatusByName = async (req, res) => {
    let fuelStatus = req.body;
    try {
        const updatedFuelStatus = await FuelStatus.findOneAndUpdate(
        { fuelStation: fuelStatus.name },
        fuelStatus,
        { new: true }
        );
        res.status(200).json(updatedFuelStatus);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }

}
