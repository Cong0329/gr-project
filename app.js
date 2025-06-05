const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const passport = require('passport');
require('./config/passport');
require('./jods/orderCancelJob');



const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});


app.use(cors({
  origin: 'http://localhost:5173', // đúng địa chỉ frontend
  credentials: true               // cho phép gửi cookie
}));

app.use((req, res, next) => {
  req.io = io; // inject vào req
  next();
});
global.onlineUsers = new Map();


io.on('connection', (socket) => {
  console.log("Client connected");

  // Lấy userId từ FE truyền qua query
  const userId = socket.handshake.auth.userId;
  if (userId) {
    global.onlineUsers.set(userId.toString(), socket.id);
    socket.join(userId.toString());
    console.log(`User ${userId} online`);
  }


  socket.on("register-admin", () => {
    socket.join("admins");
    console.log("Admin joined room");
  });

  socket.on('join_room', (userJoin) => {
    socket.join(userJoin.toString());
    console.log(`User ${userJoin} manually joined room`);
  });

  socket.on('disconnect', () => {
    if (userId) {
      global.onlineUsers.delete(userId.toString());
      console.log(`User ${userId} offline`);
    } else {
      console.log("Client disconnected (no userId)");
    }
  });
});





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());


// Routers
app.use('/api/v1', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = { app, server, io };
