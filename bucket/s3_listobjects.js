const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east'});

s3 = new AWS.S3({apiVersion: '2006-03-01'});
// Create the parameters for calling listObjects
var bucketParams = {
    Bucket : 'writersrooms',
  };
  
  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });