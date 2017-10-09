const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true, unique: true },
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false }
  },
  { timestamps: true } // ADDS CREATED AT AND UPDATED AT
);

// INSTANCE METHODS

// VALIDATES PASSWORD
schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email // public data
    },
    process.env.JWT_SECRET
  );
};

// CREATES OBJECT TO SEND TO CLIENT
schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generateJWT(),
    confirmed: this.confirmed
  };
};

schema.plugin(uniqueValidator, { message: 'This email is already taken' });

module.exports = mongoose.model('User', schema);
