var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

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
            res.status(500).send(err); 
        }
    });

}; 