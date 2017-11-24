(function ( $ ) {

  if(typeof $ === 'undefined') {
		if('console' in window) window.console.warn('ZoomBox.js needs jQuery! Aborted loading.');
		return;
	}

  var defaultValues = {
    containerId: 'zoombox-overlay',
    buttonClass: 'zoombox-close-btn',
    innerClass: 'zoombox-inner',
    imageClass: 'img-responsive zoombox-image',
    buttonContent: '&times;'
  }

  var createOverlay = function (options) {
    var tpl = '<div id="' + options.containerId + '">';
    tpl += '<div class="' + options.buttonClass + '">' + options.buttonContent + '</div>';
    tpl += '<div class="' + options.innerClass + '">';
    tpl += '</div>';
    tpl += '</div>';

    var elem = $(document.body).append(tpl).find('#'+options.containerId);

    elem.on('click',function (event) {
      return ($(event.target).is('img') ? false : destroyOverlay());
    });

    return elem;
  }

  var destroyOverlay = function () {
    $('#zoombox-overlay').removeClass('in').one('transitionend',function () {
      $(this).remove();
    })
    return true;
  }

  $.fn.zoombox = function(options) {
    if(options !== undefined && typeof options === 'object') {
      for(var setting in defaultValues) {
        if(defaultValues.hasOwnProperty(setting) && (options[setting] === undefined || typeof defaultValues[setting] !== typeof options[setting])) {
          options[setting] = defaultValues[setting];
        }
      }
    } else {
      options = defaultValues;
    }

    this.each(function (index,element,array) {
      var src = $(element).attr('src');

      $(element).on('click',function (event) {
        var over = createOverlay(options);
        over.find('.'+options.innerClass).append('<img src="' + src + '" class="' + options.imageClass + '" />');
        setTimeout(function () {
          over.addClass('in').one('transitionend',function () {});
        },50);
      })
    })

    return this;
  };

}( jQuery ));
