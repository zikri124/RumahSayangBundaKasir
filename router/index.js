const express = require("express");
const router = express.Router();

const { checkAuth } = require("../middleware");

const authRouter = require("./authRouter");
const adminRouter = require("./adminRouter");

router.get("/ping", (req, res) => {
  res.send("Web Online");
});

router.use("/auth", authRouter);

router.use("/", checkAuth, adminRouter);

module.exports = router;
