#!/usr/local/bin/node
var join = require('path').join;
var mkdir = require('fs').mkdir;
var existsSync = require('fs').existsSync;
var readFileSync = require('fs').readFileSync;
var chmod = require('fs').chmod;
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

  if (path && !existsSync(path)) {
    error(console.log('路径不存在！'));
    return false;
  }
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
  let cmpName = name.slice(0, 1).toUpperCase() + name.slice(1);
  let files = [];
  files.push(
    {
      file_type: 'tsx',
      file_name: 'index',
      template: ejs.compile(
        readFileSync(join(__dirname, '../templates/tmp_tsx.ejs'), 'utf8')
      )({ cmpName: cmpName, moduleCmp: false }),
    },
    {
      file_type: 'scss',
      file_name: 'index',
      template: '',
    }
  );
  createFolder(name, join(cwd, path), files);
}

function createRoute(name, path, cwd) {
  let files = [];
  let folderFiles = [];
  let cmpName = name.slice(0, 1).toUpperCase() + name.slice(1);
  files.push(
    {
      file_type: 'ts',
      file_name: 'route',
      template: ejs.compile(
        readFileSync(join(__dirname, '../templates/tmp_route.ejs'), 'utf8')
      )({ cmpName: cmpName + 'Container', routeName: name }),
    },
    {
      file_type: 'tsx',
      file_name: 'index',
      template: ejs.compile(
        readFileSync(join(__dirname, '../templates/tmp_tsx.ejs'), 'utf8')
      )({ cmpName: cmpName, moduleCmp: true }),
    },
    {
      file_type: 'scss',
      file_name: 'index',
      template: '',
    }
  );
  folderFiles.push(
    {
      file_type: 'ts',
      file_name: 'reducer',
      template: ejs.compile(
        readFileSync(join(__dirname, '../templates/tmp_reducer.ejs'), 'utf8')
      )({ reducerName: name + '_reducer', }),
    },
    {
      file_type: 'ts',
      file_name: 'saga',
      template: ejs.compile(
        readFileSync(join(__dirname, '../templates/tmp_saga.ejs'), 'utf8')
      )({ sagaName: name + 'Saga' }),
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
  files.every((item, key) => {
    let filePath = join(path, item.file_name + '.' + item.file_type);
    if (existsSync(filePath)) {
      console.log(error('file exists'));
      return true;
    }
    fsExtra.outputFileSync(
      filePath,
      item.template,
      {
        encoding: 'utf-8'
      }
    );
    chmod(filePath, 0o777);
    console.log(success(`创建${filePath}文件成功！`));
    return true;
  });
}

module.exports = generate;