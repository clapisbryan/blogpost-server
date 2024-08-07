const express = require("express");
const userController = require("../controllers/user.js");

const { verify, isLoggedIn, verifyAdmin } = require("../auth.js");

const router = express.Router();

// Accessed by all users
router.post('/register', userController.registerUser);
// Accessed by all users
router.post('/login', userController.loginUser);
// Authenticated user only
router.get('/details', verify, userController.showUserDetails);

module.exports = router;