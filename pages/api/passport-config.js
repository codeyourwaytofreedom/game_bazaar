// passport-config.js
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const base_url = process.env.NODE_ENV === "development" ? 'http://localhost:3000/' : "https://game-bazaar.vercel.app/";

passport.use(
  new SteamStrategy(
    {
      returnURL: base_url,
      realm: base_url,
      apiKey: process.env.STEAM,
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
