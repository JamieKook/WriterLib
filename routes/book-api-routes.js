var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const path = require("path"); 
const AwsHandling = require("../aws/awsHandling"); 
const awsHandling = new AwsHandling();
const PdfHandling = require("../pdfsplit"); 
const pdfHandling = new PdfHandling(); 

module.exports = function(app) {

    app.get("/api/books", function(req, res){
        db.Book.findAll({})
            .then(function(dbBook){
                res.json(dbBook); 
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
            const imgPaths = await pdfHandling.createImages(bookId); 
            console.log(imgPaths); 
            const imgPathsArr = Object.values(imgPaths); 
             console.log(imgPathsArr); 
             let bookImgObs=[]; 
             for (const image of imgPathsArr){
                const path = image.replace("public/", "/");
                let imgObj= {image: path}; 
                bookImgObs.push(imgObj); 
             } 
             console.log(bookImgObs); 
           //render book handlebars here with imgPaths array
            res.render("books",{book: bookImgObs}); 
        //    pdfHandling.deleteTempBookFolder(bookId); 
        } catch(err) {
            console.log(err); 
        }
    }); 

    app.post("/api/books/fileUpload", async function(req, res) {
        try {
            const results = await db.Book.create({
                title: req.body.title,
                genre: req.body.genre,
                }); 
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
                // await awsHandling.upload(bookFile, bookId);
                const imgPaths = await pdfHandling.createImages(bookId);
                console.log(imgPaths); 
            const imgPathsArr = Object.values(imgPaths); 
             console.log(imgPathsArr); 
             let bookImgObs=[]; 
             for (const image of imgPathsArr){
                const path = image.replace("public/", "/");
                let imgObj= {image: path}; 
                bookImgObs.push(imgObj); 
             } 
             console.log(bookImgObs); 
           //render book handlebars here with imgPaths array
            res.render("books", {book: bookImgObs});
                // pdfHandling.deleteTempBookFolder(bookId); 
            }
            // res.status(200); 
            // res.json(results); 
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
}; 