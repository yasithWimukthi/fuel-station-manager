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

  const newFuelStatus = new FuelQueue(fuelStatus);
  try {
    await newFuelStatus.save();
    res.status(201).json(newFuelStatus);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
