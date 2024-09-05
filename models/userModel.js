const userSchema = require("../schemas/userSchema");
const {ObjectId} = require("mongodb");
const User = class {
  constructor({ email, username, password, name }) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      try {
        // find if an user exist with the same details
        const existingUser = await userSchema.findOne({
          $or: [{ email: this.email }, { username: this.username }], //if either of the value is true, we will get a userObj
        });

        if (existingUser) {
          // user already exists
          if (
            existingUser.email === this.email &&
            existingUser.username === this.username
          )
            return reject("Email and Username already exists");
          if (existingUser.username === this.username)
            return reject("Username already exists");
          if (existingUser.email === this.email)
            return reject("Email already exists");
        }

        //   make unique entry in database
        const newUser = new userSchema({
          name: this.name,
          email: this.email,
          username: this.username,
          password: this.password,
        });
        const userDb = await newUser.save(); //saves in databse
        return resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  loginUser() {}
  // static so that we can call it using User class
  static findUserWithKey({ key }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) reject("Key is empty");
        const userDb = await userSchema
          .findOne({
            $or: [
              ObjectId.isValid(key) ? { _id: key } : { email: key },
              { username: key },
            ],
          })
          .select("+password");
        if (!userDb) reject("User not found, please register first");
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
