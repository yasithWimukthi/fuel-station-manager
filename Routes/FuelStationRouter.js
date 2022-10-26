const express = require("express");
const router = express.Router();
const {
  addFuelStation,
  addFuelStatusToFuelStation,
  getAllFuelStations,
  getFuelStationByOwner,
} = require("../controllers/FuelStationController");

router.route("/").get(getAllFuelStations).post(addFuelStation);
router.route("/owner").get(getFuelStationByOwner);
router.route("/addStatus/:id").post(addFuelStatusToFuelStation);

module.exports = router;
