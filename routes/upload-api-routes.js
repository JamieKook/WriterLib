var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
// const upload= require("../aws/upload"); 
const path = require("path"); 
const AwsHandling = require("../aws/awsHandling"); 
const awsHandling = new AwsHandling(); 

module.exports = function(app) {


    app.get("/download-bookfile/:id", async function(req, res){
        try {
            let bookId= req.params.id; 
            await awsHandling.retrieveFile(`book${bookId}.pdf`, bookId); 
    
        } catch(err) {
            console.log(err); 
        }
    }); 

    app.get("/upload-bookfile", async function(req, res){
        try {
            await awsHandling.listObjects(); 
    
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
                await bookFile.mv("./uploads/"+ bookFile.name);
               let file = path.join(`./uploads/${bookFile.name}`); 
               console.log(file); 
               await awsHandling.upload(file, 13);
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