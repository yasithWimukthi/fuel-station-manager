const FuelStation = require("../Models/FuelStation");
const FuelQueue = require("../Models/FuelQueue");
const mongoose = require("mongoose");
const FuelStatus = require("../Models/FuelStatus");

/**
 * @description - This function is used to create a new fuel queue document when a customer arrives at the fuel station
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.addFuelQueue = async (req, res) => {
  let fuelQueue = req.body;
  fuelQueue.arrivalTime = new Date(fuelQueue.arrivalTime);
  fuelQueue.departTime = new Date(fuelQueue.departTime);

  const newFuelQueue = new FuelQueue(fuelQueue);
  try {
    await newFuelQueue.save();
    res.status(201).json(newFuelQueue);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * @description - This function is used to update the fuel queue document when a customer leaves the fuel station or when the fuel queue is cancelled
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateFuelQueueStatusByCustomerName = async (req, res) => {
  const customerName = req.query.customerName;
  const status = req.query.status;
  const departTime = req.query.departTime;
  try {
    const fuelQueue = await FuelQueue.findOneAndUpdate(
      { customerName: customerName },
      { status: status, departTime: departTime },
      { new: true }
    );
    res.status(200).json(fuelQueue);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @description - This function is used to get the fuel queue document by fuel station name
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getFuelQueueByStationName = async (req, res) => {
  const fuelStation = req.query.stationName;
  try {
    const fuelQueue = await FuelQueue.find({ fuelStation: fuelStation });
    res.status(200).json(fuelQueue);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @description - This function is used to get the fuel queue document by fuel station name and vehicle type
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getFuelQueueByStationNameAndVehicleType = async (req, res) => {
  const fuelStation = req.query.stationName;
  const vehicleType = req.query.vehicleType;
  try {
    const fuelQueue = await FuelQueue.find({
      fuelStation: fuelStation,
      vehicleType: vehicleType,
    });
    res.status(200).json(fuelQueue);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @description - This function is used to get the fuel queue document by fuel station name and vehicle type and date
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getFuelQueueByStationNameAndVehicleTypeAndDate = async (req, res) => {
  try {
    const fuelStation = req.query.stationName;
    const vehicleType = req.query.vehicleType;
    const fuelType = req.query.fuelType;

    const date = getDate24hrsBack();
    const fuelStationId = await FuelStation.findOne(
      {
        name: fuelStation,
      },
      { _id: 1 }
    );
    const fuelQueue = await FuelQueue.find({
      fuelStation: mongoose.Types.ObjectId(fuelStationId),
      vehicleType,
      fuelTypeName: fuelType,
      arrivalTime: {
        $gte: date,
      },
    });
    res.status(200).json({
      fuelStationName: fuelStation,
      fuelType,
      vehicleType,
      customers: fuelQueue,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

function getDate24hrsBack() {
  var currentDateObj = new Date();
  var numberOfMlSeconds = currentDateObj.getTime();
  var substractMlSeconds = 60 * 60 * 1000 * 24;
  var newDateObj = new Date(numberOfMlSeconds - substractMlSeconds);
  return newDateObj;
}

async function getFuelStatus(fuelStation, fuelType) {
  try {
    const status = await FuelStatus.find(
      { fuelStation, fuelType },
      { status: 1 }
    );
    return status;
  } catch (error) {
    return error.error;
  }
}
