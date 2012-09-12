/*jshint laxcomma:true strict:false*/
/*globals console module require*/
var fs   = require("fs")
  , path = require("path")
  , util = require("util");

function valid_args (args) {
  return args.length > 1 &&
          args[0] != null && args[1] != null &&
          typeof [].pop.call(args) === "function";
}

function valid_root (val) {
  return val !== "" &&
          {}.toString.call(val) === "[object String]";
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
  if (!valid_root(root) || !valid_args(arguments)) {
    throw("Invalid arguments");
  }

  if (!callback && !!interval) {
    callback = interval;
    interval = undefined;
  }

  var opts = {
          persistent: true
        , interval: interval || 5007
      };

  console.log("Watching", root, "every", opts.interval / 1000, "seconds for changes...");

  walk(root, function (err, dir, files) {
    files
      .forEach(function (filename) {
        fs.watchFile(filename, opts, callback.bind(null, filename));
      });
  });

};

module.exports.puts = function puts(error, stdout, stderr) { util.puts(stdout); };

module.exports.valid = {
  args: function () {
    return valid_args.apply(null, [].slice.call(arguments, 0));
  }

  ,root: function (val) {
    return valid_root(val);
  }
};
