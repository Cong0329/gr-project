const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const db = require('./config/db_connect');
require('dotenv').config();
const passport = require('passport');
const { sequelize } = require('./models');
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
app.use('/api/v1/user', require('./routes/user.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/doctor', require('./routes/doctor.routes'));
app.use('/api/v1/department', require('./routes/department.routes'));
app.use('/api/v1/schedule', require('./routes/schedule.routes'));




// Sync database tự động cập nhật schema mà không mất dữ liệu
sequelize.sync({ alter: false })
  .then(() => console.log('✅ DB synced (altered without data loss)'))
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
