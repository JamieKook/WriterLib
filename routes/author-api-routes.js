var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

    app.get("/api/authors", function(req, res){
        db.Author.findAll({})
            .then(function(dbAuthor){
                res.json(dbAuthor); 
            }); 
    }); 

    app.post("/api/authors", function(req, res) {
        db.Author.create(req.body)
        .then(function(results) {
        res.status(200); 
        res.json(results); 
        })
        .catch(function(err) {
            console.log(err); 
        });
    });

   

}