// **jquery.slider.js** is a simple slider plugin for jQuery.

// It does not include styles or animations but provides navigation
// and simple hooks to animate transitions using CSS or JavaScript.
// The markup it produces should conform to accessibility guidelines.

(function($) {

  // Add a utility to test if a value is numeric.
  // (Don't redefine this if there alreadyis one - just assume that works)
  if(typeof $.util == 'undefined') {
    $.util = {};
  }
  if(typeof $.util.isNumeric != 'function') {
    $.util.isNumeric = function(testVal) {
      return !isNaN(parseFloat(testVal)) && isFinite(testVal);
    };
  }

  $.fn.slider = function(options) {

    // Settings can be overridden by passing in `options` object.
    // If you don't want a particular control set it to `false`.

    if(typeof options === 'object' || typeof options === 'undefined') {
      var settings =  $.extend(true, {
        controls     : {
          prev       : 'previous',
          next       : 'next',
          item       : '0'
        },
        auto         : {
          enabled    : false,
          start      : true,
          timeout    : 5000,
          controls   : {
            play     : false,
            pause    : false
          }
        },
        itemSelector : 'li',
        cssPrefix    : 'slider-',
        startIndex   : 0,
        loop         : false
      }, options);
    }

    // Handler to update the slider when a control is clicked.
    // `f` is a function which returns the new position.
    function move(f) {

      var pos     = this.data('position') || settings.startIndex,
          newPos  = f(pos),
          buttons = this.data('buttons');

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

      $('.' + settings.cssPrefix + 'control').removeAttr('disabled');

      if(newPos == settings.startIndex) {
        $('.' + settings.cssPrefix + 'prev').attr('disabled', 'disabled');
      }

      if(newPos == (settings.startIndex + this.data('positions') - 1)) {
        $('.' + settings.cssPrefix + 'next').attr('disabled', 'disabled');
      }

      // Set active class on active item(s)
      setActiveClass(this);

      // Trigger an event so subscribers can update the view when it changes:
      this.trigger('sliderChanged', [newPos, pos]);

    }

    // Return a function to move the slider one position forward.
    function forward_func($slider) {
      return function() {
        var positions = $slider.data('positions');
        move.call($slider, function(pos) {
          var newPos = Math.min(pos + 1, positions - 1 + settings.startIndex);
          if(settings.loop && (pos == newPos)) {
            newPos = settings.startIndex;
          }
          return newPos;
        });
      };
    }

    // Return a function to move the slider backwards one position.
    function backward_func($slider) {
      return function() {
        var positions = $slider.data('positions');
        move.call($slider, function(pos) {
          var newPos = Math.max(pos - 1, settings.startIndex);
          if(settings.loop && (pos == newPos)) {
            newPos = positions - 1 + settings.startIndex;
          }
          return newPos;
        });
      };
    }

    // Return a function to start the slider animating
    function start_func($slider, immediate) {
      return function() {
        if(!settings.auto.enabled) {
          return;
        }
        var callback = forward_func($slider);
        if(immediate) callback();
        stop_func($slider)();
        $slider.data('timeout', setInterval(callback, settings.auto.timeout));
      };
    }

    // Return a function to stop the slider animating
    function stop_func($slider) {
      return function() {
        clearTimeout($slider.data('timeout'));
      };
    }

    // Set active class on active item(s)
    function setActiveClass($slider) {

      var items = $slider.find(settings.itemSelector),
          positions = $slider.data('positions'),
          position = $slider.data('position');

      items.removeClass(settings.cssPrefix + 'active');

      if(positions == items.length) {
        $(items.get(position)).addClass(settings.cssPrefix + 'active');
      } else {
        var itemsPerPosition = Math.ceil(items.length / positions),
            start = position * itemsPerPosition,
            end = start + itemsPerPosition;
        items.slice(start, end)
          .addClass(settings.cssPrefix + 'active')
          .each(function(i, e) {
            var className = settings.cssPrefix + 'active-' + i;
            items.removeClass(className);
            $(this).addClass(className);
          });
      }

    }

    // Set up the sliders:
    this.each(function() {

      var $slider = $(this),
          positions = $slider.data('positions') || $slider.find(settings.itemSelector).length;

      // respond to commands like stop and start after the slider has been set up.
      if($slider.data('slider-processed')) {
        settings = $slider.data('slider-settings');
        switch(options) {
          case 'start':
            start_func($slider)();
            break;
          case 'stop':
            stop_func($slider)();
            break;
        }
        return;
      }

      // Store settings on the slider so we can do stuff to it later
      if($slider.data('slider-settings') === undefined) {
        $slider.data('slider-settings', settings);
      }

      // Set data.position on the slider if it's undefined.
      if($slider.data('position') === undefined) {
        $slider.data('position', settings.startIndex);
      }

      // Ensure data.positions is set on the slider.
      $slider.data('positions', positions);

      // Set slider-active class on active item(s)
      setActiveClass($slider);

      // Add controls to the slider:
      if(positions > 1) {

        if(settings.controls.prev) {
          $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'prev')
            .attr('disabled', 'disabled')
            .html(settings.controls.prev)
            .click(backward_func($slider))
            .insertBefore($slider)
          ;
        }

        if(settings.controls.next) {
          $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'next')
            .html(settings.controls.next)
            .click(forward_func($slider))
            .insertBefore($slider)
          ;
        }

        if(settings.controls.item) {

          var itemControlContainer = $('<div>'),
              position = settings.startIndex,
              clickHandler = function() {
                var btn = $(this);
                move.call($slider, function() {
                  return btn.data('position');
                });
              }
          ;

          while(position < positions + settings.startIndex) {
            $('<button>')
              .html($.util.isNumeric(settings.controls.item) ?
                  position.toString() :
                  settings.controls.item)
              .addClass(settings.cssPrefix + 'control')
              .addClass(settings.cssPrefix + 'goto')
              .addClass(settings.cssPrefix + 'goto-' + position)
              .data('position', position)
              .click(clickHandler)
              .appendTo(itemControlContainer)
            ;
            position++;
          }

          itemControlContainer.insertAfter($slider);
          $slider.data('buttons', itemControlContainer);
          $('.' + settings.cssPrefix + 'goto-' + settings.startIndex)
            .addClass('active');

        }

        if(settings.auto.enabled) {

          if(settings.auto.controls.play) {
            $('<button/>')
              .addClass(settings.cssPrefix + 'control')
              .addClass(settings.cssPrefix + 'play')
              .html(settings.auto.controls.play)
              .click(start_func($slider, true))
              .insertBefore($slider)
            ;
          }

          if(settings.auto.controls.pause) {
            $('<button/>')
              .addClass(settings.cssPrefix + 'control')
              .addClass(settings.cssPrefix + 'pause')
              .html(settings.auto.controls.pause)
              .click(stop_func($slider))
              .insertBefore($slider)
            ;
          }

        }
      }

      // setup animation
      if(settings.auto.enabled) {
        $slider.bind('sliderStart', start_func($slider));
        $slider.bind('sliderStop', stop_func($slider));
        if(settings.auto.start) {
          $slider.trigger('sliderStart');
        }
      }

      $slider.data('slider-processed', true);

    });

    return this;

  };

})(jQuery);

