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
    "/time/:timeCode",
    queryDb.getAppointmentsDataByTime,
    queryDb.getServicesData,
    appointmentController.viewAppointmentsByTime
  );

  router.get(
    "/new",
    queryDb.getSessionAndTime,
    queryDb.getServicesData,
    queryDb.getOnGoingVisitsData,
    appointmentController.viewAddAppointment
  )

  router.post(
    "/new",
    appointmentController.addAppointment
  )
  
  router.get(
    "/update/:appId",
    queryDb.getSessionAndTime,
    queryDb.getServicesAndAppointmentsData,
    appointmentController.viewEditAppointment
  );
  
  router.post(
    "/update/:appId",
    appointmentController.editAppointment
  );
  
  router.post(
    "/process/:appId",
    appointmentController.createVisit,
    appointmentController.updateAppointmentStatusTrue
  );

  router.post(
    "/process/:appId/newcustomer",
    queryDb.isCustomerExist,
    customerController.addCustomer,
    appointmentController.createVisit,
    appointmentController.updateAppointmentStatusTrue
  );
  
  router.post(
    "/cancel/:appId",
    appointmentController.cancelAppointmentAsAdmin
  );

  module.exports = router;
