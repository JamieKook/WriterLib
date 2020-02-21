var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const path = require("path"); 
const AwsHandling = require("../aws/awsHandling"); 
const awsHandling = new AwsHandling();
const PdfHandling = require("../pdfsplit"); 
const pdfHandling = new PdfHandling(); 

module.exports = function(app) {

    //return all book data
    app.get("/api/books", function(req, res){
        db.Book.findAll({include: db.Author})
            .then(function(dbBook){
                console.log(dbBook); 
                res.json(dbBook); 
            }); 
    }); 

    //return individual book data
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

    //download a file from aws
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

    //upload a file to aws and create database for book
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

    //edit specific book
    app.put("/api/books/:id", isAuthenticated, async function(req, res) {
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


    //delete specific book
    app.delete("/api/books/:id", isAuthenticated, function(req, res){
        db.Book.destroy({
        where: {
            id: req.params.id
        }
        }).then(function(book){
            res.status(200); 
            res.json(book); 
        }).catch(function(err){
            res.status(404); 
        }); 
    }); 

app.get("/api/:filter/:choice", function(req, res){
    if (req.params.filter === "genre"){
        db.Book.findAll({
        include: db.Author,
        where: {
            genre: req.params.choice
        }
        }).then(function(dbBook){
            dataArrange(dbBook, res); 
        }); 
    } else if (req.params.filter === "type"){
        db.Book.findAll({
            include: db.Author,
            where: {
                type: req.params.choice
            }
            }).then(function(dbBook){
                dataArrange(dbBook, res); 
            }); 
    } else if (req.params.filter === "both"){
        let genre= req.params.choice.split("-")[0]; 
        let type = req.params.choice.split("-")[1]; 
        db.Book.findAll({
            include: db.Author,
            where: {
                genre: genre,
                type: type
            }
            }).then(function(dbBook){
                dataArrange(dbBook, res); 
            }); 
    }
});
    
}; 