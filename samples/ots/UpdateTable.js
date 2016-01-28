var ots = require('./ots');

ots.updateTable({
      instance_name: 'chylvina',
      table_name: "table1",
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
