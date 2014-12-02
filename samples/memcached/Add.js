var memcached = require('./memcached');

// -------------------------------
// https://code.google.com/p/memcached/wiki/MemcacheBinaryProtocol
// 4.3. Add
// -------------------------------

// add string，如果key存在则会报错。
memcached.add('hello', 'world', function(err, data) {
  if(err) {
    console.log('add error:', err);
    return;
  }

  console.log('add success:', data);
});

// add string, 10秒后数据过期。
memcached.add('hello1', 'world', 10, function(err, data) {
  if(err) {
    console.log('set error:', err);
    memcached.end();
    return;
  }

  console.log('set success:', data);

  // end connection
  memcached.end();
});
