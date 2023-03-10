const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

// Ruta par agregar nueva list
router.get("/add", isLoggedIn, (req, res) => {
  //nos renderiza la vista para poder agregar nuevas list
  res.render("list/add");
});

// Agregar nueva lista
router.post("/add", isLoggedIn, async (req, res) => {
  const { title, description } = req.body;
  const newList = {
    title,
    description,
    user_id: req.user.id
  };
  // inserta los datos de title, description y user_id
  await pool.query("INSERT INTO list SET?", [newList]);
  req.flash("success", "TODO saved successfully");
  res.redirect("/list");
});

// mostrar todas las list que guarde
router.get("/", isLoggedIn, async (req, res) => {
  const lists = await pool.query("SELECT * FROM list WHERE user_id = ?", [req.user.id]);
  res.render("list/list", { lists });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM list WHERE id = ?", [id]);
  req.flash("success", "TODO delete successfully");
  res.redirect("/list");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const lists = await pool.query("SELECT * FROM list WHERE id = ?", [id]);
  res.render("list/edit", { list: lists[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const newList = {
    title,
    description,
  };
  await pool.query("UPDATE list SET? WHERE id =?", [newList, id]);
  req.flash("success", "TODO Update successfully");
  res.redirect("/list");
});

module.exports = router;
