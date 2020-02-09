const path = require("path");

const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the home page
    if (req.user) {
      res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the home page
    if (req.user) {
      res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/home", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  //any user (logged in or not) can access the library
  app.get("/library", function(req, res){
    res.sendFile(path.join(__dirname, "../public/writerLibrary.html")); 
  }); 

  app.get("/bookEditor", isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, "../public/bookEditor.html")); 
  }); 
};