const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");

function cleanUpBin() {
  cron.schedule("* * 0 * * *", async () => {
    // 12 O click at night every day
    console.log("Scheduled tast ran");
    // get all the blogs which has been marked as deleted
    // compute the time diff > 30 days
    // delete the blog permanently
    try {
      const blogsDb = await blogSchema.find({ isDeleted: true });
      console.log(blogsDb);

      if (blogsDb.length > 0) {
        let deletedBlogsId = [];
        blogsDb.map((blog) => {
          const diff = (Date.now() - blog.deletionDateTime) / (1000 * 60 * 24);
          // console.log(diff)
          if (diff > 30) {
            deletedBlogsId.push(blog._id);
          }
        });
        if (deletedBlogsId.length > 0) {
          const deletedDb = await blogSchema.findOneAndDelete({
            _id: { $in: deletedBlogsId },
          });
          console.log(`Blog has been deleted successfully: ${deletedDb._id}`);
        }
        // console.log(deletedBlogsId)
      }
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = cleanUpBin;
