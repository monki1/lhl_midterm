// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  secret: 'everything-everywhere-all-at-once'
}));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users/users');
const chapterRoutes = require('./routes/chapters/chapters-api');
const storyRoutes = require('./routes/stories/stories-api');
const voteRoutes = require('./routes/votes/votes-api');

const storiesIndexHandler = require('./routes/pages/storiesIndex');
const loginHandler = require('./routes/pages/login');
const registerHandler = require('./routes/pages/register');
const logoutGetHandler = require('./routes/pages/logoutGet');
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/', usersRoutes);
app.use('/chapters', chapterRoutes);
app.use('/stories', storyRoutes);
app.use('/votes', voteRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', storiesIndexHandler);
app.get('/login', loginHandler.get);
app.post('/login', loginHandler.post);
app.get('/register', registerHandler.get);
app.post('/register', registerHandler.post);
app.get('/logout', logoutGetHandler);

//dummy routes to style
app.get('/stories', (req, res) => {
  res.render('stories_show');
});

app.get('/create', (req, res) => {
  res.render('stories_create');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/mystories', (req, res) => {
  res.render('my_stories');
});

//end of dummy routes

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
