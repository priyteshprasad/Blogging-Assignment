const User = require("../models/userModel");
const { userDataValidation } = require("../utils/authUtils");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const registerController = async (req, res) => {
  console.log(req.body);
  const { email, username, password, name } = req.body;
  // data vialidation before registering
  try {
    await userDataValidation({ email, username, name, password });
  } catch (error) {
    // if rejected
    console.log(error);
    return res.send({
      status: 400,
      message: "Bad Request",
      error: error,
    });
  }
  // hashed password
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );

  // create user object for mongoose operation
  const userObj = new User({ email, username, password: hashedPassword, name });
  // database save operation
  try {
    const userDb = await userObj.registerUser(); // all database operation should be performent by the models
    return res.send({
      status: 201,
      message: "User Registered Successfully",
      data: userDb,
    });
  } catch (error) {
    // here the bad request error because of user already existing is shown as internakl server error
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

const loginController = async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password)
    return res.send({ status: 400, message: "Missing Credentials" });
  try {
    const userDb = await User.findUserWithKey({ key: loginId }); //this will return if user exists

    // compare the password
    const isMatched = await bcrypt.compare(password, userDb.password);
    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Bad Request",
        error: "Incorrect Password",
      });
    }
    // create session // but to use it we have to set the expression session
    req.session.isAuth = true; //updating .session will automatically create a session
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.send({
      status: 200,
      message: "Login successfull",
      data: userDb,
    });
  } catch (error) {
    console.log("error", error)
    return res.send({
      status: 500,
      message: "internal server error",
      error: error,
    });
  }
  
};

module.exports = { registerController, loginController };
