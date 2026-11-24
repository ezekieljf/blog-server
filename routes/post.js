const express = require('express');
const postController = require('../controllers/post');
const { verify } = require("../auth");

const router = express.Router();

// Any User
router.get("/getPosts", postController.getPosts);
router.get("/getPost/:postId", postController.getPost);

// Authenticated Users
router.get("/getMyPosts", verify, postController.getMyPosts);
router.post("/addPost", verify, postController.addPost);
router.patch("/updatePost/:postId", verify, postController.updatePost);
router.delete("/deletePost/:postId", verify, postController.deletePost); // Has an admin check to bypass check if post is owned by the one who requested to delete
router.post("/addComment/:postId", verify, postController.addComment);

module.exports = router;