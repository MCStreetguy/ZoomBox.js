(function ( $ ) {

  var defaultValues = {
    autoInit: true
  }

  $.fn.zoombox = function(options) {
    if(options !== undefined && typeof options !== 'object') {
      throw new TypeError('Invalid Arguments: options has to be an object.');
    }

    this.each(function (i,e,a) {
      var src = this.attr('src');
    })

    return this;
  };

}( jQuery ));
