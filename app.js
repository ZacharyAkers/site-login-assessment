const express = require("express");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

app.use(session({
  secret: 'afsbfoabwf',
  resave: false,
  saveUninitialized: false
}));

let errorMessages = [];
let users = [{username: "Zachary", password: "password"}];

app.get("/", function(req, res){
  if(req.session.username){
    res.render("index", {username: req.session.username});
  } else{
  res.redirect("/login");
}
});

app.get("/login", function(req, res){
  res.render("login", {errors: errorMessages});
  errorMessages = [];
});

app.post("/login", function(req, res){
  let loggedUser;
  users.forEach(function(user){
      if (user.username === req.body.username) {
        loggedUser = user;
      } else {
        loggedUser = [{
          username: "",
          password: ""
        }]
      }
    });

  req.checkBody("username", "Invalid Username Entered").notEmpty();
  req.checkBody("password", "Invalid Password Entered").notEmpty();
  req.checkBody("password", "Invalid password and username combination.").equals(loggedUser.password);

  let errors = req.validationErrors();

  if(errors) {
    errors.forEach(function(error){
      errorMessages.push(error.msg);
    });
    res.redirect("/login")
  } else {

    req.session.username = req.body.username;
    res.redirect("/");
  }
});

app.post("/logout", function(req, res){
  req.session.destroy();
  res.redirect("/login");
});

app.listen(7123, function() {
  console.log("App is running on localhost:7123");
});