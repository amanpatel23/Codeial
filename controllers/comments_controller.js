const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try {
        const post = await Post.findById(req.body.post);
        try {
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
            console.log(err);
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;
            await comment.deleteOne({_id: comment._id});
            try {
                await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
                return res.redirect('back');
            }
            catch {
                console.log('error while deleting the comment from the comments array of the post ', err);
            }
        } else {
            return res.redirect('back'); 
        }
    }
    catch (err) {
        console.log('error in finding the comment ', err);
    }
}