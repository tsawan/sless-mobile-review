// default photo storage layer for review.

import * as AWS from "aws-sdk";

const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new XAWS.S3({
  signatureVersion: "v4"
});

export class ReviewPhoto {
  static getPhotoUrl(photoId: string) {
    return `https://${bucketName}.s3.amazonaws.com/${photoId}`;
  }
  
  static getSignedUrl(photoId: string) {
    return s3.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: photoId,
      Expires: parseInt(urlExpiration)
    });
  }
}
