const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const { databaseConnection } = require('./utils/db');
const { User } = require('./models/user');

const app = express();

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('app/index.ejs', { pageTitle: 'Home' });
});

app.get('/login', (req, res) => {
  res.render('app/login.ejs', { pageTitle: 'Log In' });
});

app.post('/login', (req, res) => {
  console.log(req.body);
});

app.get('/register', (req, res) => {
  res.render('app/register.ejs', { pageTitle: 'Register' });
});

app.post('/register', async (req, res) => {
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

databaseConnection.then(()=>{
  app.listen(process.env.PORT);
  console.log(`App listening at port ${process.env.PORT}`)
})
.catch((err) => console.log(err));

