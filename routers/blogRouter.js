const express = require("express");
const {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
} = require("../controller/blogController");
const { rateLimiting } = require("../middlewares/rateLimiting");

const blogRouter = express.Router();
blogRouter
  .post("/create-blog",rateLimiting, createBlogController)
  .get("/get-blogs", getBlogsController)
  .get("/get-myblogs", getMyBlogsController)
  .post("/edit-blog", rateLimiting, editBlogController)
  .post("/delete-blog", rateLimiting, deleteBlogController);

module.exports = blogRouter;
