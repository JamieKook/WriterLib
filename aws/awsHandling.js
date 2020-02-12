const fs = require('fs');
const AWS = require('aws-sdk');

const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    bucket: BUCKET_NAME,
});

class AwsHandling{

    upload(fileName, bookId){
        // Read content from the file
        const fileContent = fs.readFileSync(fileName);
        //Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: `book${bookId}.pdf`, // file name we want to save as in S3
            Body: fileContent
        };

        //Uploading files to the bucket
        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        }); 
    }    
    
    listObjects(){
       
        var params = {
            Bucket: BUCKET_NAME, 
            MaxKeys: 2
           };
           s3.listObjects(params, function(err, data) {
             if (err) console.log(err, err.stack); // an error occurred
             else     console.log(data); 
            }); 
        }   

    retrieveFile(fileName, res){

        var params = {
            Bucket: BUCKET_NAME, 
            Key: fileName
        };
    
        s3.getObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                console.log(data); 
                return data;  
            }     
            
        }); 
    }

}

module.exports= AwsHandling; 
