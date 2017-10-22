const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true, unique: true },
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String, default: '' }
  },
  { timestamps: true } // ADDS CREATED AT AND UPDATED AT
);

// INSTANCE METHODS

// VALIDATES PASSWORD
// CHECKS TO SEE IF THE PASSWORD THE USER TYPED MATCHES THE DATABASE PASSWORD
schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// ENCRYPTS THE USERS PASSWORD
schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

// CREATES A CONFIRMATION TOKEN
// REUSES GENERATEJWT() TO SIGN THE TOKEN
schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

// CREATES THE CONFIRMATION URL USING THE CONFIRMATION TOKEN THAT WAS GENERATED
schema.methods.generateConfirmationURL = function generateConfirmationURL() {
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

// CREATES A PASSWORD RESET URL
// USES GENERATERESETPASSWORDTOKEN() TO SIGN A NEW TOKEN
schema.methods.generateResetPasswordURL = function generateResetPasswordURL() {
  return `${process.env.HOST}/reset_password/${this.generateResetPasswordToken()}`;
};

// CREATES A TOKEN WITH EMAIL AND CONFIRMED
schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email, // PUBLIC DATA
      confirmed: this.confirmed // PUBLIC DATA
    },
    process.env.JWT_SECRET
  );
};

// GENERATES A PASSWORD RESET TOKEN WITH A USERS ID
schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  return jwt.sign(
    {
      _id: this._id // PUBLIC DATA
    },
    process.env.JWT_SECRET,
    { expiresIn: '1hr' } // TOKEN EXPIRES AFTER 1 HOUR
  );
};

// CREATES OBJECT TO SEND TO CLIENT
// THIS OBJECT CONTAINS THE USER INFORMATION WE SEND TO THE CLIENT
schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generateJWT(),
    confirmed: this.confirmed
  };
};

// USE 'MIDDLEWARE' TO VALIDATE EMAILS
schema.plugin(uniqueValidator, { message: 'This email is already taken' });

module.exports = mongoose.model('User', schema);
