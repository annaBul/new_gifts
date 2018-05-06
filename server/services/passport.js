var config  = require('../config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;;
//var UserModel  = require('../models').UserModel;

var db = require('../db');
var User = require('../classes/user');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function (username, password, done) {
    db.getUserByLogin(username, (err, user) => {
      if (err) {
        return done(err);
      }      
      if (!user) {
        return done(null, false, {message: 'Unknown user or incorrected password'});
      }
      if (!user.checkPassword(password)) {
        return done(null, false, {message: 'Unknown user or incorrected password'});
      }
      return done(null, user);
    })
  }
));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.security.secret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {  
    db.getUserById(payload.id, (err, user) => {
      if (err) {
        return done(err)
      }      
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    });
  })
)


passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function (data, done) {
  try {
      done(null, JSON.parse(data));
  } catch (e) {
      done(err)
  }
});

module.exports = passport;