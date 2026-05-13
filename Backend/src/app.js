const express = require("express")
const app = express();
const orderRoutes = require("./routes/order.routes");
const searchRoutes = require("./routes/search.routes");

app.use(express.json())

app.use("/api/v1/orders/search", searchRoutes);
app.use("/api/v1/orders", orderRoutes);

module.exports = app;