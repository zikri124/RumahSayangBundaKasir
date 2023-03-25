const express = require("express");
const router = express.Router();
const visitController = require("../controller/visitController");
const customerController = require("../controller/customerController");
const appointmentController = require("../controller/appointmentController");
const queryDb = require("../middleware/query");

router.get(
    "/",
    queryDb.getVisitsData,
    queryDb.getCustomersData,
    queryDb.getServicesData,
    visitController.viewVisits
);

router.get("/cancel/:visitId", visitController.cancelVisit);

router.get(
    "/finish/:visitId",
    queryDb.getAVisitData,
    visitController.viewFinishVisit
);

router.get("/new/form1", visitController.createVisitForm1)

router.post(
    "/new",
    customerController.addCustomer,
    visitController.createVisitFromNewUser,
    appointmentController.processAppointmentToVisit,
    function () {
        return res.render("admin/successProcessApp")
    }
)

router.post(
    "/finish/:visitId",
    queryDb.getAVisitData,
    visitController.finishVisit
);

module.exports = router;