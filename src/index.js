const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const sesion = require("express-session");
const MySQLStore = require("express-mysql-session");
const { database } = require("./keys");
const passport = require("passport");

// initializations

const app = express();
require("./lib/passport");

// settings
app.set("port", process.env.PORT || 3100);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

// middlewares
app.use(
  sesion({
    secret: "Proyecto-final",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); //aceptar los datos
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// global variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/list", require("./routes/list"));

// Public
app.use(express.static(path.join(__dirname, "public")));

// Starting the server

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
