var join = require('path').join;
var Git = require("nodegit");
var fs = require('fs-extra');

function init(program, {cwd}) {
  console.log("=======================================================\n\n");
  console.log(program.args);
  var type = program.args[0] || 'single';
  var path = program.args[1] || 'example';
  var repositorie = '';
  if (type === 'single') {
    repositorie = 'https://github.com/Fukai-AC/react_scaffold.git';
  } else if (type === 'composite') {
    repositorie = 'https://github.com/Fukai-AC/react-composite-application.git';
  } else {
    return false;
  }
  Git.Clone(repositorie, path, {
    fetchOpts: {
      callbacks: {
        certificateCheck: function() {
          // github will fail cert check on some OSX machines
          // this overrides that check
          return 1;
        }
      }
    }
  }).done(function() {
    fs.remove(join(cwd, path, '.git'), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("success!");
      }
    });
  });
}

module.exports = init;