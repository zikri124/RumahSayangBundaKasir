const express = require("express");
const router = express.Router();

const pageController = require("../controller/pageController");
const appointmentController = require("../controller/appointmentController");
const visitController = require("../controller/visitController");
const userController = require("../controller/userController");
const customerController = require("../controller/customerController");
const serviceController = require("../controller/serviceController");

const queryDb = require("../middleware/query");

router.get(
  "/",
  queryDb.getCustomersData,
  queryDb.getServicesData,
  pageController.viewAdminDashboard
);

router.get("/test", pageController.test);

//-------------------------------------------------------------
// USER
router.get("/user", queryDb.getUsersData, userController.viewUsers);

router.post("/user/new", userController.addUser);

router.post("/user/delete/:userId", userController.deleteUser);

//-------------------------------------------------------------
// APPOINTMENT
router.get(
  "/appointment",
  queryDb.getAppointmentsData
  //queryDb.getServicesData,
  //appointmentController.viewAppointments
);

router.get(
  "/appointment/:timeCode",
  queryDb.getAppointmentsDataByTime,
  queryDb.getServicesData,
  appointmentController.viewAppointmentsByTime
);

router.get(
  "/appointment/update/:appId",
  queryDb.getAppointmentsDataByDate,
  queryDb.getAnAppointmentData,
  queryDb.getServicesData,
  appointmentController.viewEditAppointment
);

router.post(
  "/appointment/update/:appId",
  appointmentController.editAppointment
);

router.get(
  "/appointment/process/:appId",
  queryDb.getCustomersData,
  queryDb.getServicesData,
  queryDb.getAnAppointmentData,
  appointmentController.viewProcessAppointment
);

router.post(
  "/appointment/process/:appId",
  queryDb.getAnAppointmentData,
  appointmentController.processAppointmentToVisit
);

router.post(
  "/appointment/cancel/:appId",
  appointmentController.cancelAppointmentAsAdmin
);

//-------------------------------------------------------------
// VISIT
router.get(
  "/visit",
  queryDb.getVisitsData,
  queryDb.getServicesData,
  queryDb.getCustomersData,
  visitController.viewVisits
);

router.get("/visit/cancel/:visitId", visitController.cancelVisit);

router.get(
  "/visit/finish/:visitId",
  queryDb.getAVisitData,
  visitController.viewFinishVisit
);

router.post(
  "/visit/finish/:visitId",
  queryDb.getAVisitData,
  visitController.finishVisit
); //s

//-------------------------------------------------------------
// CUSTOMER
router.get(
  "/customer",
  queryDb.getCustomersData,
  customerController.viewCustomers
);

router.get(
  "/customer/:customerId",
  queryDb.getServicesData,
  queryDb.getACustomerData,
  customerController.viewAnCustomer
);

router.post("/customer/new", customerController.addCustomer);

router.post("/customer/update/:customerId", customerController.updateCustomer);

router.post("/customer/delete/:customerId", customerController.deleteCustomer);

//-------------------------------------------------------------
// SERVICE
router.get("/service", queryDb.getServicesData, serviceController.viewServices);

router.post("/service/new", serviceController.addService);

router.post("/service/edit/:serviceId", serviceController.updateService);

router.post("/service/delete/:serviceId", serviceController.deleteService);

module.exports = router;
