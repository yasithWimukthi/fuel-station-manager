const express = require("express");
const router = express.Router();
const {
  addFuelStation,
  addFuelStatusToFuelStation,
  getAllFuelStations,
  getFuelStationByOwner,
  getFuelStation,
} = require("../controllers/FuelStationController");

router.route("/").get(getAllFuelStations).post(addFuelStation);
router.route("/single/:id").get(getFuelStation);
router.route("/owner").get(getFuelStationByOwner);
router.route("/addStatus/:id").post(addFuelStatusToFuelStation);

module.exports = router;
