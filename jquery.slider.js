// **jquery.slider.js** is a simple slider plugin for jQuery.

// It does not include styles or animations but provides navigation
// and simple hooks to animate transitions using CSS or JavaScript.
// The markup it produces should conform to accessibility guidelines.

(function($) {

  $.fn.slider = function(options) {

    // Settings can be overridden by passing in `options` object.
    // If you don't want a particular control set it to `false`.
    $.fn.slider.defaultSettings = {

      // Labels for basic controls are configured in this section.
      controls         : {

        // `controls.always`
        // Boolean whether to display next/previous controls
        // when there is only one position
        always          : true,

        // `controls.prev`:
        // String label for the 'previous' control.
        // Can be HTML.
        // Set to `false` if you don't want this control.
        prev           : 'previous',

        // `controls.next`:
        // String label for the 'next' control.
        // Can be HTML.
        // Set to `false` if you don't want this control.
        next           : 'next',

        // `controls.item`:
        // String label for 'go to item' controls.
        // Can be HTML.
        // Set to `false` if you don't want these controls.
        // If this value is numeric the controls will be
        // labeled sequentially e.g. 0, 1, 2
        item           : '0'
      },

      // The `auto` section contains configuration options
      // related to auto-advance functionality.
      auto             : {

        // `auto.enabled`:
        // Boolean switch for auto-advance functionality.
        enabled        : false,

        // `auto.start`:
        // Boolean start advancing automatically if true.
        start          : true,

        //`auto.timeout`:
        // Integer milliseconds to display each item for.
        timeout        : 5000,

        // `auto.pauseOnInteract`:
        // Boolean pause on focus, hover or button click if true.
        pauseOnInteract: true,

        // Labels for 'play' and 'pause' controls.
        controls       : {

          // `auto.controls.play`:
          // String label for 'play' control.
          // Can be HTML.
          // Set to `false` if you don't want this control.
          play         : false,

          // `auto.controls.pause`:
          // String label for 'pause' control.
          // Can be HTML.
          // Set to `false` if you don't want this control.
          pause        : false

        }
      },

      // `itemSelector`:
      // String CSS/jQuery selector used to determine slideshow items
      itemSelector      : 'li',

      // `cssPrefix`:
      // String to prepend to classNames applied to slideshow elements
      // e.g. slider-next, slider-prev, slider-goto, slider-goto-n
      cssPrefix         : 'slider-',

      // `startIndex`:
      // Integer to start counting from. Usually 0, 1 may make your CSS
      // read more naturally.
      startIndex        : 0,

      // `loop`:
      // Boolean if true next and previous controls loop past the end
      // (and beginning.)
      loop              : false,

      // `itemsPerPosition`:
      // Integer the number of items displayed in each position. This can
      // also be defined declaratively e.g.:
      //  `<ul data-items-per-position="3">...</ul>`
      itemsPerPosition  : 1

    };

    var settings =  $.extend(true, {}, $.fn.slider.defaultSettings, options);

    // Handler to update the slider when a control is clicked.
    // `f` is a function which returns the new position.
    function move(f) {

      var pos         = this.data('position') || settings.startIndex,
          newPos      = f(pos),
          buttons     = this.data('buttons'),
          prevControl = this.data('prev-control'),
          nextControl = this.data('next-control');

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

      // update disabled state of prev control
      if(prevControl && !settings.loop) {
        if(newPos == settings.startIndex) {
          prevControl.attr('disabled', 'disabled');
        } else {
         prevControl.removeAttr('disabled');
        }
      }

      // update disabled state of next control
      if(nextControl && !settings.loop) {
        if(newPos == (settings.startIndex + this.data('positions') - 1)) {
          nextControl.attr('disabled', 'disabled');
        } else {
          nextControl.removeAttr('disabled');
        }
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
          var highestPos = positions - 1 + settings.startIndex;
          var newPos = Math.min(pos + 1, highestPos);
          if(pos == newPos && settings.loop) {
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

    // Set active class on active item(s)
    function setActiveClass($slider) {

      var items             = $slider.find(settings.itemSelector),
          positions         = $slider.data('positions'),
          position          = $slider.data('position'),
          itemsPerPosition  = $slider.data('items-per-position');

      items.removeClass(settings.cssPrefix + 'active');

      if(positions == items.length) {
        // There is one item per position, so only one active item
        $(items.get(position)).addClass(settings.cssPrefix + 'active');
      } else {
        // There are more than one items per position, so multiple active items
        var start             = position * itemsPerPosition,
            end               = start + itemsPerPosition,
            className;
        items
          .slice(start, end)
          .addClass(settings.cssPrefix + 'active')
          .each(function(i, e) {
            className = settings.cssPrefix + 'active-' + i;
            items.removeClass(className);
            $(this).addClass(className);
          });
      }

    }

    // Set up the sliders:
    this.each(function() {

      var $slider = $(this),
          itemsPerPosition = $slider.data('items-per-position') || settings.itemsPerPosition,
          positions = Math.ceil($slider.find(settings.itemSelector).length / itemsPerPosition);

      // Add a class to all sliders - makes it easy to remove them en masse.
      $slider.addClass(settings.cssPrefix + 'slider');

      // Set data.position on the slider if it's undefined.
      if($slider.data('position') === undefined) {
        $slider.data('position', settings.startIndex);
      }

      // Ensure data.positions and itemsPerPosition are set on the slider.
      $slider.data('positions',           positions);
      $slider.data('items-per-position',  itemsPerPosition);

      // Set slider-active class on active item(s)
      setActiveClass($slider);

      // Add controls to the slider:
      if(settings.controls.always || positions > 1) {

        if(settings.controls.prev) {
          $slider.data('prev-control', $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'prev')
            .html(settings.controls.prev)
            .click(backward_func($slider))
            .insertBefore($slider)
          );
          if(!settings.loop) {
            $slider.data('prev-control').attr('disabled', 'disabled');
          }
        }

        if(settings.controls.next) {
          $slider.data('next-control', $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'next')
            .html(settings.controls.next)
            .click(forward_func($slider))
            .insertBefore($slider)
          );
          if(positions == 1) {
            $slider.data('next-control').attr('disabled', 'disabled');
          }
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
              .click(function() { $slider.trigger('start', true); })
              .insertBefore($slider)
            ;
          }

          if(settings.auto.controls.pause) {
            $('<button/>')
              .addClass(settings.cssPrefix + 'control')
              .addClass(settings.cssPrefix + 'pause')
              .html(settings.auto.controls.pause)
              .click(function() {$slider.trigger('stop'); })
              .insertBefore($slider)
            ;
          }

        }
      }

      // setup animation
      if(settings.auto.enabled) {

        $slider.bind('start', function(e, immediate) {
          if(!settings.auto.enabled) {
            return;
          }
          var $slider = $(this),
              callback = forward_func($slider);
          if(immediate) callback();
          clearTimeout($slider.data('timeout'));
          $(this).data('timeout', setInterval(callback, settings.auto.timeout));
        });

        $slider.bind('stop', function(e) {
          clearTimeout($(this).data('timeout'));
        });

        var start = function(e) { $slider.trigger('start'); },
            stop = function(e) { $slider.trigger('stop'); };

        if(settings.auto.start) {
          $slider.trigger('start');
        }
        if(settings.auto.pauseOnInteract) {
          $.fn.slider._bindPauseOnInteract($slider, start, stop);
        }
      }

      $slider.data('slider-processed', true);

    });

    return this;

  };

  $.fn.slider._bindPauseOnInteract = function($slider, start, stop) {
    $slider
      .hover(stop, start)
      .focusin(stop)
      .focusout(start);
    if($slider.data('buttons')) {
      $slider.data('buttons').find('button')
      .hover(stop, start)
      .click(stop)
      .focusin(stop)
      .focusout(start);
    }

  };

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

})(jQuery);
