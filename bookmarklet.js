var bookmarklet = function(){
  if (window.jQuery().jquery.length < 1) {
    return;
  } else {
    var src = 'http://localhost:18735/js/themetools.js';

    jQuery.getScript(src, function(){
      console.log('loaded', src);
    });
  }
};

module.exports = bookmarklet;