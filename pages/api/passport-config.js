// passport-config.js
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: 'http://localhost:3000/',
      realm: 'http://localhost:3000/',
      //apiKey: process.env.STEAM_API_KEY,
    },
    (identifier, profile, done) => {
      process.nextTick(() => {
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

module.exports = passport;
