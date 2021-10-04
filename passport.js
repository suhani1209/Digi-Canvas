var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
    done(null, user);
  });
passport.use(new GoogleStrategy({
    clientID: '648067881591-1u671oc5380mk7ji4f3tf922ccp3vmfi.apps.googleusercontent.com',
    clientSecret: 'Ohzq-8V5SL9mN3MChRsnUudk',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
// passport.use(new GoogleStrategy({
//     clientID: '648067881591-1u671oc5380mk7ji4f3tf922ccp3vmfi.apps.googleusercontent.com',
//     clientSecret: 'Ohzq-8V5SL9mN3MChRsnUudk',
//     callbackURL: "https://limitless-cove-86738.herokuapp.com/auth/google/callback"
//   },
  function(accessToken, refreshToken, profile, done) {
    //    User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //      return done(err, user);
    //    });
    return done(null, profile);
  }
));