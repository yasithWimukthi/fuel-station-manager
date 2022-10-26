const express = require("express");
const router = express.Router();
const { addFueStatus } = require("../controllers/FuelStatusController");
const {updateFuelStatusByName} = require("../Controllers/FuelStatusController");

router.route("/").post(addFueStatus);
router.route("/update").post(updateFuelStatusByName);

module.exports = router;
