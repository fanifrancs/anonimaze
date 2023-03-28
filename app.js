const express  = require('express'),
path           = require('path'),
mongoose       = require('mongoose'),
passport       = require('passport'),
flash          = require('connect-flash'),
LocalStrategy  = require('passport-local'),
User           = require('./models/user'),
dotenv         = require('dotenv');

const
port = 3500,
app  = express();

// server configs
dotenv.config();
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false
}))

// view engine
app.set('view engine', 'ejs');

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

// mongoose
mongoose.set('strictQuery', false);

// connect db
function connectDB() {
    mongoose.connect(process.env['db_URI'], {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
}

// fire up server
app.listen(process.env.PORT || port, process.env.IP, () => {
    connectDB();
    console.log('server started at ' + port);
})
