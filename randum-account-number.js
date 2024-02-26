function generateAccountNumber() {
  const maxDigits = 10;
  const randomNumber = Math.floor(Math.random() * Math.pow(10, maxDigits));
  const accountNumber = randomNumber.toString().padStart(maxDigits, "0");
  return accountNumber;
}

module.exports = generateAccountNumber;
