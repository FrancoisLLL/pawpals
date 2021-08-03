var express = require('express');
var router = express.Router();
const requireAuth = require("../middlewares/auth")

/* GET users listing. */
router.get('/', requireAuth, function (req, res, next) {
  res.render('home.hbs');
});



module.exports = router;
