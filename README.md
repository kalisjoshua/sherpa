# Sherpa

Watch files in a directory for changes/updates.

I know that this might not be the best way to do this but it seems to work for right now so I am putting it out there. Simply create a file to execute in the terminal (example below) and point it at the directory you would like to watch. When a file is changed the callback you pass in will execute and you can do whatever you want with the change.

I have started using this in conjunction with Grunt.js so I don't have to grunt with each change to my files while developing.

## Basic Usage

Create a file in the root of your project with the contents below; don't forget chmod +x <filename>.

    /*jshint laxcomma:true strict:false*/
    /*globals require*/
    var exec = require('child_process').exec
      , sherpa = require("sherpa")

    function notify (filename, command) {
      sherpa.puts(null, "\nChange made to: " + filename);

      command && exec(command, sherpa.puts);
    }

    sherpa("src", 300, function (filename, curr, prev) {
      if (+curr.mtime !== +prev.mtime) {
        switch (/.*\.(.*)$/.exec(filename)[1]) {
          case "js":
            notify(filename, "grunt js");
            break;
          case "less":
            notify(filename, "grunt less");
            break;
          default:
            notify(filename + " but no action was taken");
            break;
        }
      }
    });

## Testing

I have started some simple tests using expresso. To run tests simply ensure that the npm modules are installed by executing `npm install` in the root directory. Then execute `expresso` in the root. Hopefully all tests should pass.
