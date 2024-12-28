import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import { User } from '../schemas/userSchema.js';
import express from 'express';

export const authRouter = express.Router();

passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile', 'email' ]
  }, function verify(issuer, profile, cb) {
    console.log(profile);
    const user = {id: profile.id, displayName: profile.displayName};
    return cb(null, user);
  }));

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.displayName });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

authRouter.get('/federated/google', passport.authenticate('google'));

authRouter.get('/redirect/google', passport.authenticate('google', {
    successRedirect: '/users/profile',
    failureRedirect: '/login'
}));