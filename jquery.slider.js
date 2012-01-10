// **jquery.slider.js** is a simple slider plugin for jQuery.

// It does not include styles or animations but provides navigation
// and simple hooks to animate transitions using CSS or JavaScript.
// The markup it produces should conform to accessibility guidelines.

(function($) {

  $.fn.slider = function(options) {

    // Settings can be overridden by passing in `options` object.
    // If you don't want a particular control set it to `false`.
    var settings =  $.extend(true, {
      controls : {
        prev       : '◀',
        next       : '▶',
        item       : '⚫'
      },
      itemSelector : 'li',
      cssPrefix    : 'slider-',
      start        : 0
    }, options);

    // Handler to update the slider when a control is clicked.
    // `f` is a function which returns the new position.
    function move(f) {

      var pos     = this.data('position') || settings.start
        , newPos  = f(pos)
        , buttons = this.data('buttons')
      ;

      if(pos == newPos) return;

      // Update data-position and position class on container:
      this
        .data('position', newPos)
        .removeClass('position-' + pos)
        .addClass('position-' + newPos)
      ;

      // Update button classes:
      if(buttons) {

        buttons.children('.' + settings.cssPrefix + 'goto')
          .removeClass('active')
        ;

        buttons.children('.' + settings.cssPrefix + 'goto-' + newPos)
          .addClass('active')
        ;

      }

      // Trigger an event so subscribers can update the view when it changes:
      this.trigger('sliderChanged', [newPos, pos]);

    }

    // Set up the sliders:
    this.each(function() {

      var $slider = $(this)
        , positions = $slider.data('positions') || $slider.find(itemSelector).length
      ;
      if($slider.data('slider-processed')) return;

      // Add controls to the slider:
      if(positions > 1) {

        if(settings.controls.prev) {
          $('<button class="' + settings.cssPrefix + 'prev"/>')
            .html(settings.controls.prev)
            .click(function() {
              move.call($slider, function(pos) {
                return Math.max(pos - 1, settings.start);
              });
            })
            .insertBefore($slider)
          ;
        }

        if(settings.controls.next) {
          $('<button class="' + settings.cssPrefix + 'next"/>')
            .html(settings.controls.next)
            .click(function() {
              move.call($slider, function(pos) {
                return Math.min(pos + 1, positions - 1 + settings.start);
              });
            })
            .insertBefore($slider)
          ;
        }


        if(settings.controls.item) {

          var itemControlContainer = $('<div>')
            , position = settings.start
          ;

          while(position < positions + settings.start) {
            $('<button>')
              .html(settings.controls.item)
              .addClass(settings.cssPrefix + 'goto')
              .addClass(settings.cssPrefix + 'goto-' + position)
              .data('position', position)
              .click(function() {
                var btn = $(this);
                move.call($slider, function() {
                  return btn.data('position');
                })
              })
              .appendTo(itemControlContainer)
            ;
            position++;
          }

          itemControlContainer.insertAfter($slider);
          $slider.data('buttons', itemControlContainer);
          $('.' + settings.cssPrefix + 'goto-' + settings.start).addClass('active');

        }
      }

      $slider.data('slider-processed', true);

    });

    return this;

  }

})(jQuery);

