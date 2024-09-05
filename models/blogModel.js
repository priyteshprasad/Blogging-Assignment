// ALL THE FUNCTION THAT INTERACT WITH THE DATA BASE


const { LIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema");
const ObjectId = require("mongodb").ObjectId;

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new blogSchema({
      title,
      textBody,
      userId,
      creationDateTime: Date.now(),
    });
    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};
const getBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogsDb = await blogSchema.aggregate([
        { $sort: { creationDateTime: -1 } }, //-1 DESC
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);
      resolve(blogsDb);
    } catch (error) {
      reject(error);
    }
  });
};
const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const myBlogsDb = await blogSchema.aggregate([
        { $match: { userId: userId } },
        { $sort: { creationDateTime: -1 } }, //-1 DESC //sort will get the output of previous match function and so on
        { $skip: SKIP }, //skip will get the output of sort
        { $limit: LIMIT },
      ]);
      resolve(myBlogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogById = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    if (!blogId) return reject("Missing blog id");
    if (!ObjectId.isValid(blogId)) return reject("Incorrect blogId");

    try {
      const blogDb = await blogSchema.findOne({ _id: blogId });
      if (!blogDb) reject(`blog not found with BlogId : ${blogId}`);
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const editBlogById = ({ title, textBody, blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedBlodDb = await blogSchema.findOneAndUpdate(
        { _id: blogId }, // find by
        { title: title, textBody: textBody }, // new valse
        { new: true } // return object after the update
      );
      resolve(updatedBlodDb);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    if (!blogId) reject("BlogId is missing");
    try {
      const deletedBlogDb = await blogSchema.findOneAndDelete({ _id: blogId });
      resolve(deletedBlogDb)
    } catch (error) {
      reject(error)
    }
  });
};

module.exports = {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogById,
  editBlogById,
  deleteBlogWithId,
};
