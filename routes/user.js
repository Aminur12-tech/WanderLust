const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

//signup
router.route('/signup')
    .get(userController.getsignup)
    .post(userController.postSignup);


//login
router.route('/login')
    .get(userController.getLogin)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.postLogin);


//logout
router.get("/logout", userController.logout);

module.exports = router;