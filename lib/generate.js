var join = require('path').join;
var fs = require('fs');
var chalk = require('chalk');
var success = chalk.green;
var error = chalk.red;

function generate(program, { cwd }) {
  var defaultBase = 'src';
  var defalutComponent = join(defaultBase, 'components');
  var defaultRoutes = join(defaultBase, 'routes');

  var args = program.args;
  var type = args[0];
  var name = args[1];
  var path = args[2];

  switch (type) {
    case 'component':
      path = path || defalutComponent;
      createComponent(name, path, cwd);
      break;
    case 'route':
      path = path || defaultRoutes;
      createRoute(name, path, cwd);
      break;
    default:
      console.log(error(`ERROR: uncaught type ${type}`));
      break
  }
}

function createComponent(name, path, cwd) {
  let files = [];
  files.push(
    {
      type: 'component',
      file_type: 'tsx',
      file_name: name,
      params: {
        name: name,
      },
    },
    {
      type: 'component',
      file_type: 'tsx',
      file_name: name,
      params: {
        name: name,
      },
    }
  );
  createFile(join(cwd, path), files);
}

function createRoute(name, path, cwd) {
  console.log(path);
  let files = [];
  let folder_files = [];
  files.push(
    {
      type: 'route',
      params: {
        name: name,
      },
      file_type: 'ts',
      file_name: 'route',
    },
    {
      type: 'route',
      params: {
        name: name,
      },
      file_type: 'tsx',
      file_name: 'index',
    },
    {
      type: 'route',
      params: {
        name: name,
      },
      file_type: 'scss',
      file_name: 'index',
    }
  );
  folder_files.push(
    {
      type: 'action',
      file_type: 'ts',
      file_name: 'action',
    },
    {
      type: 'reducer',
      file_type: 'ts',
      file_name: 'reducer',
      params: {
        name: name,
      },
    },
    {
      type: 'saga',
      file_type: 'ts',
      file_name: 'saga',
      params: {
        name: name,
      },
    }
  );
  createFolder(name, path, []);
  path = join(path, name);
  createFolder('components', join(cwd, path), []);
  createFolder('modules', join(cwd, path), folder_files);
}

function createFolder(name, path, files) {
  var folderPath = join(path, name);
  if (fs.existsSync(folderPath)) {
    console.log(error('folder exists'));
    return;
  }
  fs.mkdir(folderPath, 0777, function(err) {
    if (err) throw err;
    console.log(success(`创建${name}文件夹成功！`));
  })
  if (files.length <= 0) {
    return;
  }
  createFile(folderPath, files);
}

function createFile(path, files) {

  console.log(path);
}

module.exports = generate;