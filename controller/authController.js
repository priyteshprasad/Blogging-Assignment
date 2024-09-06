const User = require("../models/userModel");
const userSchema = require("../schemas/userSchema");
const {
  userDataValidation,
  generateJwt,
  sendEmailVerificationMail,
} = require("../utils/authUtils");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
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
    // generate token for verification
    const token = generateJwt(email);
    // send mail for verification
    sendEmailVerificationMail(email, token);
    return res.send({
      status: 201,
      message: "User Registered Successfully",
      data: userDb, //change it back
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

    // email verification is done or not
    if (!userDb.isEmailVerified) {
      return res.send({
        status: 400,
        message: "Please Verify your Email before Login",
        error: "Email verification pending",
      });
    }
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
    console.log("error", error);
    return res.send({
      status: 500,
      message: "internal server error",
      error: error,
    });
  }
};

const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send({
        status: 400,
        message: "Logout unnsuccessfull",
        error: err,
      });

    return res.send({
      status: 200,
      message: "Logout successfull",
    });
  });
};
const emailVerifyController = async (req, res) => {
  const token = req.params.token;
  const email = jwt.verify(token, process.env.SECRET_KEY); //token doesnot required to be stored at DB because it contains the user info
  try {
    const userDb = await userSchema.findOneAndUpdate(
      { email: email },
      { isEmailVerified: true },
      { new: true } // return object after the update
    );
    return res.send({
      status: 200,
      message: "Email Verified Successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  logoutController,
  emailVerifyController,
};
