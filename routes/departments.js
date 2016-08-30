var express = require('express');
var router = express.Router();
var models = require('../db');
var Department = models.Department;
var User = models.User;
var Promise = require('bluebird');
module.exports = router;

router.get('/:id', function(req, res, next) {
  Promise.all([
      Department.findAll(),
      Department.findById(req.params.id, { include: [ User ] }),
      Department.getDefault()
  ])
	.spread(function( departments, department, defaultDepartment) {
		res.render('departments', {
			departments: departments, department: department, def: defaultDepartment, employees: department.users, title: department.name + " Department"});
	})
	.catch(next);
});

router.post('/', function(req, res, next) {
	Department.createDepartment(req.body.name)
	.then(function(department) {
		res.redirect('/departments/' + department.id);
	})
	.catch(next);
});

router.put('/:id', function(req, res, next) {
	Department.setDefault(req.params.id)
	.then(function() {
		res.redirect('/departments/' + req.params.id);
	})
	.catch(next);
});

router.post('/:id/employees', function(req, res, next) {
	User.create({
		name: req.body.name,
	})
	.then(function(user) {
		return user.setDepartment(req.params.id);
	})
	.then(function() {
		res.redirect('/departments/' + req.params.id);
	})
	.catch(next);
});


router.delete('/:departmentId/employees/:id', function(req, res, next) {
	User.findById(req.params.id)
	.then(function(user) {
		return user.destroy();
	})
	.then(function() {
		res.redirect('/departments/' + req.params.departmentId);
	})
	.catch(next);
});

router.put('/:departmentId/employees/:id', function(req, res, next) {
	User.findById(req.params.id)
	.then(function(user) {
		return user.setDepartment(null);
	})
	.then(function() {
		res.redirect('/customers');
	})
	.catch(next);
});
