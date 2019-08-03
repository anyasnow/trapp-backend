require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('./routes/users');
const jobsRouter = require('./jobs/jobs-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use('/api/users', usersRouter);
// app.use('/api/jobs', jobsRouter);

/* Passport Setup */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("You have successfully logged in"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// /*  GITHUB AUTH  */

// const GitHubStrategy = require('passport-github').Strategy;

// const GITHUB_CLIENT_ID = "your app id"
// const GITHUB_CLIENT_SECRET = "your app secret";

// passport.use(new GitHubStrategy({
//     clientID: GITHUB_CLIENT_ID,
//     clientSecret: GITHUB_CLIENT_SECRET,
//     callbackURL: "/auth/github/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//       return cb(null, profile);
//   }
// ));

// app.get('/auth/github',
//   passport.authenticate('github'));

// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/error' }),
//   function(req, res) {
//     res.redirect('/success');
// });

// /* LINKEDIN AUTH */
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// passport.use(new LinkedInStrategy({
//   clientID: LINKEDIN_KEY,
//   clientSecret: LINKEDIN_SECRET,
//   callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
//   scope: ['r_emailaddress', 'r_basicprofile'],
//   state: true
// }, function(accessToken, refreshToken, profile, done) {
//   // asynchronous verification, for effect...
//   process.nextTick(function () {
//     // To keep the example simple, the user's LinkedIn profile is returned to
//     // represent the logged-in user. In a typical application, you would want
//     // to associate the LinkedIn account with a user record in your database,
//     // and return that user instead.
//     return done(null, profile);
//   });
// }));

// app.get('/auth/linkedin',
//   passport.authenticate('linkedin'),
//   function(req, res){
//     // The request will be redirected to LinkedIn for authentication, so this
//     // function will not be called.
//   });

// /* TWITTER AUTH */
// const TwitterStrategy = require('passport-twitter')
// passport.use(new TwitterStrategy({
//     consumerKey: TWITTER_CONSUMER_KEY,
//     consumerSecret: TWITTER_CONSUMER_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
//   },
//   function(token, tokenSecret, profile, cb) {
//     User.findOrCreate({ twitterId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// app.get('/auth/twitter',
//   passport.authenticate('twitter'));

// app.get('/auth/twitter/callback', 
//   passport.authenticate('twitter', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
