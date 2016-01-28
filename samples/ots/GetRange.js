var ots = require('./ots');

ots.getRange({
      instance_name: 'chylvina',
      table_name: "table1",
      direction: "FORWARD",
      inclusive_start_primary_key: [{
        name: "key1",
        value: {
          type: 'STRING',
          v_string: 'value string'
        }
      }],
      exclusive_end_primary_key: [{
        name: "key1",
        value: {
          type: 'STRING',
          v_string: 'value string1'
        }
      }]
    },
    function (err, data) {
      if (err) {
        console.log('error:', err);
        return;
      }

      console.log('success:', data);
    });
