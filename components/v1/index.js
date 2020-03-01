const express = require('express');
const router = express.Router();

const search = require('./route_planner');

router.use('/directions', search);

module.exports = router;
