const fs = require('fs');
const AWS = require('aws-sdk');

const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

function retrieveFile(filename){

    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
        bucket: BUCKET_NAME,
    });

    
    var params = {
        Bucket: BUCKET_NAME, 
        Key: filename
    };

   s3.getObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);  
  }); 
}

function listObjects(){
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
        bucket: BUCKET_NAME,
    });
    var params = {
        Bucket: BUCKET_NAME, 
        MaxKeys: 5
       };
       s3.listObjects(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data); 
        }); 
    }   


listObjects(); 
