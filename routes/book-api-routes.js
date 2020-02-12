var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const path = require("path"); 
const AwsHandling = require("../aws/awsHandling"); 
const awsHandling = new AwsHandling();

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

    app.post("/api/books", async function(req, res) {
        try {
            const results = await db.Book.create({
                title: req.body.title,
                genre: req.body.genre
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
                await bookFile.mv(`./uploads/${bookId}/`+ bookFile.name);
               let file = path.join(__dirname,`../uploads/${bookId}/${bookFile.name}`); 
               console.log(file); 
               await awsHandling.upload(file, bookId);
                res.send({
                    status: true,
                    message: "File is uploaded",
                    data: {
                        name: bookFile.name,
                        mimetype: bookFile.mimetype,
                        size: bookFile.size
                    }
                }); 
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