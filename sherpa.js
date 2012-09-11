/*jshint laxcomma:true strict:false*/
/*globals module require*/
var fs   = require("fs")
  , path = require("path")
  , util = require('util');

function puts(error, stdout/*, stderr*/) {
  util.puts(stdout);
}

function walk (start, callback) {
  fs.lstat(start, function (err, stat) {
    if (err) { return callback(err); }
    if (stat.isDirectory()) {

      fs.readdir(start, function (err, files) {
        var coll = files.reduce(function (acc, i) {
          var abspath = path.join(start, i);

          if (fs.statSync(abspath).isDirectory()) {
            walk(abspath, callback);
            acc.dirs.push(abspath);
          } else {
            acc.names.push(abspath);
          }

          return acc;
        }, {"names": [], "dirs": []});

        return callback(null, start, coll.names);
      });
    } else {
      return callback(new Error("path: " + start + " is not a directory"));
    }
  });
}

module.exports = function (root, interval, callback) {
  if (arguments.length < 2) {
    throw("Invalid arguments");
  }

  if (typeof callback === "undefined" && typeof interval === "function") {
    callback = interval;
    interval = undefined;
  }

  var opts = {
          persistent: true
        , interval: interval || 5007
      };

  puts(null, "Watching " + root + " every " + opts.interval / 1000 + " seconds for changes...");

  walk(root, function (err, dir, files) {
    files
      .forEach(function (filename) {
        fs.watchFile(filename, opts, callback.bind(null, filename));
      });
  });

}
