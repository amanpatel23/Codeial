
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 1);

    try {
        // populate the user of each post
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

        const users = await User.find({});

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        })
    }
    catch (err) {
        console.log('error -> home_controller ', err);
        return;
    } 
}