var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/partials/:app/:page', function(req, res) {
  var page = req.params.page;
  page = page.substring(0, page.lastIndexOf('.'));
  res.render('partials/' + req.params.app + '/' + page);
});

module.exports = router;
