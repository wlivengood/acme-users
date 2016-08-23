var express = require('express');
var router = express.Router();
var models = require('../db');
var Department = models.Department;
var User = models.User;
module.exports = router;

router.get('/:id', function(req, res, next) {
	var departments, def, employees;
	return Department.findAll()
	.then(function(results) {
		departments = results
		return Department.findOne({
			where: {
				id: req.params.id
			}
		})
	})
	.then(function(results) {
		department = results;
		return Department.getDefault();
	})
	.then(function(results) {
		def = results;
		return User.findAll({
			where: {
				departmentId: req.params.id
			}
		});
	})
	.then(function(results) {
		employees = results;
		res.render('departments', {departments: departments, department: department, def: def, employees: employees});
	})
	.catch(next);
});

router.post('/', function(req, res, next) {
	return Department.createDepartment(req.body.name)
	.then(function() {
		res.redirect('/');
	})
	.catch(next);
});

router.put('/:id', function(req, res, next) {
	return Department.setDefault(req.params.id)
	.then(function() {
		res.redirect('/');
	})
	.catch(next);
})

router.post('/:id/employees', function(req, res, next) {
	return User.create({
		name: req.body.name,
	})
	.then(function(user) {
		return user.setDepartment(req.params.id);
	})
	.then(function() {
		res.redirect('/');
	})
	.catch(next);
});


router.delete('/:departmentId/employees/:id', function(req, res, next) {
	return User.findById(req.params.id)
	.then(function(user) {
		return user.destroy();
	})
	.then(function() {
		res.redirect('/');
	})
	.catch(next);
});

router.put('/:departmentId/employees/:id', function(req, res, next) {
	return User.findById(req.params.id)
	.then(function(user) {
		return user.setDepartment(null);
	})
	.then(function() {
		res.redirect('/');
	})
	.catch(next);
})







