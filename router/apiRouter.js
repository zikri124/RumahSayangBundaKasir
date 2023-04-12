const express = require("express");
const router = express.Router();
const queryDb = require("../middleware/query");

router.get("/visit", queryDb.getOnGoingVisitsData, function (req, res) {
    const onGoingVisits = req.onGoingVisits
    return res.json({
        onGoingVisits: onGoingVisits
    })
})

module.exports = router;