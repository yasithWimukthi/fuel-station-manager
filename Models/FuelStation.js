const mongoose = require("mongoose");

const { Schema } = mongoose;

const fuelStationSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    // queue:[
    //     {
    //         type:Schema.Types.ObjectId,
    //         ref:'FuelQueue'
    //     }
    // ],
    // FuelType:[
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "FuelStatus"
    //     }
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelStation", fuelStationSchema);
