var ots = require('./ots');

ots.createTable({
      instance_name: 'chylvina',
      table_meta: {
        table_name: 'table1',
        primary_key: [
          {
            name: 'key1',
            type: 'STRING'
          }
        ]
      },
      reserved_throughput: {
        capacity_unit: {
          read: 1,
          write: 1
        }
      }
    },
    function (err, data) {
      if (err) {
        console.log('error:', err);
        return;
      }

      console.log('success:', data);
    });
