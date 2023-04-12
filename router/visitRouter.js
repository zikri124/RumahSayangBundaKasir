const express = require("express");
const router = express.Router();
const visitController = require("../controller/visitController");
const customerController = require("../controller/customerController");
const appointmentController = require("../controller/appointmentController");
const queryDb = require("../middleware/query");

router.get("/",
    queryDb.getVisitsData,
    queryDb.getCustomersData,
    queryDb.getServicesData,
    visitController.viewVisits
);

router.post("/cancel/:visitId", visitController.cancelVisit);

router.get("/finish/:visitId", queryDb.getAVisitData, visitController.viewFinishVisit);

router.get("/new/form1",
    queryDb.getServicesData,
    queryDb.getSessionAndTime,
    queryDb.getCustomersData,
    visitController.createVisitForm1
);

router.post(
    "/new",
    appointmentController.processAppointmentToVisit,
    function (req, res) {
        return res.render("admin/successProcessApp")
    }
);

router.post(
    "/new/newcustomer",
    queryDb.isCustomerExist,
    customerController.addCustomer,
    appointmentController.processAppointmentToVisit,
    function (req, res) {
        return res.render("admin/successProcessApp")
    }
);

router.post("/finish/:visitId", queryDb.getAVisitData, visitController.finishVisit);

module.exports = router;
