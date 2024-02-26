const mongoose = require("mongoose");

const CredoUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  nationality: {
    type: String,
    required: false,
  },
  accountType: {
    type: String,
    required: false,
  },
  pin: {
    type: String,
    required: false,
  },
  balance: {
    type: mongoose.Types.Decimal128,
    default: 0.0,
  },
  accountNumber: {
    type: String,
    required: true,
    max: 10,
  },
});

module.exports = mongoose.model("Credo", CredoUserSchema);
