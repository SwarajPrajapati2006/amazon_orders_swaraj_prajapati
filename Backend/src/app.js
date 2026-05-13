const express = require("express")
const app = express();
const orderRoutes = require("./routes/order.routes");

app.use(express.json())

app.use("/api/v1/orders", orderRoutes);

module.exports = app;