const Credo = require('../models/credoUser')
const asyncWrapper = require("../middleware/async");
const generateAccountNumber = require("../randum-account-number");
const { createCustomError } = require("../error/custom_error");
const bcrypt = require('bcryptjs')
const {encryptPin} = require('../encryptPin')
const { comparePin } = require("../encryptPin");

async function encriptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

exports.createAccount = asyncWrapper(async (req, res, next) => {
  const emailExist = await Credo.findOne({ email: req.body.email });

  if (emailExist) {
    return res.status(403).json({ msg: "Email already exists" });
  }

  const phoneNumberExist = await Credo.findOne({
    phoneNumber: req.body.phoneNumber,
  });

  if (phoneNumberExist) {
    return res.status(403).json({ msg: "Phone number already exists" });
  }

  const accountNumber = generateAccountNumber();
  const hashedPin = await encryptPin(req.body.pin); 

  const userNumber = await Credo.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: await encriptPassword(req.body.password),
    phoneNumber: req.body.phoneNumber,
    balance: req.body.balance,
    accountNumber: accountNumber,
    pin: hashedPin,
  });

  const responseData = await Credo.findOne({ _id: userNumber._id }).select(
    "-password -pin"
  );

  res
    .status(200)
    .json({ msg: "Your account has been created", data: responseData });
});



exports.updateYourDetails = asyncWrapper(async (req, res, next) => {
  const accountNumber = req.params.accountNumber;
  const {
    address, phoneNumber, city, country, dob,
    accountType, gender} = req.body;

  // Find the user by accountNumber
  const userToUpdate = await Credo.findOne({ accountNumber });

  if (!userToUpdate) {
    return next(createCustomError("User not Found", 404));
  }

  // Update user details
  userToUpdate.address = address;
  userToUpdate.phoneNumber = phoneNumber;
  userToUpdate.city = city;
  userToUpdate.country = country;
  userToUpdate.dob = dob;
  userToUpdate.accountType = accountType;
  userToUpdate.gender = gender;
  // userToUpdate.pin = pin;
  // userToUpdate.balance = balance;

  await userToUpdate.save();

  const responseData = await Credo.findOne({ _id: userToUpdate._id }).select(
    "-password -pin"
  );

  res.status(200).json({ msg: "Account updated", data: responseData });
});


exports.accountDeposit = asyncWrapper(async (req, res, next) => {
  const uuid = req.params.uuid;
  const { amount } = req.body;

  const user = await Credo.findOneAndUpdate(
    { _id: uuid },
    { $inc: { amount: amount, balance: amount } }, 
    { new: true } 
  );

  if (!user) {
    return next(createCustomError("User not Found", 404));
  }

  res.status(200).json({
    data: {
      msg: "Deposit to your account successful",
      amount: user.amount, 
      balance: user.balance,
    },
  });
});


exports.accountWithdraw = asyncWrapper(async (req, res, next) => {
  const uuid = req.params.uuid;
  const { amount, pin } = req.body;

  const user = await Credo.findOne({ _id: uuid });
  if (!user) {
    return next(createCustomError("User not Found", 404));
  }

  // Verify PIN
  const isPinValid = await comparePin(pin, user.pin); 
  if (!isPinValid) {
    return res.status(403).json({ msg: "Invalid PIN" });
  }

  if (amount > user.balance) {
    return res.status(403).json({ msg: "Insufficient balance" });
  }

  const updatedUser = await Credo.findOneAndUpdate(
    { _id: uuid, balance: { $gte: amount } }, // Ensure sufficient balance before updating
    { $inc: { balance: -amount } },
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    // If the document was not updated, it means there wasn't sufficient balance
    return res.status(403).json({ msg: "Insufficient balance" });
  }

  res.status(200).json({
    data: {
      msg: "Withdraw successful",
      balance: updatedUser.balance,
    },
  });
});

exports.balanceCheck = asyncWrapper(async (req, res, next)=>{
  const uuid = req.params.uuid;

  const user = await Credo.findOne( { _id: uuid } );
  if (!user) {
    return next(createCustomError("User not Found", 404));
  }
  res.status(200).json({
    data: {
      mgs: "This is ur balance",
      balance: user.balance,
    },
  });
})
