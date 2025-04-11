const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  // 👇 Đảm bảo function này là async (accessToken, refreshToken, profile, done)
  async (accessToken, refreshToken, profile, done) => {
    try {
      const { id, displayName, emails, photos, provider } = profile;

      let user = await User.findOne({
        where: { provider_id: id, provider }
      });

      

      if (!user) {
        user = await User.create({
          name: displayName,
          email: emails?.[0]?.value || '',
          avatar_url: photos?.[0]?.value || '',
          provider,
          provider_id: id
        });
      }

      return done(null, user); // ✅ phải gọi done khi thành công
    } catch (err) {
      return done(err, null); // ✅ gọi done(err) nếu có lỗi
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});
