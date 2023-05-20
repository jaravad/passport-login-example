const express = require('express');

const app = express();

app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
  res.render('app/index.ejs', { pageTitle: 'Home' });
});

app.get('/login', (req, res) => {
  res.render('app/login.ejs', { pageTitle: 'Log In' });
});

app.get('/register', (req, res) => {
  res.render('app/register.ejs', { pageTitle: 'Register' });
});

app.listen(3000);