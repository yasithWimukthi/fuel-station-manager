const express = require("express");
const router = express.Router();
const {
  addFuelQueue,
  updateFuelQueueStatusByCustomerName,
  getFuelQueueByStationName,
  getFuelQueueByStationNameAndVehicleType,
  getFuelQueueByStationNameAndVehicleTypeAndDate,
} = require("../controllers/FuelQueueController");

router.route("/").post(addFuelQueue);
router
  .route("/updateFuelQueueStatusByCustomerName")
  .put(updateFuelQueueStatusByCustomerName);
router.route("/getFuelQueueByStationName").get(getFuelQueueByStationName);
router
  .route("/getFuelQueueByStationNameAndVehicleType")
  .get(getFuelQueueByStationNameAndVehicleType);
router.route("/getQueue").get(getFuelQueueByStationNameAndVehicleTypeAndDate);

module.exports = router;
