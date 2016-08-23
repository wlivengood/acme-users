var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/acme_users', {
	logging: false
});

var Department = db.define('department', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	isDefault: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	}
}, {
	classMethods: {
		createDepartment: function(name) {
			var defExists;
			return Department.getDefault()
			.then(function(def) {
				if (def === null) {
					defExists = false;
				}
				else
					defExists = true;
			})
			.then(function() {
				return Department.create({
					name: name,
					isDefault: !defExists
				});
			})
		},
		getDefault: function() {
			return this.findOne({
				where: {
					isDefault: true
				}
			})
		},
		setDefault: function(id) {
			return this.getDefault()
			.then(function(oldDefault) {
				oldDefault.isDefault = false;
				return oldDefault.save();
			})
			.then(function() {
				return this.findById(id);
			})
			.then(function(newDefault) {
				newDefault.isDefault = true;
				return newDefault.save();
			})
		}
	}
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

User.belongsTo(Department, {as: "department"});

module.exports = {
	Department: Department,
	User: User
}