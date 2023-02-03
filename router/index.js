const express = require("express");
const router = express.Router();

const {
  checkAuth
} = require("../middleware");

const authRouter = require("./authRouter");
const appointmentRouter = require("./appointmentRouter")
const customerRouter = require("./customerRouter")
const serviceRouter = require("./serviceRouter")
const visitRouter = require("./visitRouter")

const pageController = require("../controller/pageController")
const queryDb = require("../middleware/query");

router.get("/ping", (req, res) => {
  res.send("Web Online");
});

router.get(
  "/",
  checkAuth,
  queryDb.getServicesAndAppointmentsData,
  queryDb.getAppointmentsDataToday,
  queryDb.getCustomersData,
  pageController.viewAdminDashboard
);

router.get("/report", checkAuth, pageController.viewStatisticPage)

router.use("/auth", authRouter);

router.use("/appointment", checkAuth, appointmentRouter)

router.use("/customer", checkAuth, customerRouter)

router.use("/service", checkAuth, serviceRouter)

router.use("/visit", checkAuth, visitRouter);

module.exports = router;