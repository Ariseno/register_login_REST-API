const bcrypt = require("bcryptjs");
const users = require("../models/user");
const userTemplate = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const method = {};

method.validation = async (req, res, next) => {
  try {
    const signedUp = await new userTemplate({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
    });

    // check user name availability
    if (
      await users.findOne({
        userName: {
          $regex: new RegExp("^" + req.body.userName.toLowerCase(), "i"),
        },
      })
    ) {
      res.status(404).json({
        Message: `User name: ${signedUp.userName}, has been registered`,
      });
      return true;
    }

    // check email availability
    if (
      await users.findOne({
        email: {
          $regex: new RegExp("^" + req.body.email.toLowerCase(), "i"),
        },
      })
    ) {
      res.status(404).json({
        Message: `Email : ${signedUp.email}, has been registered`,
      });
      return true;
    }

    // check email validity
    if (!validator.isEmail(signedUp.email)) {
      res.status(404).json({
        Message: "Email is invalid",
      });
      return true;
    }

    // chek password security
    if (
      !validator.isStrongPassword(req.body.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      res.status(404).json({
        Message: "Password is not eligible",
        Require:
          "Min. 8 character, using 1 lowercase, 1 uppercase,  1 number, and 1 symbol",
      });
      return true;
    }

    const token = jwt.sign(
      {
        id: signedUp.id,
        userName: signedUp.userName,
        email: signedUp.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "8h" }
    );

    req.user = signedUp;
    req.token = token;
    next();
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
};
module.exports = method;
