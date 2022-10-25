const express = require("express");
const router = express.Router();
const { addFueStatus } = require("../controllers/FuelStatusController");

router.route("/").post(addFueStatus);

module.exports = router;
