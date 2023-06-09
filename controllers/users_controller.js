
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res) {
    try {
        const user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: 'user profile',
            profile_user: user
        });
    }catch (err) {
        console.log('error while finding the user --> users__controller ', err);
    }
}

module.exports.update = async function(req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                 if (err) {
                    console.log('***multer error*** ', err);
                 }
                 user.name = req.body.name;
                 user.email = req.body.email;

                 if (req.file) {

                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                 }

                 user.save();
                 return res.redirect('back');
            })
        }
        catch (err) {
            console.log('error while updating the user --> users_controller ', err);
        }
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
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
    req.flash('success', 'Logged in Succesfully');
    return res.redirect('/');
}

// sign out and destroy the session for the user
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.log('Error while logging out, ', err);
            return;
        }
        req.flash('success', 'You have logged out');
        return res.redirect('/');
    })
}