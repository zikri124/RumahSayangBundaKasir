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

router.post("/new",
    queryDb.isCustomerExist,
    customerController.addCustomer,
    function (req, res) {
        return res.status(200).redirect("/");
    }
);

router.post("/update/:customerId", queryDb.isCustomerExist, queryDb.getACustomerData, customerController.updateCustomer);

router.post("/delete/:customerId", customerController.deleteCustomer);

module.exports = router;
