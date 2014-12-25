var sls = require('./sls');

// -------------------------------
// list logStores
// -------------------------------
var projectName = "project_name1";

sls.listLogStores(projectName, function (err, data) {

    if (err) {
        console.log('error:', err);
        return;
    }

    console.log('success:', data);

});