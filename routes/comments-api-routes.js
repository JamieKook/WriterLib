var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const path = require("path"); 



module.exports = function(app) {
    
    app.post("/api/comments/:id", isAuthenticated, async function(req, res){
       console.log("info below: "); 
        console.log(req.body.comment); 
        let userId = req.user.id; 
        const authorData = await db.Author.findOne({
            where: {
                UserId: userId
            }
        }); 

        console.log(authorData);  
        let commentorId = authorData.id;
        const results = await db.Comment.create({
            comment: req.body.comment,
            BookId: req.params.id,
            CommentorId: commentorId
        }); 
    }); 

}