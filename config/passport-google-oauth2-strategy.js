const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: '617617683547-dcnp8c67fs2mfpv6snsr81u9g2bps6qv.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const user = await User.findOne({email: profile.emails[0].value});
        if (user) {
            return done(null, user);
        } else {
            const user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            })
            return done(null, user);
        }
    } catch (err) {
        console.log('error --> passport-google-oauth2-strategy ', err);
    }
}))

module.exports = passport;