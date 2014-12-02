// Based on Glacier's example: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/examples.html#Amazon_Glacier__Multi-part_Upload
var oss = require('./oss');

// -------------------------------
// 5.5 Multipart Upload
// -------------------------------

// todo: Abort Multipart Upload, List Multipart Uploads, List Parts 没有sample

var fs = require('fs');

// File
var fileName = 'test.mp3';
var filePath = './' + fileName;
var fileKey = fileName;
var buffer = fs.readFileSync(filePath);
// Upload options
var bucket = 'chylvina';

// Upload
var startTime = new Date();
var partNum = 0;
var partSize = 1024 * 1024 * 5; // Minimum 5MB per chunk (except the last part)
var numPartsLeft = Math.ceil(buffer.length / partSize);
var maxUploadTries = 3;

var multipartMap = {
  Parts: []
};

function completeMultipartUpload(oss, doneParams) {
  oss.completeMultipartUpload(doneParams, function (err, data) {
    if (err) {
      console.log("An error occurred while completing the multipart upload");
      console.log(err);
    } else {
      var delta = (new Date() - startTime) / 1000;
      console.log('Completed upload in', delta, 'seconds');
      console.log('Final upload data:', data);
    }
  });
}

function uploadPart(oss, multipart, partParams, tryNum) {
  var tryNum = tryNum || 1;
  oss.uploadPart(partParams, function (multiErr, mData) {
    if (multiErr) {
      console.log('multiErr, upload part error:', multiErr);
      if (tryNum < maxUploadTries) {
        console.log('Retrying upload of part: #', partParams.PartNumber)
        uploadPart(oss, multipart, partParams, tryNum + 1);
      } else {
        console.log('Failed uploading part: #', partParams.PartNumber)
      }
      return;
    }
    multipartMap.Parts[this.request.params.PartNumber - 1] = {
      ETag: mData.ETag,
      PartNumber: Number(this.request.params.PartNumber)
    };
    console.log("Completed part", this.request.params.PartNumber);
    console.log('mData', mData);
    if (--numPartsLeft > 0) return; // complete only when all parts uploaded

    var doneParams = {
      Bucket: bucket,
      Key: fileKey,
      CompleteMultipartUpload: multipartMap,
      UploadId: multipart.UploadId
    };

    console.log("Completing upload...");
    completeMultipartUpload(oss, doneParams);
  });
}

// Multipart
console.log("Creating multipart upload for:", fileKey);
oss.createMultipartUpload({
  ACL: 'public-read',
  Bucket: bucket,
  Key: fileKey,
  ContentType: 'audio/mpeg',
  ContentDisposition: ''
  //CacheControl: '',
  //ContentEncoding: '',
  //Expires: '',
  //ServerSideEncryption: ''
}, function (mpErr, multipart) {
  if (mpErr) {
    console.log('Error!', mpErr);
    return;
  }
  console.log("Got upload ID", multipart.UploadId);

  // Grab each partSize chunk and upload it as a part
  for (var rangeStart = 0; rangeStart < buffer.length; rangeStart += partSize) {
    partNum++;
    var end = Math.min(rangeStart + partSize, buffer.length),
      partParams = {
        Body: buffer.slice(rangeStart, end),
        Bucket: bucket,
        Key: fileKey,
        PartNumber: String(partNum),
        UploadId: multipart.UploadId
      };

    // Send a single part
    console.log('Uploading part: #', partParams.PartNumber, ', Range start:', rangeStart);
    uploadPart(oss, multipart, partParams);
  }
});