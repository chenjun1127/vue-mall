var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var categories = require('./routes/categories');
var products = require('./routes/products');
var shippingAddress = require('./routes/shippingAddress');
var order = require('./routes/order');

var app = express();

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://localhost/shop-mall';
mongoose.connect(dbUrl);
mongoose.connection.on('connected',()=>{
    console.log("MongoDB connected success.");
});
mongoose.connection.on('error',()=>{
    console.log("MongoDB connected fail.");
});
mongoose.connection.on('disconnected',()=>{
    console.log("MongoDB connected disconnected.");
});

app.use(session({
    secret: 'mall',
    name: 'login-user', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 5
    }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/categories', categories);
app.use('/products',products);
app.use('/shippingAddress',shippingAddress);
app.use('/order',order);
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
