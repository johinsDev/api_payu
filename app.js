var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var cors = require('cors')
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//validation
app.use(expressValidator());

//Session and cookie config
app.use(cookieParser('keyboard cat'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

var whitelist = ['http://localhost:8080', 'http://example2.com' , 'http://dev.mocionsoft.com']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));

var auth_middle = require('./middleware/Auth')

// dynamically include routes (Controller)
//'/var/www/html/clicApi/routes'
fs.readdirSync('./routes').forEach(function (file) {
  if(file.substr(-3) == '.js') {
    route = require('./routes/' + file);
    route.controller(app , require('./controllers/'+ file) , auth_middle);
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
