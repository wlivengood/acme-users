var Sequelize = require('sequelize');
//don't hardcode use environment variables
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
		allowNull: false,
    defaultValue: false
	}
}, {
	classMethods: {
		createDepartment: function(name) {
      return Department.create({
        name: name
      });
		},
		getDefault: function() {
			return this.findOne({
				where: {
					isDefault: true
				}
			})
      .then(function(department){
        if(department)
          return department;
        return Department.create({
          name: 'Accounting',
          isDefault: true
        });
      });
		},
		setDefault: function(id) {
			return this.getDefault()
			.then(function(department) {
				department.isDefault = false;
				return department.save();
			})
			.then(function() {
				return Department.findById(id);
			})
			.then(function(newDefault) {
				newDefault.isDefault = true;
				return newDefault.save();
			});
		}
	}
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

User.belongsTo(Department);
Department.hasMany(User);

module.exports = {
	Department: Department,
	User: User
};
