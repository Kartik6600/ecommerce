import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/user/auth/google/callback`,
    passReqToCallback: true 
},
async (req, accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOne({ 
            $or: [
                { email: profile.emails[0].value },
                { googleId: profile.id }
            ]
        });
        if (!user) {
            user = new userModel({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                isVerified: true,
                loginCount: 1
            });
            await user.save();
        } else {
            user.loginCount += 1;
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
export default passport;