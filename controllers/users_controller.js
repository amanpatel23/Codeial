
const User = require('../models/user');

module.exports.profile = function(req, res) {
    return res.render('user_profile', {
        title: 'user profile'
    });
}

// render the sign up page
module.exports.signUp = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    })
}

// render the sign in page
module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title:  'Codeial | Sign In'
    })
}

// get the sign up data
module.exports.create = async function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            try {
                await User.create(req.body);
                return res.redirect('/users/sign-in');
            }
            catch(err) {
                console.log('error in creating user while signing up ', err);
            }
        } else {
            return res.redirect('back');
        }
    }
    catch(err) {
        console.log('error in searching for user in database ', err);
    }
}

// sign in and create a session for the user
module.exports.createSession = function(req, res) {
    return res.redirect('/');
}

// sign out and destroy the session for the user
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.log('Error while logging out, ', err);
            return;
        }
        return res.redirect('/');
    })
}