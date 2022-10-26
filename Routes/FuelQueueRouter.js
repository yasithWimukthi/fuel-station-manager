const express = require("express");
const router = express.Router();
const {
  addFuelQueue,
  updateFuelQueueStatusByCustomerName,
  getFuelQueueByStationName,
  getFuelQueueByStationNameAndVehicleType,
  getFuelQueueByStationNameAndVehicleTypeAndDate,
  exitAfterPump,
  exitBeforePump,
} = require("../controllers/FuelQueueController");

router.route("/").post(addFuelQueue);
router.route("/exitAfterPump").post(exitAfterPump);
router.route("/exitBeforePump").post(exitBeforePump);

router
  .route("/updateFuelQueueStatusByCustomerName")
  .put(updateFuelQueueStatusByCustomerName);
router.route("/getFuelQueueByStationName").get(getFuelQueueByStationName);
router
  .route("/getFuelQueueByStationNameAndVehicleType")
  .get(getFuelQueueByStationNameAndVehicleType);
router.route("/getQueue").get(getFuelQueueByStationNameAndVehicleTypeAndDate);

module.exports = router;
