const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

dotenv.config();

const databaseConnection = require('./utils/db');
const User = require('./models/user');
const initializePassport = require('./utils/passport-config');

const app = express();

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

initializePassport(
  passport,
  email => User.findOne({ email }),
  id => User.findById(id)
)

app.get('/', checkAuntenticated, (req, res) => {
  res.render('app/index.ejs', { pageTitle: 'Home', name: req.user.name });
});

app.get('/login', checkNotAuntenticated, (req, res) => {
  res.render('app/login.ejs', { pageTitle: 'Log In' });
});

app.post('/login', checkNotAuntenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', checkNotAuntenticated, (req, res) => {
  res.render('app/register.ejs', { pageTitle: 'Register' });
});

app.post('/register', checkNotAuntenticated, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ email });
    if (user) {
      console.log('Email already exists')
      return res.redirect('/register');
    }
    user = new User(
      {
        name,
        email,
        password: hashedPassword
      }
    );
    await user.save()
    return res.redirect('/login');
  } catch(err) {
    console.log(err);
    res.redirect('/register');
  }
});

app.delete('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return err;
    }
    else res.redirect('/login');
  });
});

function checkAuntenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkNotAuntenticated(req, res, next) {
  if(req.isAuthenticated()){
    return res.redirect('/');
  }
  next();
}

databaseConnection.then(()=>{
  app.listen(process.env.PORT);
  console.log(`App listening at port ${process.env.PORT}`)
})
.catch((err) => console.log(err));

