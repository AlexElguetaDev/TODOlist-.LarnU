const bcrypt = require("bcryptjs");

const helpers = {};

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const finalPassword = await bcrypt.hash(password, salt);
  return finalPassword;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (error) {
    console.log(error);
  }
};

module.exports = helpers;
