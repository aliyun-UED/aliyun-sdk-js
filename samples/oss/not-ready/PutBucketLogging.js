var oss = require('./oss');

// -------------------------------
// 5.3.10 Put Bucket Acl
// -------------------------------

// todo: not ready

oss.putBucketLogging({
  Bucket: 'chylvina',
  BucketLoggingStatus: {
    LoggingEnabled: {
      TargetBucket: 'chylvina',
      TargetPrefix: 'log'
    }
  }
}, function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  console.log('success:', data);
});