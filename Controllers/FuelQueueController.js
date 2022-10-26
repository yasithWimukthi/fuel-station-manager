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
  fuelQueue.arrivalTime = new Date();

  const newFuelQueue = new FuelQueue(fuelQueue);
  try {
    await newFuelQueue.save();
    res.status(201).json(newFuelQueue);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.exitBeforePump = async (req, res) => {
  let name = req.body.name;
  departTime = new Date();

  try {
    updatedQueue = await FuelQueue.findOneAndUpdate(
      { customerName: name },
      { departTime, status: "notPumped" }
    );
    res.status(201).json(updatedQueue);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.exitAfterPump = async (req, res) => {
  let name = req.body.name;
  departTime = new Date();

  try {
    updatedQueue = await FuelQueue.findOneAndUpdate(
      { customerName: name },
      { departTime, status: "pumped" }
    );
    res.status(201).json(updatedQueue);
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
    const fuelStatus = await getFuelStatus(fuelStationId, fuelType);

    const count = await FuelQueue.countDocuments({
      fuelStation: mongoose.Types.ObjectId(fuelStationId),
      vehicleType,
      fuelTypeName: fuelType,
      arrivalTime: {
        $gte: date,
      },
      status: "in",
    });

    res.status(200).json({
      fuelStationId: fuelStationId._id,
      fuelStationName: fuelStation,
      fuelType,
      vehicleType,
      fuelStatus,
      count,
      customers: fuelQueue,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//call this function to get date before 24hrs from now
function getDate24hrsBack() {
  var currentDateObj = new Date();
  var numberOfMlSeconds = currentDateObj.getTime();
  var substractMlSeconds = 60 * 60 * 1000 * 24;
  var newDateObj = new Date(numberOfMlSeconds - substractMlSeconds);
  return newDateObj;
}

//pass fuelStationId and the type to this function to get the fuel status
async function getFuelStatus(fuelStation, fuelType) {
  try {
    const fuelStatusObj = await FuelStatus.findOne({
      fuelStation: fuelStation,
      fuelTypeName: fuelType,
    });
    return fuelStatusObj.status;
  } catch (error) {
    return error.error;
  }
}
