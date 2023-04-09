const express = require('express');

const router = express.Router();

const home_controller = require('../controllers/home_controller');

router.get('/', home_controller.home);
router.use('/users', require('./users'));

// for any further routes, access from here
// router.use('/routerName', require('./routerFile'));


module.exports = router;