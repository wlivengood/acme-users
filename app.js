var express = require('express');
var swig = require('swig');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var models = require('./db');
var Department = models.Department;
var User = models.User;

var app = express();
var departmentsRouter = require('./routes/departments');
var customersRouter = require('./routes/customers');

app.engine('html', swig.renderFile);
swig.setDefaults({ cache: false });
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(morgan('dev'));
app.use(methodOverride('method'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/departments', departmentsRouter);
app.use('/customers', customersRouter);

app.get('/', function(req, res, next) {
	return Department.getDefault()
	.then(function(department) {
		res.render('index', {def: department});
	})
	.catch(next)
});

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send(err.message);
});

Department.sync()
    .then(function () {
        return User.sync();
    })
    .then(function () {
        app.listen(3001, function () {
            console.log('Server is listening on port 3001!');
        });
    });