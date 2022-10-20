const mongoose = require("mongoose");

const { Schema } = mongoose;

const fuelStatusSchema = new Schema(
  {
    fuelStation: {
      type: Schema.Types.ObjectId,
      ref: "FuelStation",
    },
    fuelTypeName: {
      type: String,
      trim: true,
      required: true,
    },
    arrivalTime: {
      type: Date,
      trim: true,
      required: true,
    },
    finishedTime: {
      type: Date,
      trim: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelStatus", fuelStatusSchema);
