const bcrypt = require("bcryptjs");
const users = require("../models/user");
const jwt = require("jsonwebtoken");
const method = {};

method.signUp = async (req, res) => {
  try {
    req.user
      .save()
      .then(
        res.status(200).json({
          Message: "Register successfull",
          Token: req.token,
        })
      )
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    res.status(404).json(error);
  }
};

method.signIn = async (req, res) => {
  try {
    const user = await users.findOne({
      userName: req.body.userName,
    });

    const cekPassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (user && cekPassword) {
      const payload = {
        id: user.id,
        userName: user.userName,
        email: user.email,
      };
      const Token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "8h",
      });

      res.status(200).json({
        Message: "Welcome",
        Token,
      });
    } else {
      res.status(404).json({
        message: "You're not register yet",
      });
    }
  } catch (err) {
    res.status(404).json({
      err,
    });
  }
};

module.exports = method;
