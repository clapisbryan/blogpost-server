const Blog = require('../models/Blog');
const auth = require("../auth.js");
const { errorHandler } = auth;

module.exports.addPost = (req, res) => {
	const userId = req.user.id;

	if (!userId) {
		return res.status(403).send({ message: "Access Forbidden" });
	}

	const newPost = new Blog({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	})

	return newPost.save()
		.then(post => {
			return res.status(200).send({ message: "Post successfully added", post: post })
		})
		.catch(err => errorHandler(err, req, res));
}

module.exports.getPosts = async (req, res) => {
	try {
		return await Blog.find({})
			.then(posts => {
				console.log("posts", posts);

				if (posts.length === 0) {
					return res.status(404).send({ message: 'No posts found' });
				}
				return res.status(200).send({ posts });
			})
			.catch(err => errorHandler(err, req, res))
	} catch (err) {
		errorHandler(err, req, res);
	}
};

module.exports.getPostById = async (req, res) => {
	const { postId } = req.params;

	console.log("Post id", postId);

	try {
		return await Blog.findById(postId)
			.then(post => {
				if (!post) {
					return res.status(404).send({ message: 'Post not found' });
				}
				return res.status(200).send(post)
			})
			.catch(err => errorHandler(err, req, res));
	} catch (err) {
		errorHandler(err, req, res);
	}
}

module.exports.updatePost = async (req, res) => {
	const { postId } = req.params;

	try {
		return await Blog.findByIdAndUpdate(postId, {
			title: req.body.title,
			content: req.body.content,
			author: req.body.author
		}, { new: true })
			.then(post => {
				if (!post) {
					return res.status(404).send({ message: 'Post not found' })
				}
				return res.status(200).send({
					message: "Post updated successfully",
					updatedPost: post
				})
			})
			.catch((err) => errorHandler(err, req, res));
	} catch (err) {
		errorHandler(err, req, res);
	}
}

module.exports.deletePost = async (req, res) => {

	const { postId } = req.params;
	try {
		return await Blog.findByIdAndDelete(postId)
			.then(post => {
				return res.status(200).send({ message: "Post deleted successfully" });
			})
			.catch((err) => errorHandler(err, req, res));
	} catch (err) {
		errorHandler(err, req, res);
	}
}


module.exports.addComment = async (req, res) => {
	const { postId } = req.params;
	const userId = req.user.id;
	const comment = req.body.comment;

	if (!postId || !userId || !comment) {
		return res.status(400).send({ message: "Post id, user id, and comment are required" });
	}

	return await Blog.findById(postId)
		.then(post => {
			if (!post) {
				return res.status(404).send({ message: "Post not found" });
			}

			post.comments.push({ userId, comment });

			return post.save()
				.then(post => {
					return res.status(200).send({ message: "Comment added successfully", updatedpost: post });
				})
				.catch(err => errorHandler(err, req, res));
		})
		.catch(err => errorHandler(err, req, res));
};

module.exports.getComments = (req, res) => {

	const { postId } = req.params;

	return Blog.findById(postId)
		.then(post => {
			if (!post) {
				return res.status(404).send({ message: "comment not found" });
			}

			return res.status(200).send({
				comments: post.comments
			})
		})
		.catch((err) => errorHandler(err, req, res));
}

module.exports.deleteComment = async (req, res) => {
	const { postId, commentId } = req.params;

	try {
		const post = await Blog.findById(postId);
		if (!post) {
			return res.status(404).send({ message: "Post not found" });
		}

		const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

		if (commentIndex === -1) {
			return res.status(404).send({ message: "Comment not found" });
		}

		post.comments.splice(commentIndex, 1);

		const updatedPost = await post.save();

		return res.status(200).send({ message: "Comment deleted successfully", updatedPost });
	} catch (err) {
		return errorHandler(err, req, res);
	}
};