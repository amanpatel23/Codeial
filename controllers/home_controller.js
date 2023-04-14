
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 1);

    try {

        // populate the user of each post
        const posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec();

        try {
            const users = await User.find({});
            return res.render('home', {
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            })
        }
        catch (err) {
            console.log('error in finding users -> home_controller ', err);
        }
    }
    catch (err) {
        console.log('error while retrieving the posts: ', err);
    }
    
}