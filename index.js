var cp = require("child_process");
var chokidar = require("chokidar");

watch("css/**/*.styl", "npm run build-css");
watch("lib/**/*.js", "npm run build-js");

function watch(glob, cmd) {
  chokidar.watch(glob).on("change", function () {
    exec(cmd);
  });
}

function exec(cmd) {
  cp.exec(cmd, function (err, stdout, stderr) {
    err && console.error(err);
    stdout && console.log(stdout);
    stderr && console.log(stderr);
  });
}
