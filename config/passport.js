var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = require('../models/user');
require ('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile.photos[0].value)
   User.findOne({'googleId': profile.id}, function(err, user) {
    if (err) return cb(err);
    if (user) {
      return cb(null, user);
    } else {
      var newUser = new User({
        fullName:   profile.displayName,
        firstName:  profile.name.givenName,
        imageUrl:   profile.photos[0].value,
        email:      profile.emails[0].value,
        googleId:   profile.id
      });
      newUser.save(function(err){
        if (err) return cb(err);
        return cb(null, newUser);
      });
    }
   });
    return cb(null, null)
  }
));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
