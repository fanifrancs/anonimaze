const express  = require('express'),
bodyParser     = require('body-parser'),
mongoose       = require('mongoose'),
passport       = require('passport'),
flash          = require('connect-flash'),
LocalStrategy  = require('passport-local'),
Message        = require('./models/message'),
User           = require('./models/user'),
app            = express();

require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.db_URI);
        console.log('connected to DB');
    } catch {
        err => console.log(err, 'DB connection went wrong');
    }
}

// configs
app.use(express.static('public'));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'Hello World',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

// root route
app.get('/', isAuthorized, (req, res) => {
    res.render('index');
});

// contact
app.get('/contact', (req, res) => {
    res.render('contact');
});

// register routes
app.get('/register', isAuthorized, (req, res) => {
    res.render('register');
});

app.post('/register', isAuthorized, (req, res) => {
    const newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Hello ${user.username}. Welcome to Anonimaze`);
            res.redirect('/auth');
        });
    });
});

// login routes
app.get('/login', isAuthorized, (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local',
    {
       successRedirect : '/auth',
       failureRedirect : '/loginerr', 
    })
);

app.get('/loginerr', isAuthorized, (req, res) => {
    req.flash('error', 'Wrong username or password');
    res.redirect('login');
});

app.get('/auth', (req, res) => {
    res.render('auth');
});

// logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success', 'You logged out');
        res.redirect('/login');
    });
});

// dashboard route
app.get('/messages/:user', isLoggedIn, (req, res) => {
    User.findOne({username: req.params.user}, (err, user) => {
        if (err || user === null) {
            res.render('error');
        } else {
            res.render('show', {user: user});
        }
    })
});

// message routes
app.get('/:user/message', (req, res) => {
    User.findOne({username: req.params.user}, (err, user) => {
        if (err || user === null) {
            res.render('error');
        } else {
            res.render('send', {user: user});
        }
    })
});

app.post('/:user/message', (req, res) => {
    User.findOne({username: req.params.user}, (err, user) => {
        if (err || user === null) {
            res.render('error');
        } else {
            user.messages.push(req.body.message);
            user.save((err, user) => {
                if (err) {
                    return res.render('error');
                }
            });
            res.render('sent');
        }
    })
});
// end of route handlers

// middlewares
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash('error', 'Please login first');
    res.redirect('/login');
}

function isAuthorized(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/messages/' + req.user.username);
    }; next();
}

// fire up server
app.listen(process.env.PORT || 3500, process.env.IP, () => {
    connectDB();
    console.log('server started || 3500');
});