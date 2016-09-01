/*jshint laxcomma:true strict:false*/
/*globals module require*/
var exec = require('child_process').exec
  , fs   = require("fs")
  , path = require("path");

function log(error, stdout, stderr) {
  console.log(stdout);
  if (stderr) {
    console.log(stderr);
  }
}

function valid_args (args) {
  return args.length > 1 &&
          args[0] != null && args[1] != null &&
          typeof [].pop.call(args) === "function";
}

function valid_root (val) {
  return val !== "" &&
          /String/.test({}.toString.call(val));
}

function walk (start, callback) {
  fs.lstat(start, function (err, stat) {
    if (err) { return callback(err); }
    if (stat.isDirectory()) {

      fs.readdir(start, function (err, files) {
        var coll = files.reduce(function (acc, i) {
          var abspath = path.join(start, i);

          fs.statSync(abspath).isDirectory()
            ? walk(abspath, callback)
            : acc.push(abspath);

          return acc;
        }, []);

        return callback(null, start, coll);
      });
    } else {
      return callback(new Error("path: " + start + " is not a directory"));
    }
  });
}

module.exports = function (root, interval, callback) {
  if (!valid_root(root) || !valid_args(arguments)) {
    throw("Invalid arguments");
  }

  if (!callback && !!interval) {
    callback = interval;
    interval = null;
  }

  var opts = {
        persistent: true
      , interval: interval || 5007
      };

  log(null, "Watching " + root + " every " + opts.interval / 1000 + " seconds for changes...");

  walk(root, function (err, dir, files) {
    files
      .forEach(function (filename) {
        fs.watchFile(filename, opts, callback.bind(null, filename));
      });
  });

};

module.exports.exec = function notify (filename, command) {
  log(null, "\nChange made to: " + filename);

  command && exec(command, log);
};

module.exports.log = log;

// only exposed for testing purposes - if they get mangled so be it
module.exports.valid = {
  args: function () {
    return valid_args.apply(null, [].slice.call(arguments, 0));
  }

  ,root: function (val) {
    return valid_root(val);
  }
};
