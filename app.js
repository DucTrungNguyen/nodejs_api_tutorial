const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const bodyParser = require('body-parse');
const mongoose = require('mongoose')
const dotenv = require('dotenv/config');



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');

const app = express();


mongoose.connect('mongodb+srv://admin:'+
    process.env.PASS_MONGOOSE+
    '@nodejs-mi9lm.gcp.mongodb.net/test?retryWrites=true&w=majority',
{

  useNewUrlParser : true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(bodyParser.urlencoded({extended :false}));
// app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter)
app.use('/orders', orderRouter);


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if ( req.method == "OPTIONS"){
    res.header('Access-Control-Allow-Headers', 'PUT, GET, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
});

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
  res.render('error');
});

module.exports = app;
