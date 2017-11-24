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
    theme: 'dark',
    sliderPrevButtonContent: '<button type="button" class="slick-prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 14"><path d="M4.898 10.75q0 0.102-0.078 0.18l-0.391 0.391q-0.078 0.078-0.18 0.078t-0.18-0.078l-3.641-3.641q-0.078-0.078-0.078-0.18t0.078-0.18l3.641-3.641q0.078-0.078 0.18-0.078t0.18 0.078l0.391 0.391q0.078 0.078 0.078 0.18t-0.078 0.18l-3.070 3.070 3.070 3.070q0.078 0.078 0.078 0.18zM7.898 10.75q0 0.102-0.078 0.18l-0.391 0.391q-0.078 0.078-0.18 0.078t-0.18-0.078l-3.641-3.641q-0.078-0.078-0.078-0.18t0.078-0.18l3.641-3.641q0.078-0.078 0.18-0.078t0.18 0.078l0.391 0.391q0.078 0.078 0.078 0.18t-0.078 0.18l-3.070 3.070 3.070 3.070q0.078 0.078 0.078 0.18z"></path></svg></button>',
    sliderNextButtonContent: '<button type="button" class="slick-next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 14"><path d="M4.648 7.5q0 0.102-0.078 0.18l-3.641 3.641q-0.078 0.078-0.18 0.078t-0.18-0.078l-0.391-0.391q-0.078-0.078-0.078-0.18t0.078-0.18l3.070-3.070-3.070-3.070q-0.078-0.078-0.078-0.18t0.078-0.18l0.391-0.391q0.078-0.078 0.18-0.078t0.18 0.078l3.641 3.641q0.078 0.078 0.078 0.18zM7.648 7.5q0 0.102-0.078 0.18l-3.641 3.641q-0.078 0.078-0.18 0.078t-0.18-0.078l-0.391-0.391q-0.078-0.078-0.078-0.18t0.078-0.18l3.070-3.070-3.070-3.070q-0.078-0.078-0.078-0.18t0.078-0.18l0.391-0.391q0.078-0.078 0.18-0.078t0.18 0.078l3.641 3.641q0.078 0.078 0.078 0.18z"></path></svg></button>'
  }

  function createOverlay(options) {
    if($('#'+options.containerId).length) destroyOverlay(options);

    $(document.body).css('overflow','hidden');

    var elem = $(document.body).append('<div id="' + options.containerId + '"><div class="' + options.buttonClass + '">&times;</div><div class="' + options.innerClass + '"></div></div>').find('#'+options.containerId);

    if(options.closeOnBackClick) {
      elem.on('click',function (event) {
        if(!$(event.target).is('img, .slick-arrow, .slick-arrow *')) destroyOverlay(options);
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

  function destroyOverlay(options) {
    if($('#'+options.containerId).length) {
      $(document.body).css('overflow','').find('#'+options.containerId).removeClass('in').one('transitionend',function () {
        $(this).remove();
      })
      return true;
    } else {
      return false;
    }
  }

  function centerVertical(parent,selector) {
    $(selector).each(function (i,e,a) {
      $(this).css('margin-top',($(parent).innerHeight() - $(this).height()) / 2);
    })
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
      $(element).on('click',function (event) {
        var src = [];
        var elements = $($(element).data('parent')).children().get().filter(function (entry) {
          return $(entry).data('parent')
        });

        for (var i = 0; i < elements.length; i++) {
          if(options.useDataSource) {
            src.push($(elements[i]).data('src'));
          } else {
            src.push($(elements[i]).attr('src'));
          }
        }

        var over = createOverlay(options);

        for (var j = 0; j < src.length; j++) {
          over.find('.'+options.innerClass).append('<img src="' + src[j] + '" class="' + options.imageClass + '" />');
        }

        if(src.length > 1) {
          $('#'+options.containerId).find('.'+options.innerClass).slick({
            prevArrow: options.sliderPrevButtonContent,
            nextArrow: options.sliderNextButtonContent
          }).slick('slickGoTo',elements.indexOf(element),true);
        }

        centerVertical(over.find('.'+options.innerClass),over.find('.'+(src.length > 1 ? 'slick-slide' : options.imageClass)));
        over.addClass('in').one('transitionend',function () {});
      })
    })

    var _this = this;

    for (var i = 0; i < _this.length; i++) {

    }

    if(options.listenKeys) {
      $(document).on('keyup',function (event) {
        if(event.key === 'Escape') {
          destroyOverlay(options);
        } else if(event.key === 'ArrowRight') {
          $('.slick-initialized').slick('slickNext');
        } else if(event.key === 'ArrowLeft') {
          $('.slick-initialized').slick('slickPrev');
        }
      })
    }

    return this;
  };

  $(function () {
    if(!window.preventAutoZoom) {
      $('.'+defaultValues._targetClass).zoombox();
    }
  })

}( jQuery ));
