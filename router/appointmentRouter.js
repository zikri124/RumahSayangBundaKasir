const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");
const customerController = require("../controller/customerController")
const queryDb = require("../middleware/query");

router.get(
    "/",
    queryDb.getServicesAndAppointmentsData,
    appointmentController.viewAppointments
  );
  
  router.get(
    "/:timeCode",
    queryDb.getAppointmentsDataByTime,
    queryDb.getServicesData,
    appointmentController.viewAppointmentsByTime
  );
  
  router.get(
    "/update/:appId",
    queryDb.getSessions,
    queryDb.getServicesAndAppointmentsData,
    appointmentController.viewEditAppointment
  );
  
  router.post(
    "/update/:appId",
    appointmentController.editAppointment
  );
  
  router.post(
    "/process/:appId",
    queryDb.getAnAppointmentData,
    appointmentController.processAppointmentToVisit,
    appointmentController.updateAppointmentStatusTrue
  );

  router.post(
    "/process/:appId/newcustomer",
    queryDb.getAnAppointmentData,
    customerController.addCustomer,
    appointmentController.processAppointmentToVisit,
    appointmentController.updateAppointmentStatusTrue
  );
  
  router.post(
    "/cancel/:appId",
    appointmentController.cancelAppointmentAsAdmin
  );

  module.exports = router;
