const { LIMIT } = require("../privateConstants");
const followSchema = require("../schemas/followSchema");
const userSchema = require("../schemas/userSchema");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    // we have to check if the user is already following or not
    try {
      const followExist = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });
      if (followExist) {
        return reject("Already following the user");
      }
    } catch (error) {
      return reject(error);
    }

    const followObj = new followSchema({
      followerUserId,
      followingUserId,
      creationDateTime: Date.now(),
    });

    try {
      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};
const unfollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.findOneAndDelete({
        followingUserId,
        followerUserId,
      });
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};
const getFollowingList = ({ SKIP, followerUserId }) => {
  return new Promise(async (resolve, reject) => {
    // match, sort, skip, limit
    try {
      // mongoose way of getting populate
      // const followingListDb = await followSchema
      //   .find({ followerUserId: followerUserId })
      //   .populate("followingUserId")
      //   .sort()
      //   .skip()
      //   .limit();

      const followingListDb = await followSchema.aggregate([
        { $match: { followerUserId: followerUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);
      // very bad way to do the same operation, makeing multiple mongodb search
      // const followingListWithDetails = []
      // followingListDb.map(async (follow) => {
      //   const userDb = await userSchema.findOne({_id: follow.followingUserId});
      //   followingListWithDetails.push(userDb)
      // })

      const followingUserIdsList = followingListDb.map(
        (follow) => follow.followingUserId
      ); //list contains only ids as new ObjectId('')
      // find all the objects with id present in the list
      const followingUsersDetailsDb = await userSchema.find({
        _id: { $in: followingUserIdsList },
      });

      resolve(followingUsersDetailsDb.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowerList = ({ SKIP, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followerListDb = await followSchema.aggregate([
        { $match: { followingUserId: followingUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);
      const followerUserIdsList = followerListDb.map(
        (follow) => follow.followerUserId
      );
      const followerUsersDetailsDb = await userSchema.find({
        _id: { $in: followerUserIdsList },
      });
      resolve(followerUsersDetailsDb.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowingList,
  getFollowerList,
};
