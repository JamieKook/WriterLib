const fs = require('fs');
const AWS = require('aws-sdk');
const PdfHandling = require("../pdfsplit"); 
const pdfHandling = new PdfHandling(); 
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    bucket: BUCKET_NAME,
});

class AwsHandling{

    async upload(fileName, bookId){
        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: `book${bookId}.pdf`, // file name we want to save as in S3
            Body: fileName.data,
            ContentType: "application/pdf"
        };

        //Uploading files to the bucket
       const upload = s3.upload(params).promise();
        upload.then(function(data) {
            console.log(`File uploaded successfully. ${data.Location}`);
        })
        .catch(function(err) {
            console.log(err);
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

    async retrieveFile(fileName, bookId){

        var params = {
            Bucket: BUCKET_NAME, 
            Key: fileName
        };
    const getObjectPromise = s3.getObject(params).promise();
            await getObjectPromise.then(function(data) {
            console.log(data); 
            pdfHandling.createTempBookFolder(bookId); 
            fs.writeFileSync(`./tmp/${bookId}/book${bookId}.pdf`, data.Body); 
            console.log(`./tmp/${bookId}/book${bookId}.pdf has been created!`);
        }).catch(function(err) {
          console.log(err);
        });
    
    }

    deleteFile() {
        var params = {
            Bucket: 'BUCKET_NAME',
            Key: 'FILENAME'
        };
        s3.deleteObject(params, function (err, data) {
            if (data) {
                console.log("File deleted successfully");
            }
            else {
                console.log("Check if you have sufficient permissions : "+err);
            }
        });
    }
}

module.exports= AwsHandling; 
