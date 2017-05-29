
var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var files = [
  { "themarklet.json": "../package.json" },
  { "gulpfile.js": "../gulpfile.js" },
  { "app.js": "../app.js" },
  { "themetools.js": "../js/themetools.js" },
  { "_themarklet.less": "../css/less/_themarklet.less"},
  { "local.js": "../js/local.js" },
  { "bookmarklet.js": "../bookmarklet.js"}
];

//fs.createReadStream('test.txt').pipe(fs.createWriteStream('../newTest.txt'));

files.map(function(file){
  Object.keys(file).forEach(function(key) {
    var dir = path.parse(file[key]).dir;
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, function(err) {
        if (err && err.errno === -2) {
          console.log('Please make %s by hand and run `npm run build` again', dir);
          process.exit(0);
        }
      });
    }
    fs.createReadStream(key).pipe(fs.createWriteStream(file[key]));
  });
});

console.log('Now downloading packages. Please wait...');
process.chdir('../');
exec('npm install', function(error, stdout, stderr) {
  if (error) {
    console.log(stderr);
  } else {
    console.log(stdout);
    console.log("Install Complete!");
    console.log('\t\t`cd .. ; gulp`');
  }
});