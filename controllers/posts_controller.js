const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        })


        if (req.xhr) {
            await post.populate('user');
            return res.status(200).json({
                data: {
                    post: post
                },
                messagge: "Post Created!"
            })
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    }catch(err) {
        req.flash('error', err);
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
            await Comment.deleteMany({post: req.params.id});  

            req.flash('success', 'Post and associated comments deleted!');
        } else {
            req.flash('error', 'You cannot delete this post');
        }
        return res.redirect('back');
    }
    catch (err) {
        req.flash('error', err);
        console.log('err post constroller destroy --> ', err);
        return;
    }
}