
const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function (req, res) {

    const posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

    return res.json(200, {
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {
            await Post.deleteOne({_id: post._id});
            await Comment.deleteMany({post: req.params.id});  

            return res.json(200, {
                message: "Post and associated comments delted successfully"
            })
        } else {
            return res.json(401, {
                message: "Yon cannot delete this post!"
            })
        }
    }
    catch (err) {
        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}