var md5 = require("md5");
const User = require("../Schema/user");
const validator = require("validator");
function registerUser({
    username,
    email,
    first_name,
    last_name,
    phoneNumber,
    profilePic,
    password,
  }) {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = md5(password);
      const user = new User({
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        profilePic: profilePic,
      });
  
      try {
        const dbUser = await user.save();
        return resolve(dbUser);
      } catch (err) {
        return reject(err);
      }
    });
  }
  
  function verifyUsernameAndEmailExists({ username, email }) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user && user.email === email) {
          return reject("Email already exists");
        }
  
        if (user && user.username === username) {
          return reject("Username already taken");
        }
  
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }

function loginUser({loginId,password}){
    return new Promise(async(resolve,reject)=>{
       let dbUser={};
       if(validator.isEmail(loginId)){
        dbUser= await User.findOne({email:loginId})
       }else {
        dbUser =await User.findOne({username:loginId})
       }
       if(!dbUser) {
        return reject("No user found");
        }
       if(dbUser.password!==md5(password)){
        return reject("Invalid userName or email And password")
       }
       resolve(dbUser)

    })

}

  module.exports = {registerUser,verifyUsernameAndEmailExists,loginUser};