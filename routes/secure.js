var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


/* GET secure page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('secure', { title: 'Secure Page !' });
});

module.exports = router;
