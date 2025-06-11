// const express = require("express");
// const router = express.Router();
// const User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const passport = require("passport");
// const user = require("../models/user.js");
// const { saveRedirectUrl } = require("../middleware.js");


// router.get("/signup", (req, res) => {
//     res.render("users/signup.ejs");
// })

// router.post("/signup", wrapAsync(async (req, res) => {
//     try {
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);

//         req.login(registeredUser,(err)=>{
//             if(err){
//                 return next(err);
//             }
//             req.flash("success", "Welcome to AwayInn");
//         res.redirect("/listings");
//         })

        
//     }
//     catch (e) {
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }

// }))


// router.get("/login", (req, res) => {
//     res.render("users/login.ejs");
// })

// router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
// req.flash("success","Welcome back to AwayInn");
// let redirectUrl=res.locals.redirectUrl || "/listings";
// res.redirect(redirectUrl);   //redirect to the page user was initially trying to reach
// })

// router.get("/logout",(req,res,next)=>{
//     req.logout((err)=>{
//     if(err){
//         return next(err);
//     }
//     req.flash("success","You are Logged Out");
//     res.redirect("/listings");
// })
// })


// module.exports = router;


const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const users = require("../controllers/users.js");

// Signup Routes
router.get("/signup", users.renderSignupForm);
router.post("/signup", wrapAsync(users.signup));

// Login Routes
router.get("/login", users.renderLoginForm);
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    users.login
);

// Logout Route
router.get("/logout", users.logout);

module.exports = router;
