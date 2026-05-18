const express = require("express")
const app = express();
const orderRoutes = require("./routes/order.routes");
const searchRoutes = require("./routes/search.routes");
const filterRoutes = require("./routes/filter.routes");
const paginationRoutes = require("./routes/pagination.routes");
const sortRoutes = require("./routes/sort.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const statsRoutes = require("./routes/stats.routes");
const shippingRoutes = require("./routes/shipping.routes");
const authRoutes = require("./routes/auth.routes");
app.use(express.json())

app.use("/api/v1/orders/search", searchRoutes);
app.use("/api/v1/orders/filter", filterRoutes);
app.use("/api/v1/orders/sort", sortRoutes);
app.use("/api/v1/orders", paginationRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/shipping", shippingRoutes);
app.use("/api/v1/auth", authRoutes);

module.exports = app;