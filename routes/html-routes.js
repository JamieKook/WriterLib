const path = require("path");

const db = require("../models");

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
    // res.sendFile(path.join(__dirname, "../public/home.html"));
    db.Book.findAll({})
      .then(function(data){
        console.log(data)
      res.render("profile", data); 
  });
  });

  //any user (logged in or not) can access the library
  app.get("/library", function(req, res){
    db.Book.findAll({})
    .then(function(dbBook){
        let bookArr= []; 
        for (const book of dbBook){
          bookArr.push(book.dataValues); 
        }
        console.log(bookArr); 
        // res.json(dbBook); 
        res.render("library",{book: bookArr}); 
    }); 
  }); 

  app.get("/bookEditor", isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, "../public/bookEditor.html")); 
  }); 

  app.get("/addBook",isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, "../public/newBookForm.html")); 
  }); 

};
