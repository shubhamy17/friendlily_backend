
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
      let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
      if (password && !strongRegex.test(password)) {
        return reject("Password should contain alphabet and numbers");
      }
      return resolve();
    });
  }
  module.exports =cleanUpAndValidate