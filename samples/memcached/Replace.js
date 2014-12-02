var memcached = require('./memcached');

// -------------------------------
// https://code.google.com/p/memcached/wiki/MemcacheBinaryProtocol
// 4.3. Replace
// -------------------------------

// delete 'hello' key 
memcached.delete('hello', function(err, data) {
  if(err) {
    console.log('delete error:', err);
    return;
  }

  console.log('delete success:', data);
});

// replace string，key不存在会报错。
memcached.replace('hello', 'world', function(err, data) {
  if(err) {
    console.log('replace error:', err);
    return;
  }

  console.log('add success:', data);
});

// set string
memcached.set('hello', 'world', function(err, data) {
  if(err) {
    console.log('set error:', err);
    return;
  }

  console.log('set success:', data);
});

// replace string，key存在, 替换成功。
memcached.replace('hello', 'new world', function(err, data) {
  if(err) {
    console.log('replace error:', err);
    return;
  }

  console.log('replace success:', data);
  
  // get value, 注意，需要在replace请求返回后再get，以保证获取到replace后的value
  memcached.get('hello', function(err, data) {
    if(err) {
      console.log('get error:', err);
      return;
    }

    console.log('get success:', data);

    memcached.end();
  });
});


