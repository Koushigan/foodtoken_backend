const route = require("express").Router();
const { ObjectId } = require("mongodb");
const { validate, postSchema } = require("../shared/schema");
const db = require("../shared/mongo");
const {
  findAll,
  findById,
  insert,
  updateById,
  deleteById
} = require("../helpers/desserts.helpers");

module.exports = {
  async getAll(_, res) {
    try {
      const posts = await findAll();
      return res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  async getById(req, res) {
    try {
      const post = await findById(req.params.id);
      if (!post) return res.status(401).json({ message: "Invalid post" });

      if (!post.active) return res.status(401).json({ message: "Post is deleted" });

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching post" });
    }
  },

  async create(req, res) {
    try {
      // Request body validation
      const isError = await validate(postSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      const { insertedId } = await insert(req.body, req.user._id);

      res.json({ message: "Post created successfully", post: req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error while creating a post" });
    }
  },

  async update(req, res) {
    try {
      // Request body validation
      const isError = await validate(postSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Check if the post exists
      let post = await findById(req.params.id);

      if (!post) return res.status(401).json({ message: "Post does not exist" });

      if (post.userId !== req.user._id) {
        return res
          .status(401)
          .json({ message: "User is not authorized to perform this operation" });
      }

      if (!post.admin) return res.status(401).json({ message: "Unauthorized user" });

      // Update the Posts collection
      const { value } = await updateById(req.params.id, req.body);

      res.json({ message: "Post updated successfully", post: value });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error while updating a post" });
    }
  },

  async remove(req, res) {
    try {
      // Request body validation
      const isError = await validate(postSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Check if the post exists
      let post = await findById(req.params.id);
      if (!post) return res.status(401).json({ message: "Post does not exist" });

      if (post.userId !== req.user._id) {
        return res
          .status(401)
          .json({ message: "User is not authorized to perform this operation" });
      }

      if (!post.admin) return res.status(401).json({ message: "Unauthorized user" });

      // Delete from the Posts collection
      await deleteById(req.params.id);

      res.json({ message: "Post deleted successfully", post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error while deleting a post" });
    }
  }
};
