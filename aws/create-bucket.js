const AWS = require('aws-sdk');
const ID = process.env.ID;
const SECRET = process.env.SECRET;

const BUCKET_NAME = process.env.BUCKET;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET,
    CreateBucketConfiguration: {
        LocationConstraint: "eu-west-1"
    }
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.location);
});