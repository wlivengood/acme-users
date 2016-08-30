var express = require('express');
var router = express.Router();
var models = require('../db');
var Department = models.Department;
var User = models.User;
var Promise = require('bluebird');
module.exports = router;

router.get('/', function(req, res, next) {
	Promise.all([
      Department.getDefault(),
      User.findAll({ where: { departmentId: null } })
  ])
	.spread(function(def, customers) {
		res.render('customers', {customers: customers, def: def, title: "customers"});
	})
	.catch(next);
});

router.post('/', function(req, res, next) {
	return User.create({
		name: req.body.name
	})
	.then(function() {
		res.redirect('/customers');
	})
	.catch(next);
});

router.delete('/:id', function(req, res, next) {
	return User.findById(req.params.id)
	.then(function(user) {
		return user.destroy();
	})
	.then(function() {
		res.redirect('/customers');
	})
	.catch(next);
});

router.put('/:id', function(req, res, next) {
  Promise.all([
      Department.getDefault(),
      User.findById(req.params.id)
  ])
  .spread(function(defaultDepartment, user){
    return user.setDepartment(defaultDepartment.id);
  })
	.then(function(user) {
		res.redirect('/departments/' + user.departmentId);
	})
	.catch(next);
});




