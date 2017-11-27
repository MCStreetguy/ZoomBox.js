(function ( $ ) {

  if(typeof $ === 'undefined') {
    if('console' in window) window.console.warn('ZoomBox.js needs jQuery! Aborted loading.');
    return;
  }

  if(typeof $.fn.slick === 'undefined') {
    if('console' in window) window.console.warn('ZoomBox.js needs Slick Carousel jQuery Plugin! Aborted loading.');
    return;
  }

  var defaultValues = {
    containerId: 'zoombox-overlay',
    buttonClass: 'zoombox-close-btn',
    innerClass: 'zoombox-inner',
    imageClass: 'zoombox-image',
    listenKeys: true,
    closeOnBlurClick: true,
    useDataSource: false,
    centerImages: true,
    sliderPrevButton: '<button type="button" class="slick-prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 14"><path d="M4.898 10.75q0 0.102-0.078 0.18l-0.391 0.391q-0.078 0.078-0.18 0.078t-0.18-0.078l-3.641-3.641q-0.078-0.078-0.078-0.18t0.078-0.18l3.641-3.641q0.078-0.078 0.18-0.078t0.18 0.078l0.391 0.391q0.078 0.078 0.078 0.18t-0.078 0.18l-3.070 3.070 3.070 3.070q0.078 0.078 0.078 0.18zM7.898 10.75q0 0.102-0.078 0.18l-0.391 0.391q-0.078 0.078-0.18 0.078t-0.18-0.078l-3.641-3.641q-0.078-0.078-0.078-0.18t0.078-0.18l3.641-3.641q0.078-0.078 0.18-0.078t0.18 0.078l0.391 0.391q0.078 0.078 0.078 0.18t-0.078 0.18l-3.070 3.070 3.070 3.070q0.078 0.078 0.078 0.18z"></path></svg></button>',
    sliderNextButton: '<button type="button" class="slick-next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 14"><path d="M4.648 7.5q0 0.102-0.078 0.18l-3.641 3.641q-0.078 0.078-0.18 0.078t-0.18-0.078l-0.391-0.391q-0.078-0.078-0.078-0.18t0.078-0.18l3.070-3.070-3.070-3.070q-0.078-0.078-0.078-0.18t0.078-0.18l0.391-0.391q0.078-0.078 0.18-0.078t0.18 0.078l3.641 3.641q0.078 0.078 0.078 0.18zM7.648 7.5q0 0.102-0.078 0.18l-3.641 3.641q-0.078 0.078-0.18 0.078t-0.18-0.078l-0.391-0.391q-0.078-0.078-0.078-0.18t0.078-0.18l3.070-3.070-3.070-3.070q-0.078-0.078-0.078-0.18t0.078-0.18l0.391-0.391q0.078-0.078 0.18-0.078t0.18 0.078l3.641 3.641q0.078 0.078 0.078 0.18z"></path></svg></button>'
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

    var overlay = $(document.body).append('<div id="' + options.containerId + '"><div class="' + options.buttonClass + '">&times;</div><div class="' + options.innerClass + '"></div></div>').find('#'+options.containerId);
    var inner = overlay.find('.'+options.innerClass);

    if(options.closeOnBlurClick) {
      overlay.on('click',function (event) {
        if(!$(event.target).is('.slick-slide, .slick-slide *, .slick-arrow, .slick-arrow *')) {
          overlay.trigger('zoomboxOverlayHiding');
          overlay.fadeOut(function () {
            inner.slick('slickUnfilter',0);
            overlay.trigger('zoomboxOverlayHidden');
          });
        }
      })
    } else {
      overlay.on('click',function (event) {
        if($(event.target).is('.'+options.buttonClass)) {
          overlay.trigger('zoomboxOverlayHiding');
          overlay.fadeOut(function () {
            inner.slick('slickUnfilter',0);
            overlay.trigger('zoomboxOverlayHidden');
          });
        }
      })
    }

    for (var i = 0; i < this.length; i++) {
      if(options.useDataSource) {
        var src = $(this[i]).data('src');
      } else {
        var src = $(this[i]).attr('src');
      }
      var rel = $(this[i]).attr('rel');

      var tmp = '<img src="' + src + '" class="' + options.imageClass + '" ';
      if(rel !== undefined && rel !== false && rel !== '') {
        tmp += 'rel="' + rel + '"';
      }
      tmp += '/>';

      inner.append(tmp);

      $(this[i]).attr('data-index',i).on('click',function (event) {
        overlay.trigger('zoomboxOverlayShowing');

        overlay.fadeIn();
        inner.slick('slickGoTo',$(this).data('index'),true);
        var rel = $(this).attr('rel');
        inner.slick('slickFilter',function () {
          var e = ($(this).is('img') ? $(this) : $(this).find('img'));
          return (e.attr('rel') === rel);
        })

        if(options.centerImages) {
          inner.find('.slick-slide').each(function (i,e,a) {
            $(this).css('margin-top',(inner.height() - $(this).height()) / 2);
          })
        }

        overlay.trigger('zoomboxOverlayShown');
      })
    }

    inner.slick({
      prevArrow: options.sliderPrevButton,
      nextArrow: options.sliderNextButton
    }).on('afterChange',function (e) {
      overlay.trigger('zoomboxChanged');
    })

    if(options.listenKeys) {
      $(document).on('keyup',function (event) {
        if(event.key === 'Escape') {
          overlay.trigger('zoomboxOverlayHiding');
          overlay.fadeOut(function () {
            inner.slick('slickUnfilter',0);
            overlay.trigger('zoomboxOverlayHidden');
          });
        } else if(event.key === 'ArrowRight') {
          inner.slick('slickNext');
          overlay.trigger('zoomboxChanged');
        } else if(event.key === 'ArrowLeft') {
          inner.slick('slickPrev');
          overlay.trigger('zoomboxChanged');
        }
      })
    }

    return this;
  };

}( jQuery ));
