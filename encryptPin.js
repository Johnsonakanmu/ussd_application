const bcrypt = require("bcryptjs");

const saltRounds = 10;

const encryptPin = async (pin) => {
  try {
    const hashedPin = await bcrypt.hash(pin, saltRounds);
    return hashedPin;
  } catch (error) {
    throw error;
  }
};

// Function to compare a provided PIN with a hashed PIN
const comparePin = async (providedPin, hashedPin) => {
  return await bcrypt.compare(providedPin, hashedPin);
};

module.exports = { encryptPin, comparePin };
