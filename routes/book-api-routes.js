var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const path = require("path"); 
const AwsHandling = require("../aws/awsHandling"); 
const awsHandling = new AwsHandling();
const PdfHandling = require("../pdfsplit"); 
const pdfHandling = new PdfHandling(); 

module.exports = function(app) {

    app.get("/api/books", function(req, res){
        db.Book.findAll({include: db.Author})
            .then(function(dbBook){
                console.log(dbBook); 
                res.json(dbBook); 
                // res.render("library",{book: dbBook}); 
            }); 
    }); 

    app.get("/api/books/:id", function(req,res){
        console.log(req.params.id); 
        db.Book.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(book){
            res.json(book); 
        }).catch(function(err){
            res.status(404).json(err); 
        });
    }); 

    app.get("/api/books/fileDownload/:id", async function(req, res){
        try {
            const bookId= req.params.id; 
            await awsHandling.retrieveFile(`book${bookId}.pdf`, bookId);
            // const file = `./public/tmp/${bookId}/book${bookId}.pdf`;  
            // res.download(file);
            // var file = fs.createReadStream(filePath);
            // file.pipe(res)
            await pdfHandling.otherCreate(bookId); 
        //     const imgPaths = await pdfHandling.createImages(bookId);  
        //     const imgPathsArr = Object.values(imgPaths); 
        //      console.log(imgPathsArr); 
        //      let bookImgObs=[]; 
        //      for (const image of imgPathsArr){
        //         const path = image.replace("public/", "/");
        //         let imgObj= {image: path}; 
        //         bookImgObs.push(imgObj); 
        //      } 
        //      console.log(bookImgObs); 
        //    //render book handlebars here with imgPaths array
        //     res.render("books",{book: bookImgObs}); 
        //    pdfHandling.deleteTempBookFolder(bookId); 
        } catch(err) {
            console.log(err); 
        }
    }); 

    app.post("/api/books/fileUpload", isAuthenticated, async function(req, res) {
        try {
            console.log(req.body); 
            console.log(req.user);
            let userId = req.user.id; 
            const authorData = await db.Author.findOne({
                where: {
                    UserId: userId
                }
            }); 

            console.log(authorData);  
            let authorId = authorData.id; 
            const results = await db.Book.create({
                title: req.body.title,
                genre: req.body.genre,
                type: req.body.type,
                description: req.body.description,
                imageURL: req.body.url,
                AuthorId: authorId
                }); 
            console.log(results); 
            const bookId = results.id;  
            if(!req.files) {
                res.send({
                    status: false,
                    message: "No file uploaded",
                    json: results
 
                }); 
            } else {
                let bookFile = req.files.bookFile;
                console.log(bookFile);  
                bookFile.mv(`./public/tmp/${bookId}/book${bookId}.pdf`);
                pdfHandling.createTempBookFolder(bookId); 
                await awsHandling.upload(bookFile, bookId);
            //     const imgPaths = await pdfHandling.createImages(bookId);
            //     console.log(imgPaths); 
            // const imgPathsArr = Object.values(imgPaths); 
            //  console.log(imgPathsArr); 
            //  let bookImgObs=[]; 
            //  for (const image of imgPathsArr){
            //     const path = image.replace("public/", "/");
            //     let imgObj= {image: path}; 
            //     bookImgObs.push(imgObj); 
            //  } 
            //  console.log(bookImgObs); 
           //render book handlebars here with imgPaths array
            // res.render("books", {book: bookImgObs});
            // res.json(results); 
                res.status(200); 
                res.json(results); 
                // pdfHandling.deleteTempBookFolder(bookId); 
            }
            // res.status(200); 
            // res.json(results); 
        } catch (err) {
            console.log(err); 
        }
    });

    app.delete("/api/books/:id", isAuthenticated, function(req, res){
            db.Book.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(book){
            res.status(200); 
            res.json(book); 
        }).catch(function(err){
            console.log(err); 
        }); 
    }); 


    app.put("/api/edit/:id", isAuthenticated, async function(req, res) {
        try {
         
            const updates={
                genre: req.body.genre,
                type: req.body.type
            }; 

            console.log(req.body.title.trim()); 
            if (req.body.title !== ""){
                updates.title = req.body.title
            }
            if (req.body.url !== ""){
                updates.imageURL = req.body.url
            }
            if (req.body.description !== ""){
                updates.description = req.body.description
            }
            if (req.body.keywords !== ""){
                updates.keywords = req.body.keywords
            }
            console.log("------------------------"); 
            console.log(updates); 
            const results = await db.Book.update(updates,
                {where: {
                    id: req.params.id
                }
                }); 
            if(!req.files) {
                res.send({
                    status: false,
                    message: "No file uploaded",
                    json: results
 
                }); 
            } else {
                let bookFile = req.files.bookFile;
                console.log(bookFile);  
                bookFile.mv(`./public/tmp/${bookId}/book${bookId}.pdf`);
                pdfHandling.createTempBookFolder(bookId); 
                await awsHandling.upload(bookFile, bookId); 
                res.status(200); 
                res.json(results); 
            }
    
        } catch (err) {
            console.log(err); 
        }
    });

    app.delete("/api/books/:id", isAuthenticated, function(){
        db.Book.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(book){
            res.json(book); 
        }).catch(function(err){
            res.status(404); 
        }); 
    }); 

   app.put("/api/book/:id", isAuthenticated, function(){
       db.Book.update(req.body,
        {
            where: {
                id: req.params.id
            }
       }).then(function(book){
           res.json(book); 
       }).catch(function(err){
           res.status(404); 
       }); 
   });
   
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
}; 