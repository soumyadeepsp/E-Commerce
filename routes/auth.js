import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import { User } from '../schemas/userSchema.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const authRouter = express.Router();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
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
    failureRedirect: '/users/login'
}));