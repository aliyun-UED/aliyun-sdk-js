var memcached = require('./memcached');

// -------------------------------
// https://code.google.com/p/memcached/wiki/MemcacheBinaryProtocol
// 4.5. Increment
// -------------------------------

// set value
memcached.set('hello', 1, function(err, data) {
  if(err) {
    console.log('set error:', err);
    return;
  }

  console.log('set success:', data);
});

// increase value
memcached.increment('hello', 6, function(err, data) {
  if(err) {
    console.log('increment error:', err);
    return;
  }

  console.log('increment success:', data);
});

// get value
memcached.get('hello', function(err, data) {
  if(err) {
    console.log('get error:', err);
    return;
  }

  console.log('get success:', data);

  memcached.end();
});
