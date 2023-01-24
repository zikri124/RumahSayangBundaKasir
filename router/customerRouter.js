const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
const queryDb = require("../middleware/query");

router.get(
    "/",
    queryDb.getCustomersData,
    customerController.viewCustomers
);

router.get(
    "/:customerId",
    queryDb.getACustomerData,
    queryDb.getVisitsDataByCustomer,
    queryDb.getServicesData,
    customerController.viewAnCustomer
);

router.post("/new", customerController.addCustomer);

router.post("/update/:customerId", customerController.updateCustomer);

router.post("/delete/:customerId", customerController.deleteCustomer);

module.exports = router;