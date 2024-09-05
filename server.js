const express = require("express")
require("dotenv").config();
const clc = require("cli-color");
const session = require("express-session")
const mongodbSession = require("connect-mongodb-session")(session)


// file imports
const authRouter = require("./routers/authRouter.js");
const db = require("./db-connect"); //as soon as this file is imported it will run the code to connect mongodb
const isAuth = require("./middlewares/isAuth.js");
const blogRouter = require("./routers/blogRouter.js");
const followRouter = require("./routers/followRouter.js");


// constants
const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongodbSession({
    uri: process.env.MONGO_URI,
    collection: "sessions", //name of the collection hence prural
})



// middleware
app.use(express.json()) // without it we can not read the req.body
app.use(
    session({
        secret: process.env.SECRET_KEY,
        store: store,
        resave: false,                  //
        saveUninitialized: false        //
    })
)

app.use("/auth", authRouter)
// out rout will be like localhost:8000/auth/login
app.use("/blog", isAuth, blogRouter);
// isAuth will be applied to all the routes inside blogsRouter
app.use("/follow",isAuth, followRouter)

app.listen(PORT, ()=>{
    console.log(clc.yellowBright.bold(`selver is running on port ${PORT}`))
})