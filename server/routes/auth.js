const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/authControllers");
const { validation } = require("../middleware/authMiddleware");

router.post("/signup", validation, signUp);
router.post("/signin", signIn);

module.exports = router;
