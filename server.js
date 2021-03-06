// Requiring necessary npm packages
require('dotenv').config();
const express = require("express");
const fs = require("fs"); 

const fileUpload= require("express-fileupload"); 
const cors = require("cors"); 
const bodyParser = require("body-parser");
const morgan = require("morgan");  
const _ = require("lodash"); 

//file upload stuff
const exphbs = require("express-handlebars"); 
const session = require("express-session");
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//More on file upload
app.use(fileUpload({
  createParentPath: true
})); 
app.use(cors()); 
// app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({extended: true})); 
app.use(morgan("dev")); 

app.engine("handlebars", exphbs({defaultLayout: "main"})); 
app.set("view engine", "handlebars"); 

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/author-api-routes.js")(app);
require("./routes/book-api-routes.js")(app);
require("./routes/comments-api-routes.js")(app);
// require("./routes/upload-api-routes")(app); 

const dir = `./public/tmp/`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }; 

//set interval for deleting folders
const PdfHandling = require("./pdfsplit"); 
const pdfHandling = new PdfHandling(); 
pdfHandling.deleteOldTempBookFolder(Date.now()); 

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
