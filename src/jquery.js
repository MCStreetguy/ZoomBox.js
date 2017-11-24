(function ( $ ) {

  var defaultValues = {
    autoInit: true
  }

  var createOverlay = function () {
    var tpl = '<div id="zoombox-overlay">';
    tpl += '<div class="header">';
    tpl += '<div class="close-btn">&times;</div>';
    tpl += '</div>';
    tpl += '<div class="body">';
    tpl += '</div>';
    tpl += '</div>';

    $(document).append(tpl);
  }

  var destroyOverlay = function () {
    $('#zoombox-overlay').remove();
  }

  $.fn.zoombox = function(options) {
    if(options !== undefined && typeof options !== 'object') {
      options = defaultValues;
    }

    this.each(function (i,e,a) {
      var src = this.attr('src');
      this.on('click',function () {

      })
    })

    return this;
  };

}( jQuery ));
