const express = require('express');
const router = express.Router();
const { Screenshot } = require('../middlewares/screenshotMiddleware');



router.get('/:website', Screenshot, function(req, res) { res.redirect(req.redirectUrl); });

module.exports = router;
