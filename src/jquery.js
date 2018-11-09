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
    autoplaySpeed: 5000,
    buttonClass: 'zoombox-close-btn',
    centerImages: true,
    closeOnBlurClick: true,
    containerId: 'zoombox-overlay',
    disableAutoplayOnHover: false,
    disableTouchMove: false,
    enableAutoplay: false,
    enforceChaining: false,
    fadeDuration: 300,
    ignoreInputOnMove: true,
    imageClass: 'zoombox-image',
    innerClass: 'zoombox-inner',
    listenKeys: true,
    showAsGallery: false,
    sliderDraggable: true,
    sliderLooped: true,
    sliderNextButton: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 14"><path d="M4.648 7.5q0 0.102-0.078 0.18l-3.641 3.641q-0.078 0.078-0.18 0.078t-0.18-0.078l-0.391-0.391q-0.078-0.078-0.078-0.18t0.078-0.18l3.070-3.070-3.070-3.070q-0.078-0.078-0.078-0.18t0.078-0.18l0.391-0.391q0.078-0.078 0.18-0.078t0.18 0.078l3.641 3.641q0.078 0.078 0.078 0.18zM7.648 7.5q0 0.102-0.078 0.18l-3.641 3.641q-0.078 0.078-0.18 0.078t-0.18-0.078l-0.391-0.391q-0.078-0.078-0.078-0.18t0.078-0.18l3.070-3.070-3.070-3.070q-0.078-0.078-0.078-0.18t0.078-0.18l0.391-0.391q0.078-0.078 0.18-0.078t0.18 0.078l3.641 3.641q0.078 0.078 0.078 0.18z"></path></svg>',
    sliderPrevButton: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 14"><path d="M4.898 10.75q0 0.102-0.078 0.18l-0.391 0.391q-0.078 0.078-0.18 0.078t-0.18-0.078l-3.641-3.641q-0.078-0.078-0.078-0.18t0.078-0.18l3.641-3.641q0.078-0.078 0.18-0.078t0.18 0.078l0.391 0.391q0.078 0.078 0.078 0.18t-0.078 0.18l-3.070 3.070 3.070 3.070q0.078 0.078 0.078 0.18zM7.898 10.75q0 0.102-0.078 0.18l-0.391 0.391q-0.078 0.078-0.18 0.078t-0.18-0.078l-3.641-3.641q-0.078-0.078-0.078-0.18t0.078-0.18l3.641-3.641q0.078-0.078 0.18-0.078t0.18 0.078l0.391 0.391q0.078 0.078 0.078 0.18t-0.078 0.18l-3.070 3.070 3.070 3.070q0.078 0.078 0.078 0.18z"></path></svg>',
    slideTransition: 'ease',
    slideTransitionSpeed: 300,
    temporary: false,
    wrapperClass: 'zoombox-image-wrapper',
  }

  var state = {
    initialized: false,
    visible: false,
    currentSlide: undefined,
    slideCount: undefined,
  }

  $.fn.zoombox = function(options) {
    if(options !== undefined && typeof options === 'object') {
      for(var setting in defaultValues) {
        if(defaultValues.hasOwnProperty(setting) && (options[setting] === undefined || typeof defaultValues[setting] !== typeof options[setting])) {
          if(options[setting] !== undefined && typeof defaultValues[setting] !== typeof options[setting]) {
            console.warn('[ZoomBox.js] Replaced invalid option '+setting+' with default value!');
          }

          options[setting] = defaultValues[setting];
        }
      }
    } else {
      options = defaultValues;
    }

    if(options.temporary) {
      var overlay = $(document.body).append('<div id="' + options.containerId + '-temp' + '" class="zoombox-overlay"><div class="' + options.buttonClass + '">&times;</div><div class="' + options.innerClass + '"></div></div>').find('#' + options.containerId + '-temp');
    } else {
      var overlay = $(document.body).append('<div id="' + options.containerId + '" class="zoombox-overlay"><div class="' + options.buttonClass + '">&times;</div><div class="' + options.innerClass + '"></div></div>').find('#' + options.containerId);
    }
    var inner = overlay.find('.'+options.innerClass);

    if(options.closeOnBlurClick) {
      overlay.on('click',function (event) {
        if(!$(event.target).is('.slick-slide *, .slick-arrow, .slick-arrow *')) {
          overlay.trigger('zoomboxOverlayHiding');
          overlay.fadeOut(options.fadeDuration,function () {
            if(options.temporary) {
              inner.slick('unslick');
              overlay.remove();
            } else {
              inner.slick('slickUnfilter',0);
              state.visible = false;
            }
            overlay.trigger('zoomboxOverlayHidden');
          });
        }
      })
    } else {
      overlay.on('click',function (event) {
        if($(event.target).is('.'+options.buttonClass)) {
          overlay.trigger('zoomboxOverlayHiding');
          overlay.fadeOut(options.fadeDuration,function () {
            if(options.temporary) {
              inner.slick('unslick');
              overlay.remove();
            } else {
              inner.slick('slickUnfilter',0);
              state.visible = false;
            }
            overlay.trigger('zoomboxOverlayHidden');
          });
        }
      })
    }

    for (var i = 0; i < this.length; i++) {
      if(options.forceSourceAttr) {
        var src = $(this[i]).attr(options.forceSourceAttr);
      } else {
        if($(this[i]).is('a')) {
          var src = $(this[i]).attr('href');
        } else if($(this[i]).is('img')) {
          var src = $(this[i]).attr('src');
        } else {
          var src = $(this[i]).data('src');
        }
      }

      var rel = $(this[i]).attr('rel');

      var tmp = '<div class="' + options.wrapperClass + '"><img src="' + src + '" class="' + options.imageClass + '" ';
      if(rel !== undefined && rel !== false && rel !== '') {
        tmp += 'rel="' + rel + '"';
      }
      tmp += '/></div>';

      inner.append(tmp);

      if(!options.temporary) {
        $(this[i]).attr('data-index',i).on('click',function (event) {
          event.preventDefault();

          overlay.trigger('zoomboxOverlayShowing');

          overlay.fadeIn(options.fadeDuration,function () {
            state.visible = true;
            overlay.trigger('zoomboxOverlayShown');
          });

          inner.slick('slickGoTo',$(this).data('index'),true);
          state.currentSlide = inner.slick('slickCurrentSlide');

          if($(this).attr('rel') !== undefined) {
            var rel = $(this).attr('rel');

            inner.slick('slickFilter',function () {
              return ($(this).find('img').attr('rel') === rel);
            })
          } else {
            var _this = this;

            if (options.showAsGallery == false) {
              if (options.forceSourceAttr) {
                var src = $(_this).attr(options.forceSourceAttr);
              } else {
                if ($(_this).is('a')) {
                  var src = $(_this).attr('href');
                } else if ($(_this).is('img')) {
                  var src = $(_this).attr('src');
                } else {
                  var src = $(_this).data('src');
                }
              }

              inner.slick('slickFilter', function () {
                return ($(this).find('img').attr('src') === src);
              })
            } 
          }

          if (options.centerImages) {
            setTimeout(function () {
              inner.find('.slick-slide').each(function (i, e, a) {
                $(this).css('margin-top', (inner.outerHeight() - $(this).outerHeight()) / 2);
              })
            }, 50);
          }

          $(window).trigger('resize');
        })
      }
    }

    inner.slick({
      autoplay: options.enableAutoplay,
      autoplaySpeed: options.autoplaySpeed,
      cssEase: options.slideTransition,
      draggable: options.sliderDraggable,
      infinite: options.sliderLooped,
      mobileFirst: false, //TODO: Test this option
      nextArrow: '<button type="button" class="slick-next">'+options.sliderNextButton+'</button>',
      pauseOnHover: options.disableAutoplayOnHover,
      prevArrow: '<button type="button" class="slick-prev">'+options.sliderPrevButton+'</button>',
      speed: options.slideTransitionSpeed,
      touchMove: !options.disableTouchMove,
      waitForAnimate: options.ignoreInputOnMove
    }).on('afterChange',function (e) {
      state.currentSlide = inner.slick('slickCurrentSlide');
      if(state.visible) overlay.trigger('zoomboxChanged');
    })

    if(options.listenKeys) {
      var keyListener = function(event) {
        if(event.key === 'Escape' || event.which == 27) {
          overlay.trigger('zoomboxOverlayHiding');
          overlay.fadeOut(options.fadeDuration,function () {
            if(options.temporary) {
              inner.slick('unslick');
              overlay.remove();
            } else {
              state.visible = false;
              inner.slick('slickUnfilter',0);
            }
            overlay.trigger('zoomboxOverlayHidden');
          });
        } else if(event.key === 'ArrowLeft' || event.which == 37) {
          inner.slick('slickPrev');
        } else if(event.key === 'ArrowRight' || event.which == 39) {
          inner.slick('slickNext');
        }
      }

      $(document).off('keyup',keyListener).on('keyup',keyListener);
    }

    if(options.temporary) {
      overlay.trigger('zoomboxOverlayShowing');

      overlay.fadeIn(options.fadeDuration,function () {
        overlay.trigger('zoomboxOverlayShown');
      });

      setTimeout(function () {
        if(options.centerImages) {
          inner.find('.slick-slide').each(function (i,e,a) {
            $(this).css('margin-top',(inner.outerHeight() - $(this).outerHeight()) / 2);
          })
        }
      },50);

      $(window).trigger('resize');
    }

    state.initialized = true;

    if(options.enforceChaining) {
      return this;
    } else {
      return $('#'+options.containerId) || $('#'+options.containerId+'-temp');
    }
  };

  window.zoombox = {
    isInitialized: function () {
      return state.initialized;
    },
    isVisible: function () {
      return state.visible;
    },
    getCurrentSlide: function () {
      return state.currentSlide;
    }
  }

}( jQuery ));
