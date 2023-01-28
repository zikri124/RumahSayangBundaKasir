const express = require("express");
const router = express.Router();
const visitController = require("../controller/visitController");
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

router.post(
    "/finish/:visitId",
    queryDb.getAVisitData,
    visitController.finishVisit
);

module.exports = router;