const Post = require('../models/Post');
const {errorHandler} = require('../auth');

module.exports = {
    // Any User
    getPosts: (req, res) => {
        return Post.find()
        .then(result => {
            if (result.length > 0) {
                return res.status(200).send({posts: result})
            } else {
                return res.status(200).send({message: 'No Posts'})
            }
        }).catch(error => errorHandler(error, req, res));
    },

    getPost: (req, res) => {
        return Post.findById(req.params.postId)
        .then(result => {
            if (result) {
                return res.status(200).send(result)
            } else {
                return res.status(200).send({message: 'Post does not exist'})
            }
        }).catch(error => errorHandler(error, req, res));
    },

    // Authenticated Users

    getMyPosts: (req, res) => {
        return Post.find({author: req.user.id})
        .then(result => {
            if (result.length > 0) {
                return res.status(200).send({posts: result})
            } else {
                return res.status(200).send({message: 'No Posts'})
            }
        }).catch(error => errorHandler(error, req, res));
    },

    addPost: (req, res) => {
        let newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user.id,
            authorName: req.user.username,
            information: req.body.information
        });

        return newPost.save()
        .then(result => res.status(201).send({
            success: true,
            message: 'Post created successfully',
        }))
        .catch(error => errorHandler(error, req, res));
    },

    updatePost: (req, res) => {
        let updatedPost = {
            title: req.body.title,
            content: req.body.content,
            information: req.body.information
        };

        
        return Post.findOneAndUpdate({_id: req.params.postId, author: req.user.id}, updatedPost, { returnDocument: 'after' })
        .then(result => {
            if (result) {
                res.status(200).send({message: 'Post updated successfully', updatedPost: result});
            } else {
                if (Post.findById(req.params.postId)) return res.status(403).send({message: 'You are not the author of this post'})
                else return res.status(404).send({message: 'Post not found'})
            }
        }).catch(error => errorHandler(error, req, res));
    },

        // Has check for admin to see if they can delete any post, otherwise checks if post is owned by the one who requested before deleting
    deletePost: (req, res) => {
        if (req.user.isAdmin) {
            return Post.findByIdAndDelete(req.params.postId)
            .then(result => {
                if (result) {
                    res.status(200).send({message: 'Post deleted successfully', updatedPost: result});
                } else {
                    return res.status(404).send({message: 'Post not found'})
                }
            }).catch(error => errorHandler(error, req, res));
        } else {
            return Post.findOneAndDelete({_id: req.params.postId, author: req.user.id})
            .then(result => {
                if (result) {
                    res.status(200).send({message: 'Post deleted successfully', updatedPost: result});
                } else {
                    if (Post.findById(req.params.postId)) return res.status(403).send({message: 'You are not the author of this post'})
                    else return res.status(404).send({message: 'Post not found'})
                }
            }).catch(error => errorHandler(error, req, res));
        }
    },

    addComment: (req, res) => {
        let newComment = {
            userId: req.user.id,
            username: req.user.username,
            comment: req.body.comment
        }

        return Post.findByIdAndUpdate(req.params.postId, {$push :{comments:newComment}})
        .then(result => {
            if (result) {
            return res.status(200).send({message: 'comment added successfully'});
        } else {
            return res.status(404).send({message: 'Post not found'});
        }
        }).catch(error => errorHandler(error, req, res));
    }


}