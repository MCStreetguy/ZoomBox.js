# ZoomBox.js
**An easy but working jQuery lightbox plugin.**
This plugin utilizes [slick-carousel](http://kenwheeler.github.io/slick/).

## Installation
via Bower:   
`$ bower install zoombox.js`   
_Please make sure to also include Slick Carousel to ensure functionality!_

via jsDelivr CDN:   
`https://cdn.jsdelivr.net/npm/zoombox.js@1/dist/zoombox.jquery.min.js`   
```HTML
<script src="https://cdn.jsdelivr.net/npm/zoombox.js@1/dist/zoombox.jquery.min.js" charset="utf-8"></script>
```

via GitHub Raw:   
`https://raw.githubusercontent.com/MCStreetguy/ZoomBox.js/master/dist/zoombox.jquery.min.js`
```HTML
<script src="https://raw.githubusercontent.com/MCStreetguy/ZoomBox.js/master/dist/zoombox.jquery.min.js" charset="utf-8"></script>
```

## Usage
Initialize it:   
```JavaScript
$('.my-img-class').zoombox();
```

or customize it:
```JavaScript
$('.my-img-class').zoombox({
  option: value
})
```

| Key | Default Value | Description |
|------------------|---------------------|------------------------------------------------------------------------------------------|
| containerId | 'zoombox-overlay' | Overrides the Id of the overlay container. |
| buttonClass | 'zoombox-close-btn' | Overrides the Close-Button class. |
| innerClass | 'zoombox-inner' | Overrides the Inner-Container class. |
| imageClass | 'zoombox-image' | Overrides the Image class. |
| listenKeys | true | Listen to Keyboard events. (Such as ESC for closing or Arrow Keys for navigation) |
| closeOnBlurClick | true | Close the Overlay when clicking on a background element. |
| useDataSource | false | Use 'data-src' attribute instead of 'src'. (Useful if not using image-elements directly) |
| sliderPrevButton | (string ...) | Override the Prev-Button content. |
| sliderNextButton | (string ...) | Override the Next-Button content. |
