const mongoose = require("mongoose");

const { Schema } = mongoose;

const fuelStationSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    owner: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    petrolStatus: {
      type: String,
      trim: true,
    },
    petrolArrivalTime: {
      type: Date,
      trim: true,
    },
    petrolFinishedTime: {
      type: Date,
      trim: true,
    },
    dieselStatus: {
      type: String,
      trim: true,
    },
    dieselArrivalTime: {
      type: Date,
      trim: true,
    },
    dieselFinishedTime: {
      type: Date,
      trim: true,
    },
    gasolineStatus: {
      type: String,
      trim: true,
    },
    gasolineArrivalTime: {
      type: Date,
      trim: true,
    },
    gasolineFinishedTime: {
      type: Date,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelStation", fuelStationSchema);
