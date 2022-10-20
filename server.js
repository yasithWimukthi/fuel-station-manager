const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// const authRoutes = require('./routes/authRoutes');
// const BookingHistory = require('./routes/Reservations');
// const movieBookingRoutes = require("./routes/MovieBooking");
require("dotenv").config();

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use('/api/auth', authRoutes);
// app.use("/api/cart", movieBookingRoutes);
// app.use('/api/reservations', BookingHistory)

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Route files
const fuelStations = require("./routes/FuelStationRouter");
const fuelQueues = require("./routes/FuelQueueRouter");

// Mount routers
app.use("/api/v1/fuelStations", fuelStations);
app.use("/api/v1/fuelQueues", fuelQueues);

mongoose
  .connect(process.env.CONNECTION_URL)
  .then((result) => {
    const server = app.listen(process.env.PORT || 4001);
    console.log(`Server started on port ${server.address().port}`);
  })
  .catch((err) => console.log(err));
