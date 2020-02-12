var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
// const upload= require("../aws/upload"); 
const path = require("path"); 
const AwsHandling = require("../aws/awsHandling"); 
const awsHandling = new AwsHandling(); 

module.exports = function(app) {


    app.get("/upload-bookfile", async function(req, res){
        try {
            let bookId= 1; 
            let bookFile = await awsHandling.retrieveFile(`book${bookId}.pdf`); 
            bookFile.mv(`./tmp/book${bookId}.pdf`); 
        } catch(err) {
            console.log(err); 
        }

    }); 


    app.post("/upload-bookfile", async function (req, res) {
        console.log(req.body); 
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: "No file uploaded"
                }); 
            } else {
                let bookFile = req.files.bookFile; 
                bookFile.mv("./uploads/"+ bookFile.name);
               let file = "/Users/jamiekook/Repos/WriterLib/uploads/The Aged Mother.pdf"
               upload(file); 
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
        }catch (err) {
            console.log(err); 
            res.status(500).send(err); 
        }
    });

}; 