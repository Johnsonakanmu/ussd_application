
const { CustomAPIError } = require("../error/custom_error");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  return res
    .status(500)
    .json({ msg: "Something went wrong, try again later." });
};

module.exports = errorHandlerMiddleware;