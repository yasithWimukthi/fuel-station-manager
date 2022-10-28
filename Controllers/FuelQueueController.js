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

  let existing = await FuelQueue.findOne({
    customerName: req.body.customerName,
  });
  console.log(existing);

  if (existing) {
    console.log("error");
    return res.status(200).json({ _id: "0" });
  }
  const newFuelQueue = new FuelQueue(fuelQueue);

  try {
    await newFuelQueue.save();
    res.status(201).json(newFuelQueue);
    console.log("succuss");
  } catch (error) {
    console.log("exception");
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
    const fuelQueue = await FuelQueue.aggregate([
      {
        $match: {
          fuelStation: mongoose.Types.ObjectId(fuelStationId),
          vehicleType,
          fuelTypeName: fuelType,
          arrivalTime: {
            $gte: date,
          },
        },
      },
      {
        $project: {
          arrivalTime: {
            $dateToString: {
              format: "%H:%M:%S",
              date: "$arrivalTime",
              timezone: "+05:30",
            },
          },
          departTime: {
            $dateToString: {
              format: "%H:%M:%S",
              date: "$departTime",
              timezone: "+05:30",
            },
          },
          fuelStation: 1,
          vehicleType: 1,
          fuelTypeName: 1,
          customerName: 1,
          status: 1,
        },
      },
    ]);

    const fuelStatus = await getFuelStatus(fuelStationId, fuelType);
    const fuelArrivalTime = await getArrivalFuelTimes(fuelStationId, fuelType);
    const fuelDepartureTime = await getDepartureFuelTimes(
      fuelStationId,
      fuelType
    );

    const count = await FuelQueue.countDocuments({
      fuelStation: mongoose.Types.ObjectId(fuelStationId),
      vehicleType,
      fuelTypeName: fuelType,
      arrivalTime: {
        $gte: date,
      },
      status: "in",
    });

    await res.status(200).json({
      fuelStationId: fuelStationId._id,
      fuelStationName: fuelStation,
      fuelType,
      vehicleType,
      fuelStatus,
      fuelArrivalTime,
      fuelDepartureTime,
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

//pass fuelStationId and the type to this function to get the fuel arrival times
async function getArrivalFuelTimes(fuelStation, fuelType) {
  try {
    const fuelStationObj = await FuelStation.findOne({
      _id: fuelStation,
    });
    console.log("hey");
    console.log(fuelType);

    if (fuelType == "Petrol") {
      return fuelStationObj.petrolArrivalTime
        .toISOString()
        .slice(0, 16)
        .replace(/T/g, " ");
    }
    if (fuelType == "Diesel") {
      return fuelStationObj.dieselArrivalTime
        .toISOString()
        .slice(0, 16)
        .replace(/T/g, " ");
    }
    if (fuelType == "Gasoline") {
      return fuelStationObj.gasolineArrivalTime
        .toISOString()
        .slice(0, 16)
        .replace(/T/g, " ");
    }
  } catch (error) {
    return error.error;
  }
}

//pass fuelStationId and the type to this function to get the fuel finishing times
async function getDepartureFuelTimes(fuelStation, fuelType) {
  try {
    const fuelStationObj = await FuelStation.findOne({
      _id: fuelStation,
    });

    if (fuelType == "Petrol") {
      return fuelStationObj.petrolFinishedTime
        .toISOString()
        .slice(0, 16)
        .replace(/T/g, " ");
    }
    if (fuelType == "Diesel") {
      return fuelStationObj.dieselFinishedTime
        .toISOString()
        .slice(0, 16)
        .replace(/T/g, " ");
    }
    if (fuelType == "Gasoline") {
      return fuelStationObj.gasolineFinishedTime
        .toISOString()
        .slice(0, 16)
        .replace(/T/g, " ");
    }
  } catch (error) {
    return error.error;
  }
}
