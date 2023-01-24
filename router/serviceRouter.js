const express = require("express");
const router = express.Router();
const serviceController = require("../controller/serviceController");
const queryDb = require("../middleware/query");

router.get("/", queryDb.getServicesData, serviceController.viewServices);

router.post("/new", serviceController.addService);

router.post("/edit/:serviceId", serviceController.updateService);

router.post("/delete/:serviceId", serviceController.deleteService);

module.exports = router;