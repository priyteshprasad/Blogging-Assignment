const express = require("express")
const { followUserController, unFollowUserController, getFollowingListController, getFollowerListController } = require("../controller/followController")
const followRouter = express.Router()

followRouter.post("/follow-user", followUserController)
followRouter.post("/unfollow-user", unFollowUserController)
followRouter.get("/get-followingList", getFollowingListController) //get list of users that I am following
followRouter.get("/get-followerList", getFollowerListController)

module.exports = followRouter