require('dotenv').config();

const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');
const passport = require('passport');
const localStrategy = require('./configs/passport.config');
const flash = require('connect-flash');
const isUserLoggedIn = require('./middleware/authcheck.middleware').isUserLoggedIn;
const isUserAdmin = require('./middleware/authcheck.middleware').isUserAdmin;

require('./configs/db.config');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
require('./configs/session.config')(app);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./configs/serialize.config');
passport.use(localStrategy);

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Fantasy Celebrity Death Pool';

app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));
app.use('/', isUserLoggedIn, require('./routes/users.routes'));
app.use('/', isUserAdmin, require('./routes/admin.routes'));

console.log(Date());

module.exports = app;
