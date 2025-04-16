const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/user', require('./user.routes'));
router.use('/address', require('./address.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/doctor', require('./doctor.routes'));
router.use('/schedule', require('./schedule.routes'));
router.use('/department', require('./department.routes'));
router.use('/brand', require('./brand.routes'));
router.use('/origin', require('./origin.routes'));
router.use('/category', require('./category.routes'));
router.use('/country', require('./country.routes'));
router.use('/indication', require('./indication.routes'));
router.use('/service-pkg', require('./service_pkg.routes'));
router.use('/service-item', require('./service_item.routes'));
router.use('/service-category', require('./service_category.routes'));

module.exports = router;
