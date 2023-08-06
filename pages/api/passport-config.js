// passport-config.js
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
const base_url = "https://game-bazaar.vercel.app/";
//const base_url = 'http://localhost:3000/';
passport.use(
  new SteamStrategy(
    {
      returnURL: base_url,
      realm: base_url,
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
