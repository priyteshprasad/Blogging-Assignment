const { createBlog, getBlogs, getMyBlogs , getBlogById, editBlogById, deleteBlogWithId} = require("../models/blogModel");
const { blogDataValidation } = require("../utils/blogUtils");

const createBlogController = async (req, res) => {
  console.log(req.body);
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;

  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Bad request",
      error: error,
    });
  }
  try {
    const blogDb = await createBlog({ title, textBody, userId }); //createBlog comong from blog model
    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};
// blogs/get-blogs?skip=10
const getBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  
  try {
    const blogsDb = await getBlogs({ SKIP });
    if (blogsDb.length === 0) {
      return res.send({
        status: 204,
        message: SKIP === 0 ? "No Blogs Found" : "No more blogs found",
      });
    }
    return res.send({
      status: 200,
      message: "Read Success",
      data: blogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};
const getMyBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const userId = req.session.user.userId
  try {
    const myBlogsDb = await getMyBlogs({ SKIP, userId });
    if (myBlogsDb.length === 0) {
      return res.send({
        status: 204,
        message: SKIP === 0 ? "No blogs found" : "No more blogs found",
      });
    }
    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogsDb
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Interal server error",
      error: error,
    });
  }
};
const editBlogController = async (req, res) =>{
  const { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;
  try {
    await blogDataValidation({title, textBody})
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid data",
      error
    })
  }
  try {
    // find the blog
    const blogDb = await getBlogById({blogId})
    // ownership check
    // we cannot directly compare the IDs, we can convert them into string to compare or use the .equals function
    // console.log(userId.toString() === blogDb.userId.toString())
    if(!userId.equals(blogDb.userId)){
      return res.send({
        status: 403,
        message: "Not allowed to edit the blog"
      })
    }
    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60)
    if(diff > 30){
      return res.send({
        status: 400, 
        message: "Not allow to edit the blog after 30 mins of creation"
      })
    }
    const blogDbUpdate = await editBlogById({ title, textBody, blogId})
    return res.send({
      status: 200,
      message: "Blog Updated successfully",
      data: blogDbUpdate,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server error",
      error: error,
    })
  }
}
const deleteBlogController = async (req, res) =>{
  const {blogId} = req.body;
  const userId = req.session.user.userId;

  try {
    // find the blog
    const blogToDelete = await getBlogById({blogId});
    // ownership check
    if(!userId.equals(blogToDelete.userId)){
      return res.send({
        status: 403,
        message: "not allowed to delete the blog"
      })
    }
    const blogDeletedDb = await deleteBlogWithId({blogId})
    return res.send({
      status: 200,
      message: "Blog deleted successfully",
      data: blogDeletedDb
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error
    })
  }

  res.send("delete the blog")
}
module.exports = {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController
};
