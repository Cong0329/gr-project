const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
require('dotenv').config(); 
const cloudinary = require('../utils/cloudinary');

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
        let avatar_url = '';

        if (photos?.[0]?.value) {
          try {
            // 👇 Upload ảnh từ URL Google lên Cloudinary
            const uploadRes = await cloudinary.uploader.upload(photos[0].value, {
              folder: 'avatars', // Tùy chọn: lưu vào thư mục 'avatars'
              fetch_format: 'auto',
              crop: 'scale'
            });
            avatar_url = uploadRes.secure_url;
          } catch (uploadErr) {
            console.error('❌ Lỗi upload avatar lên Cloudinary:', uploadErr);
          }
        }

        user = await User.create({
          name: displayName,
          email: emails?.[0]?.value || '',
          avatar_url,
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
