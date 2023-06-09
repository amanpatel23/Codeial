const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try {
        const post = await Post.findById(req.body.post);
        const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
        })
        post.comments.push(comment);
        post.save();

        res.redirect('/');
    }
    catch (err) {
        console.log('error in comments controller --> create ', err);
    }
}

module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;
            await comment.deleteOne({_id: comment._id});
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
        } 
        return res.redirect('back');
    }
    catch (err) {
        console.log('error in comment controller --> destroy ', err);
    }
}