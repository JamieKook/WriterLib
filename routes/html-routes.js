const path = require("path");
const db = require("../models");
const AwsHandling = require("../aws/awsHandling"); 
const awsHandling = new AwsHandling(); 
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the home page
    if (req.user) {
      res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/welcome.html"));
  });

  app.get("/signup", function(req, res) {
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
  app.get("/home", isAuthenticated, async function(req, res) {
    // res.sendFile(path.join(__dirname, "../public/home.html"));
    console.log(req.user);
    let userId = req.user.id; 
    const authorData = await db.Author.findOne({
      include: db.Book, 
        where: {
            UserId: userId
        }
    });
    console.log(authorData); 
    for (let i=0; i<3; i++){
      console.log(authorData.dataValues.Books[i]); 
    }
    res.render("profile", authorData.dataValues); 
  });

  //view all books
  app.get("/library", isAuthenticated, function(req, res){
    db.Book.findAll({include: db.Author})
    .then(function(dbBook){
        let bookArr= []; 
        for (const book of dbBook) {
          bookArr.push(book.dataValues); 
        }
        for (const bookData of bookArr){
          if (bookData.Author){
            if (bookData.Author.usePseudonym){
              bookData.authorName = bookData.Author.pseudonym; 
            } else{
              bookData.authorName=  `${bookData.Author.firstName} ${bookData.Author.lastName}`;
            }
          } else {
            bookData.authorName = "Anonymous"; 
          }
        }
        console.log(bookArr[0]); 
        res.render("library",{book: bookArr}); 
    }); 
  }); 

  //view books user added
  app.get("/personalLibrary", isAuthenticated, async function(req, res){
    const userId= req.user.id; 
    const authorData = await db.Author.findOne({
      include: db.Book, 
        where: {
            UserId: userId
        }
    });
    const bookData = authorData.dataValues.Books; 
    let bookArr= []; 
    for (const book of bookData){
      bookArr.push(book.dataValues); 
    }
    console.log(bookArr); 
    res.render("personalLibrary", {book: bookArr}); 
  });

  //view individual personal books
  app.get("/personalBooks/:id", isAuthenticated, function(req, res){
    const bookId= req.params.id; 
    db.Book.findOne({
      where: {
        id: bookId
      },
      include: [db.Author, db.Comment]
    })
    .then(function(dbBook){
     let bookData = dbBook.dataValues; 
     console.log(bookData); 
      if (bookData.Author){
        if (bookData.Author.usePseudonym){
          bookData.authorName = bookData.Author.pseudonym; 
        } else{
          bookData.authorName=  `${bookData.Author.firstName} ${bookData.Author.lastName}`;
        }
      } else {
        bookData.authorName = "Anonymous"; 
      }
        res.render("personalBook",bookData); 
        awsHandling.retrieveFile(`book${bookId}.pdf`, bookId);
    });
    
  }); 

  //edit personal books
  app.get("/personalEdit/:id", isAuthenticated, function(req, res){
    const bookId= req.params.id; 
    db.Book.findOne({
      where: {
        id: bookId
      }
    })
    .then(function (dbBook){
      res.render("editBook", dbBook.dataValues); 
    }); 
    
  }); 

  //view comments on personal book
  app.get("/comments/:id", isAuthenticated, async function(req, res){
    const bookId= req.params.id; 
    const comments = await db.Comment.findAll({
        where: {
          BookId: bookId
        },
        include: [{
          model: db.Author,
          as: "Commentor"
        },
        {
          model: db.Book
        }]
      }); 
      let commentArr= []; 
      for (const comment of comments){
        commentArr.push(comment.dataValues); 
      }
      for (const commentData of commentArr){ 
        if (commentData.Commentor){
          if (commentData.Commentor.usePseudonym){
           commentData.CommentorName =commentData.Commentor.pseudonym; 
          } else{
           commentData.CommentorName=  `${commentData.Commentor.firstName} ${commentData.Commentor.lastName}`;
          }
        } else {
         commentData.CommentorName = "Anonymous"; 
        }
      }
      console.log(commentArr); 
    res.render("comments", {Comments: commentArr}); 
  }); 

  //get an individual book from the library
  app.get("/book/:id", function(req, res){
    const bookId= req.params.id; 
    db.Book.findOne({
      where: {
        id: bookId
      },
      include: db.Author})
    .then(function(dbBook){
     let bookData = dbBook.dataValues; 
      if (bookData.Author){
        if (bookData.Author.usePseudonym){
          bookData.authorName = bookData.Author.pseudonym; 
        } else{
          bookData.authorName=  `${bookData.Author.firstName} ${bookData.Author.lastName}`;
        }
      } else {
        bookData.authorName = "Anonymous"; 
      }
        res.render("book",bookData); 
        awsHandling.retrieveFile(`book${bookId}.pdf`, bookId);
    });
  }); 

  //add a book 
  app.get("/addBook",isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, "../public/newBookForm.html")); 
  }); 

}; 
