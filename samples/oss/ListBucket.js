var oss = require('./oss');

// -------------------------------
// 5.2.1 GetService (ListBucket)
// -------------------------------

oss.listBuckets({
	Marker: '',
	MaxKeys: 100
},function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  console.log('success:', data);
});