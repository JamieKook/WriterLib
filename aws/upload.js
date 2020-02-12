const fs = require('fs');
const AWS = require('aws-sdk');

const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    //Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'file', // file name we want to save as in S3
        Body: fileContent
    };

    //Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log('File uploaded successfully. ${data.Location}');
    });
};