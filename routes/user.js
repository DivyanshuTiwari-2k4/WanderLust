const express = require("express")
const router = express.Router()

//custom Error handling
const wrapAsync = require("../utils/wrapAsync.js")

//controller for user
const userController=require("../controllers/users.js")

const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")

// for "/signup" path 
router.route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync(userController.signup))

// for "/login" path 
router.route("/login")
.get(userController.renderLoginForm )
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),userController.login)

//logout
router.get("/logout",userController.logout)

module.exports = router;