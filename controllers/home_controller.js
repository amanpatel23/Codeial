
const Post = require('../models/post');
module.exports.home = async function(req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 1);

    try {

        // populate the user of each post
        const posts = await Post.find({}).populate('user').exec();
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        })
    }
    catch (err) {
        console.log('error while retrieving the posts: ', err);
    }
    
}