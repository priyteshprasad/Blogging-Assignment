const { followUser, unfollowUser, getFollowingList, getFollowerList } = require("../models/followModel");
const User = require("../models/userModel");

const followUserController = async (req, res)=>{
    const followerUserId = req.session.user.userId
    const {followingUserId} = req.body;
    // we have to make sure that both the user exists

    try {
        const userDb = await User.findUserWithKey({key: followerUserId})
    } catch (error) {
        console.log(error)
        return res.send({
            status: 400,
            message: "Bad request for follower user id",
            error: error,
        })
    }
    try {
        const userDb = await User.findUserWithKey({key: followingUserId})
    } catch (error) {
        return res.send({
            status: 400,
            message: "Bad request for following user id",
            error: error,
        })
    }
    try {
        const followDb = await followUser({followerUserId, followingUserId})
        return res.send({
            status: 200,
            message: "Follow successfull",
            data: followDb
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
const unFollowUserController=async (req,res)=>{
    const followerUserId = req.session.user.userId
    const {followingUserId} = req.body
    try {
        const unfollowDb = await unfollowUser({followerUserId, followingUserId})
        return res.send({
            status: 200,
            message:"Unfollow successfull",
            data: unfollowDb
        })
    } catch (error) {
        return res.send({
            status: 500,
            message:"Unfollow not successfull",
            error
        })
    }

}
const getFollowingListController = async (req, res) =>{
    const followerUserId = req.session.user.userId
    console.log(req.session, followerUserId)
    // return res.send("all ok")
    const SKIP = Number(req.query.skip) || 0
    try {
        const followingListDb = await getFollowingList({SKIP, followerUserId})
        if(followingListDb.length === 0){
            return res.send({
                status: 204,
                message: "No following users found"
            })
        }
        return res.send({
            status: 200,
            message: "read successful",
            data: followingListDb
        })
    } catch (error) {
        // console.log(error)
        return res.send({
            status: 500,
            message:"Internal Server Error",
            error
        })
    }
}
const getFollowerListController = async (req, res) => {
const followingUserId = req.session.user.userId
const SKIP = Number(req.query.skip) || 0
try {
    const followerListDb = await getFollowerList({SKIP, followingUserId})
    if(followerListDb.length === 0){
        return res.send({
            status: 204,
            message: "No following users found"
        })
    }
    return res.send({
        status: 200,
        message: "read successful",
        data: followerListDb
    })
} catch (error) {
    return res.send({
        status: 500,
        message:"Internal Server Error",
        error
    })
}
}

module.exports = {followUserController, unFollowUserController, getFollowingListController, getFollowerListController} 