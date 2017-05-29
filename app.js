var express = require('express'),
    fs = require('fs'),
    app = express(),
    hostname = require('os').hostname(),
    port = process.env.PORT = 18735,

    bookmarklet = require('./bookmarklet').toString();
    bookmarklet = bookmarklet.replace(/localhost:\d+/g, hostname+':'+port);
    bookmarklet = 'javascript:(' + encodeURIComponent(bookmarklet) + ')();';

var app = express();

// Target this just to things
// requested from js folder
// app.use('/js', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res, next) {
  res.send('<p><a href="'+bookmarklet+'">themarklet</a></p><code style="word-wrap: break-word;">'+bookmarklet+'</code><p><small><strong>Please note</strong>: Chrome will disallow this bookmarklet from using its magic for pages served over https. Please click the shield icon in the address bar to allow mixed content.</small></p><p><small><strong>Also:</strong> This bookmarklet will fail to find `global.css` in drupal\'s standard configuration. Please dl/en during development <a href="https://www.drupal.org/project/link_css">Link CSS (contrib)</a> to prevent drupal from outputting CSS as @import statements in style tags.</small></p><h2>TODO:</h2><ul><li>Update RemoveProd to find the @import statement in question</li></ul>');
});

app.get('/js/themetools.js', function(req, res, next) {
  var sourceFile = fs.readFileSync('./js/themetools.js').toString().replace(/localhost:18735/g, hostname+':'+port);

  return res.end(sourceFile);
  next();
});

app.use(express.static(__dirname));

app.listen(port, function(){
  console.log('Now listening on: http://'+hostname+':'+port);
});
