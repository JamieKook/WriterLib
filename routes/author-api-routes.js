var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

    app.get("/api/authors", function(req, res){
        db.Author.findAll({})
            .then(function(dbAuthor){
                res.json(dbAuthor); 
            }); 
    }); 

    app.get("/api/authors/:id", function(req,res){
        console.log(req.params.id); 
        db.Author.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(author){
            res.json(author); 
        }).catch(function(err){
            res.status(404).json(err); 
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

    app.delete("/api/authors/:id", isAuthenticated, function(){
        db.Author.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(author){
            res.json(author); 
        }).catch(function(err){
            res.status(404); 
        }); 
    }); 

   app.put("/api/author/:id", isAuthenticated, function(){
       db.Author.update(req.body,
        {
            where: {
                id: req.params.id
            }
       }).then(function(author){
           res.json(author); 
       }).catch(function(err){
           res.status(404); 
       }); 
   }); 
}; 