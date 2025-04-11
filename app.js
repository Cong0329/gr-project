const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const db = require('./config/db_connect');
require('dotenv').config();
const passport = require('passport');
const { sequelize } = require('./models/user.model');
require('./config/passport');
db.connect();
const app = express();
app.use(cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/auth', require('./routes/auth.routes'));



sequelize.sync({ alter: true, force: true }) // tự động tạo/cập nhật bảng
  .then(() => console.log('✅ Database synced!'))
  .catch(err => console.error('❌ DB sync error:', err));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
