var express = require('express');
var router = express.Router();
var models = require('../db');
var Department = models.Department;
var User = models.User;
module.exports = router;

router.get('/', function(req, res, next) {
	var def;
	return Department.getDefault()
	.then(function(defaultDepartment) {
		def = defaultDepartment;
		return User.findAll({
			where: {
				departmentId: null
			}
		})
	})
	.then(function(customers) {
		res.render('customers', {customers: customers, def: def})
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
	var def;
	return Department.getDefault()
	.then(function(defaultDepartment) {
		def = defaultDepartment;
		return User.findById(req.params.id);
	})
	.then(function(user) {
		return user.setDepartment(def.id);
	})
	.then(function() {
		res.redirect('/departments/' + def.id);
	})
	.catch(next);
});




