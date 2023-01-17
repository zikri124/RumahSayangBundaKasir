const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware");
const authController = require("../controller/authController");

// as admin
router.get("/signin", authController.viewLoginAdmin);

router.post("/signin", authController.processLoginAdmin);

// for all
router.get("/signout", authController.processLogout);

module.exports = router;
