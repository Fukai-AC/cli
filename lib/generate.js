var join = require('path').join;
var mkdir = require('fs').mkdir;
var existsSync = require('fs').existsSync;
var readFileSync = require('fs').readFileSync;
var fsExtra = require('fs-extra');
var ejs = require('ejs');
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
  createFolder(name, join(cwd, path), files);
}

function createRoute(name, path, cwd) {
  let files = [];
  let folderFiles = [];
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
  folderFiles.push(
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
  createFolder(name, path, files);
  path = join(path, name);
  createFolder('components', join(cwd, path), []);
  createFolder('modules', join(cwd, path), folderFiles);
}

function createFolder(name, path, files) {
  var folderPath = join(path, name);
  if (existsSync(folderPath)) {
    console.log(error('folder exists'));
    return;
  }
  mkdir(folderPath, 0777, function(err) {
    if (err) throw err;
    console.log(success(`创建${name}文件夹成功！`));
  })
  if (files.length <= 0) {
    return;
  }
  createFile(folderPath, files);
}

function createFile(path, files) {
  var fileStr = readFileSync(join(__dirname, '../templates/tmp_tsx.ejs'), 'utf8');
  var compileStr = ejs.compile(fileStr)({
    cmpName: 'Dialog',
    moduleCmp: true
  });
  
  fsExtra.outputFileSync(join(path, 'index.tsx'), compileStr, 'utf-8')

  console.log(success('文件创建成功'));
}

module.exports = generate;