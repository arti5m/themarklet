(function($){
  if (window.jQuery().jquery.length < 1) {
    return;
  } else {
    var csshref = 'http://localhost:18735/css/global.css';
    var cssrtlhref = 'http://localhost:18735/css/global-rtl.css';
    var classFlag = 'hasLocalCSS';
    var rtlFlag = 'hasLocalRTLCSS';
    var localJS = 'http://localhost:18735/js/local.js';
    var jsFlag = 'hasLocalJS';

    var $styleImport = $("style:contains('global')");
    var prodImport = $styleImport.text().match(/[@import].+(global.*css).+;/gim);
    var commentedImport = '/*' +prodImport+ '*/';

    addCSS(csshref);
    addCSS(cssrtlhref, rtlFlag);

    /*
    addJS([
      localJS
    ]);
    //*/

    var coolBox = $('<div class="coolbox"></div>');
    var updateCSS = $('<button class="button admin-extra updateCSS">UpdateCSS</button>');
    var toggleLocalCSS = $('<button class="button admin-extra toggleLocalCSS on">Local CSS: ON</button>');
    var toggleProdCSS = $('<button class="button admin-extra removeProdCSS on">Prod CSS: ON</button>');
    var toggleRTL = $('<button class="button admin-extra toggleRTL">Toggle RTL</button>');
    var grayscale = $('<button class="button admin-extra grayscale">Grayed</button>');
    var blurred = $('<button class="button admin-extra blurred">blurred</button>');
    var flipped = $('<button class="button admin-extra flipped">flipped</button>');
    var reset = $('<button class="button admin-extra reset">reset</button>');
    var baselineToggle = $('<button class="button admin-extra baseline">baseline</button>');

    if($('body').hasClass(classFlag)) {
      coolBox
        .css({
          'position': 'fixed',
          'bottom': '0',
          'left': '0',
          'background': '#BADA55',
          'width': 'auto',
          'height': 'auto',
          'padding': '6px',
          'z-index': '1000',
        })
        .attr('dir', 'ltr')
        .append(updateCSS)
        .append(toggleLocalCSS)
        .append(toggleProdCSS)
        .append(toggleRTL)
        .append(baselineToggle)
        .append(grayscale)
        .append(blurred)
        .append(flipped)
        .append(reset);

      updateCSS.bind('click', function(e) {
        e.preventDefault();
        if(!$('body').hasClass(classFlag)) {
          addCSS(csshref);
          addCSS(cssrtlhref, rtlFlag);
        }
        var rando = themarklet.ceil(themarklet.random() * 1000);
        var myCSS = $('link[href*="' +csshref+ '"]');
        myCSS.attr('href', csshref + '?v=' + rando);
        var myrtlCSS = $('link[href*="' +cssrtlhref+ '"]');
        myrtlCSS.attr('href', cssrtlhref + '?v=' + rando);
      });

      toggleLocalCSS.bind('click', function(){
        if ($(this).hasClass('on')) {
          $('link[href*="' +csshref+ '"]').attr("disabled", "disabled");
          $('body').removeClass(classFlag);
          $(this).removeClass('on').addClass('off').text('Local CSS: OFF');
        } else {
          $('link[href*="' +csshref+ '"]').removeAttr("disabled");
          $(this).removeClass('off').addClass('on').text('Local CSS: ON');
        }
      });

      toggleProdCSS.bind('click', function(){
        var styleInner = $styleImport.text();
        if ($(this).hasClass('on')) {
          $('link[href^="' +window.location.origin+ '"][href*="global"]').attr("disabled", "disabled");
          styleInner = styleInner.replace(prodImport, commentedImport);
          $styleImport.text(styleInner);
          $(this).removeClass('on').addClass('off').text('Prod CSS: OFF');
        } else {
          $('link[href^="' +window.location.origin+ '"][href*="global"]').removeAttr("disabled");
          styleInner = styleInner.replace(commentedImport, prodImport);
          $styleImport.text(styleInner);
          $(this).removeClass('off').addClass('on').text('Prod CSS: ON');
        }
      });

      baselineToggle.bind('click', function() {
        if (!$('.baselineOverlay').length) {
          $('body').append($('<div class="baselineOverlay"></div>'));
        } else {
          baseline();
        }
      });

      toggleRTL.bind('click', function() {
        if ($('html').attr('dir') === 'ltr') {
          $('html').attr('dir', 'rtl');
        } else {
          $('html').attr('dir', 'ltr');
        }

        // TODO: turn off Local CSS when RTL is turned on

        if ($(this).hasClass('on')) {
          $('link[href*="' +cssrtlhref+ '"]').attr("disabled", "disabled");
          $('body').removeClass(classFlag);
          $(this).removeClass('on').addClass('off').text('RTL CSS: OFF');
        } else {
          $('link[href*="' +cssrtlhref+ '"]').removeAttr("disabled");
          $(this).removeClass('off').addClass('on').text('RTL CSS: ON');
        }
      });

      grayscale.bind('click', grayOut);
      blurred.bind('click', blurOut);
      flipped.bind('click', flipOnHead);
      reset.bind('click', resetStyle);
    }

    if($('body').hasClass(classFlag)) {
      $('body').append(coolBox);
    }
  }

  function addCSS(href, flag) {
    if (flag) classFlag = flag;
    if($('body').hasClass(classFlag)) {
      return false;
    }
    /rtl/.test(href) ? $('head').append('<link type="text/css" rel="stylesheet" href="' +href+ '" disabled="disabled">') : $('head').append('<link type="text/css" rel="stylesheet" href="' +href+ '">');
    $('body').addClass(classFlag);
  }

  function addJS(src) {
    if(jQuery('body').hasClass(jsFlag)) {
      return false;
    }
    for (var i = 0, len = src.length; i < len; i++) {
      jQuery.ajax({
        async: false,
        dataType: "script",
        url: src[i],
        success: function() {
          console.log('loaded ' + src[1]);
        }
      });
    }
    jQuery('body').addClass(jsFlag);
  }

  function grayOut() {
    $('.layout-container, .hasLocalCSS').attr('style', 'filter:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale"); -webkit-filter:grayscale(1); filter:grayscale(1);');
  }

  function flipOnHead() {
    $('.layout-container, .hasLocalCSS').attr('style','-webkit-transform:rotate(180deg); -moz-transform:rotate(180deg); transform:rotate(180deg);');
  }

  function blurOut() {
    $('.layout-container, .hasLocalCSS').attr('style', 'filter:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'blur\'><feGaussianBlur stdDeviation=\'10\' /></filter></svg>#blur"); -webkit-filter:blur(10px); filter:blur(10px);');
  }

  function resetStyle() {
    $('.layout-container, .hasLocalCSS').attr('style', '');
  }

  function baseline() {
    $('.baselineOverlay').toggle();
  }


})(jQuery);