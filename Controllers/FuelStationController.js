const FuelStation = require("../Models/FuelStation");
const FuelStatus = require("../Models/FuelStatus");

/**
 * @description - This function is used to create a new fuel station document
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.addFuelStation = async (req, res) => {
  const fuelStation = req.body;
  const newFuelStation = new FuelStation(fuelStation);
  try {
    await newFuelStation.save();
    res.status(201).json(newFuelStation);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * @description - This function is used to get all the fuel stations by owner name
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getFuelStationByOwner = async (req, res) => {
  const owner = req.query.owner;
  try {
    const fuelStation = await FuelStation.find({ owner: owner });
    res.status(200).json(fuelStation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @description - This function is used to add fuel status to the fuel station
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.addFuelStatusToFuelStation = async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const stationObj = body;

  if (stationObj.petrolArrivalTime) {
    stationObj.petrolArrivalTime = convertToJsDate(
      stationObj.petrolArrivalTime
    );
  }
  if (stationObj.petrolFinishedTime) {
    stationObj.petrolFinishedTime = convertToJsDate(
      stationObj.petrolFinishedTime
    );
  }

  if (stationObj.dieselArrivalTime) {
    stationObj.dieselArrivalTime = convertToJsDate(
      stationObj.dieselArrivalTime
    );
  }

  if (stationObj.dieselFinishedTime) {
    stationObj.dieselFinishedTime = convertToJsDate(
      stationObj.dieselFinishedTime
    );
  }

  if (stationObj.gasolineArrivalTime) {
    stationObj.gasolineArrivalTime = convertToJsDate(
      stationObj.gasolineArrivalTime
    );
  }

  if (stationObj.gasolineFinishedTime) {
    stationObj.gasolineFinishedTime = convertToJsDate(
      stationObj.gasolineFinishedTime
    );
  }

  try {
    console.log(stationObj);
    const newFuelStatus = await FuelStation.findByIdAndUpdate(
      { _id },
      stationObj
    );
    res.status(201).json(newFuelStatus);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * @description - This function is used to get the fuel station details
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getAllFuelStations = async (req, res) => {
  try {
    const fuelStation = await FuelStation.find();
    res.status(200).json(fuelStation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

function convertToJsDate(javaDate) {
  const dateArr = javaDate.split(" ");
  const convertedDate = "20" + dateArr[0] + "T" + dateArr[1];
  return convertedDate;
}
