require('dotenv').config();

const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
// const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport = require('passport');
const localStrategy = require('./configs/passport.config');
const flash = require('connect-flash');
const authCheck = require('./middleware/authcheck.middleware');

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
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Fantasy Celebrity Death Pool';

app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));
app.use('/', authCheck, require('./routes/users.routes'));

console.log(Date());

module.exports = app;
