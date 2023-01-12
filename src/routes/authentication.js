const express = require("express");
const router = express.Router();

const passport = require("passport");
const pool = require("../database");
const helpers = require("../lib/helpers");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});

router.post(
  "/signup",
  isNotLoggedIn,
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/signin", isNotLoggedIn, (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/profile/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  console.log("usuario que editaremos es",user);
  res.render("list/editpass", {users : user[0]});
});

router.post("/profile/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  console.log("la nueva pass es", password);
  const newPass = await helpers.encryptPassword(password);
  await pool.query("UPDATE users SET password=? WHERE id=?", [newPass, id]);
  req.flash("success", "Password Update successfully");
  res.redirect("/profile");
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logOut(req.user,err =>{
    if(err) return next(err);
    res.redirect("/signin");
  });
});

module.exports = router;
