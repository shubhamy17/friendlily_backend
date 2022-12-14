const express = require("express");
const AuthRouter = express.Router();
const validator = require("validator");
const constants = require("../private_constants");
const  {registerUser,verifyUsernameAndEmailExists,loginUser} = require("../models/auth");
// const {cleanUpAndValidate}=require("../utils")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function cleanUpAndValidate({ username, email, phoneNumber, password }) {
  return new Promise((resolve, reject) => {
    if (typeof email !== "string") {
      return reject("Email is not string");
    }
    if (!validator.isEmail(email)) {
      return reject("Invalid Email");
    }
    if (username.length < 3) {
      return reject("username is to short");
    }
    if (username.length > 30) {
      return reject("username is to long");
    }
    if (phoneNumber && phoneNumber.length !== 10) {
      return reject("Phone number not valid");
    }
    if (password && password.length < 6) {
      return reject("Password too short");
    }
    let strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    let mediumRegex = new RegExp(
      "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
    );
    if (password && !strongRegex.test(password)) {
      return reject("Password should contain alphabet and numbers");
    }
    return resolve();
  });
}

AuthRouter.post("/register", async (req, res) => {
  const {
    username,
    email,
    first_name,
    last_name,
    phoneNumber,
    profilePic,
    password,
  } = req.body;

  try {
    await cleanUpAndValidate({ username, email, phoneNumber, password }).then(
      async () => {
        try {
          await verifyUsernameAndEmailExists({ username, email });
        } catch (err) {
          return res.send({
            status: 401,
            message: "Error Occured",
            error: err,
          });
        }

        try {
          const dbUser = await registerUser({
            username,
            email,
            first_name,
            last_name,
            phoneNumber,
            profilePic,
            password,
          });
          return res.send({
            status: 200,
            message: "Registration Successfull",
            data: dbUser,
          });
        } catch (err) {
          return res.send({
            status: 401,
            message: "Registration Failed",
            error: err,
          });
        }
      }
    );
  } catch (error) {
    return res.send({
      status: 401,
      message: error,
      error: error,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  let creds = {
    email:"",
    username:"",
    password:""
  }
  if(req.body.email){
    creds.email = req.body.email;
  }else{
    creds.username = req.body.username;
  }
  const { loginId, password } = req.body;
  try {
    let dbUser = await loginUser({ loginId:creds.email || creds.username, password });
    const token = jwt.sign({ userId: dbUser._id }, constants.JWT_SECRET);
    return res.send({
      status: 200,
      message: "Successfull Login",
      data: { authentication: token, dbUser },
    });
  } catch (err) {
    return res.send({
      status: 401,
      message: err,
      error: err,
    });
  }
});

module.exports = AuthRouter;
