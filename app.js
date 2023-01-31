const express  = require('express'),
bodyParser     = require('body-parser'),
mongoose       = require('mongoose'),
passport       = require('passport'),
flash          = require('connect-flash'),
LocalStrategy  = require('passport-local'),
User           = require('./models/user'),
dotenv         = require('dotenv'),
app            = express();

// server configs
dotenv.config();
app.use(express.static('public'));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'Hello World',
    resave: false,
    saveUninitialized: false
}))

// passport configs
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

// routes
app.use(require('./routes/index'));
app.use(require('./routes/register'));
app.use(require('./routes/login'));
app.use(require('./routes/message'));
app.use(require('./routes/logout'));
app.use(require('./routes/contact'));

// fire up server
app.listen(process.env.PORT || 3500, process.env.IP, () => {
    mongoose.connect(process.env['db_URI']);
    console.log('server started at 3500');
})
