var sls = require("./sls");

// -------------------------------
// list project
// -------------------------------
var projectName = "";

sls.listProject(
  {
    projectName: projectName,
    offset: 0,
    size: 10
  },
  function (err, data) {
    if (err) {
      console.log("error:", err);
      return;
    }

    console.log("success:", data.body.projects);
  }
);
