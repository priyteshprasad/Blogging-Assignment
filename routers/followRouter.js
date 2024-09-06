const express = require("express")
const { followUserController, unFollowUserController, getFollowingListController, getFollowerListController } = require("../controller/followController")
const { rateLimiting } = require("../middlewares/rateLimiting")
const followRouter = express.Router()

followRouter.post("/follow-user", rateLimiting, followUserController)
followRouter.post("/unfollow-user", rateLimiting, unFollowUserController)
followRouter.get("/get-followingList", getFollowingListController) //get list of users that I am following
followRouter.get("/get-followerList", getFollowerListController)

module.exports = followRouter