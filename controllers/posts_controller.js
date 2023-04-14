const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res) {
    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        })
        return res.redirect('back');
    }catch(err) {
        console.log('error in creating a post ', err);
        return;
    }
}

module.exports.destroy = async function(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        // .id means converting the object id into string
        if (post.user == req.user.id) {
            await Post.deleteOne({_id: post._id});
            try {
                await Comment.deleteMany({post: req.params.id});
            }
            catch (err) {
                console.log('error in deleting the comments ', err);
            }  
        }
        return res.redirect('back');
    }
    catch (err) {
        console.log('err in finding the post ', err);
    }
}