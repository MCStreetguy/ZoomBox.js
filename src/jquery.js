(function ( $ ) {

  if(typeof $ === 'undefined') {
		if('console' in window) window.console.warn('ZoomBox.js needs jQuery! Aborted loading.');
		return;
	}

  var defaultValues = {
    _targetClass: 'zoombox',
    containerId: 'zoombox-overlay',
    buttonClass: 'zoombox-close-btn',
    innerClass: 'zoombox-inner',
    imageClass: 'zoombox-image',
    listenKeys: true,
    closeOnBackClick: true,
    useDataSource: false,
    theme: 'dark'
  }

  var createOverlay = function (options) {
    if($('#'+options.containerId).length) destroyOverlay(options);

    $(document.body).css('overflow','hidden');

    var tpl = '<div id="' + options.containerId + '">';
    tpl += '<div class="' + options.buttonClass + '">&times;</div>';
    tpl += '<div class="' + options.innerClass + '">';
    tpl += '</div>';
    tpl += '</div>';

    var elem = $(document.body).append(tpl).find('#'+options.containerId);

    if(options.closeOnBackClick) {
      elem.on('click',function (event) {
        if(!$(event.target).is('img')) destroyOverlay(options);
      })
    } else {
      elem.on('click',function (event) {
        if($(event.target).is('.'+options.buttonClass)) destroyOverlay(options);
      })
    }

    if(options.theme !== '') {
      elem.addClass('theme-'+options.theme);
    }

    return elem;
  }

  var destroyOverlay = function (options) {
    if($('#'+options.containerId).length) {
      $(document.body).css('overflow','').find('#'+options.containerId).removeClass('in').one('transitionend',function () {
        $(this).remove();
      })
      return true;
    } else {
      return false;
    }
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
      var src = (options.useDataSource ? $(element).data('src') : $(element).attr('src'));

      $(element).on('click',function (event) {
        var over = createOverlay(options);
        over.find('.'+options.innerClass).append('<img src="' + src + '" class="' + options.imageClass + '" />');
        setTimeout(function () {
          over.addClass('in').one('transitionend',function () {});
        },50);
      })
    })

    if(options.listenKeys) {
      $(document).on('keyup',function (event) {
        if(event.key === 'Escape') {
          destroyOverlay(options);
        } else if(event.key === 'ArrowRight') {

        } else if(event.key === 'ArrowLeft') {

        }
      })
    }

    return this;
  };

  if(!window.preventAutoZoom) {
    $(function () {
      $('.'+defaultValues._targetClass).zoombox();
    })
  }

}( jQuery ));
