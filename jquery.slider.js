// **jquery.slider.js** is a simple slider plugin for jQuery.

// It does not include styles or animations but provides navigation
// and simple hooks to animate transitions using CSS or JavaScript.
// The markup it produces should conform to accessibility guidelines.

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function () {},
    fBound = function () {
      return fToBind.apply(this instanceof fNOP ? this : oThis,
       aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

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
        // If there is a number in this value it will be
        // dynamically replaced with the item number.
        item           : '0'


      },

      a11y              : {
        // Define alternative labels for screen readers if
        // you are using symbolic labels. These will be wrapped
        // in a <span> with class set to the specified className.
        className       : 'accessibility',
        controls        : {
          prev          : false,
          next          : false,
          play          : false,
          pause         : false,
          item          : false
        }
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
          pause        : false,

          // `auto.controls.tooltip`:
          // String titles for controls to indicate playing/paused state
          tooltip      : {
            playing    : 'Slideshow is playing',
            play       : 'Click to play slideshow',
            paused     : 'Slideshow is paused',
            pause      : 'Click to pause slidehow'
          }

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
      itemsPerPosition  : 1,

      // `forwardCallback`
      // Alternative function to calculate next position and move the slider.
      // This is called in the context of the jQuery object representing the slider.
      // The built in forward callback is passed as the first argument so it
      // can be called from within the custom one.
      forwardCallback   : false,

      // `backwardCallback`
      // Alternative function to calculate previous position and move the slider.
      // This is called in the context of the jQuery object representing the slider.
      // The built in backward callback is passed as the first argument so it
      // can be called from within the custom one.
      backwardCallback  : false

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
        $(items.get(position - settings.startIndex)).addClass(settings.cssPrefix + 'active');
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

      //Declare slider control container
      var sliderControlContainer;

      // Set slider-active class on active item(s)
      setActiveClass($slider);

      // Add controls to the slider:
      if(settings.controls.always || positions > 1) {

        var controlHtml;
        if(settings.controls.prev) {
          var backwardCallback = backward_func($slider);
          if('function' == typeof settings.backwardCallback) {
            backwardCallback = settings.backwardCallback.bind($slider, backwardCallback);
          }

          //Add prev button
          $slider.data('prev-control', $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'prev')
            .html(settings.controls.prev)
            .click(backwardCallback)
            .insertBefore($slider)
          );

          if(settings.a11y.controls.prev) {
             $('<span/>')
              .addClass(settings.a11y.className)
              .html(settings.a11y.controls.prev)
              .prependTo($slider.data('prev-control'));
          }

          if(!settings.loop) {
            $slider.data('prev-control').attr('disabled', 'disabled');
          }
        }

        // Add next button
        if(settings.controls.next) {
          var forwardCallback = forward_func($slider);
          if('function' == typeof settings.forwardCallback) {
            forwardCallback = settings.forwardCallback.bind($slider, forwardCallback);
          }

          $slider.data('next-control', $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'next')
            .html(settings.controls.next)
            .click(forwardCallback)
            .insertBefore($slider)
          );

          if(settings.a11y.controls.next) {
             $('<span/>')
              .addClass(settings.a11y.className)
              .html(settings.a11y.controls.next)
              .prependTo($slider.data('next-control'));
          }

          if(positions == 1) {
            $slider.data('next-control').attr('disabled', 'disabled');
          }
        }

        if(settings.controls.item || settings.auto.enabled) {
           sliderControlContainer = $('<div>').addClass('slider-controls').insertAfter($slider);
        }

        // Add item buttons
        if(settings.controls.item) {

          var itemControlContainer = $('<div>').addClass('slider-control-items'),
              // Unescape any entities so numbers in them don't get replaced
              // when we create dynamic slide button labels.
              itemLabel = $('<span>' + settings.controls.item + '</span>').html(),
              itemA11yLabel = settings.a11y.controls.item ?
                $('<span>' + settings.a11y.controls.item + '</span>').html() :
                false,
              position = settings.startIndex,
              clickHandler = function() {
                var btn = $(this);
                move.call($slider, function() {
                  return btn.data('position');
                });
              }
          ;

          while(position < positions + settings.startIndex) {
            controlHtml = [itemLabel.replace(/\d+/, position.toString())];
            if(itemA11yLabel) {
              controlHtml.unshift($('<span>')
                .addClass(settings.a11y.className)
                .html(itemA11yLabel.replace(/\d+/, position.toString()))
                .wrap('<div>').parent().html());
            }

            $('<button>')
              .html(controlHtml.join(''))
              .addClass(settings.cssPrefix + 'control')
              .addClass(settings.cssPrefix + 'goto')
              .addClass(settings.cssPrefix + 'goto-' + position)
              .data('position', position)
              .click(clickHandler)
              .appendTo(itemControlContainer)
            ;
            position++;
          }

          itemControlContainer.appendTo(sliderControlContainer);
          $slider.data('buttons', itemControlContainer);
          $('.' + settings.cssPrefix + 'goto-' + settings.startIndex)
            .addClass('active');
        }

      }

      if(settings.auto.enabled) {

        // Add pause button
        if(settings.auto.controls.pause) {

          $slider.data('pause-control', $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'pause')
            .html(settings.auto.controls.pause)
            .click(function() {$slider.trigger('stop'); })
            .appendTo(sliderControlContainer)
          );

          if(settings.a11y.controls.pause) {
            $('<span/>').addClass(settings.a11y.className).html(settings.a11y.controls.pause).prependTo($slider.data('pause-control'));
          }

        } // End pause button insertion

        // Add play button
        if(settings.auto.controls.play) {

          $slider.data('play-control', $('<button/>')
            .addClass(settings.cssPrefix + 'control')
            .addClass(settings.cssPrefix + 'play')
            .html(settings.auto.controls.play)
            .click(function() {$slider.trigger('stop'); })
            .appendTo(sliderControlContainer)
          );

          if(settings.a11y.controls.play) {
            $('<span/>')
            .addClass(settings.a11y.className)
            .html(settings.a11y.controls.play)
            .prependTo($slider.data('play-control'));
          }

        } // End play button insertion


        // Setup animation
        $slider.bind('start', function(e, immediate) {
          if(!settings.auto.enabled) {
            return;
          }

          var $slider = $(this),
              callback = forward_func($slider);

          // Slider is playing, so highlight play button
          if($slider.data('play-control')) {
            $slider.data('play-control').attr('title', settings.auto.controls.tooltip.playing).addClass('active');
          }

          // Lowlight pause button
          if($slider.data('pause-control')) {
            $slider.data('pause-control').attr('title', settings.auto.controls.tooltip.pause).removeClass('active');
          }

          if('function' == typeof settings.forwardCallback) {
            callback = settings.forwardCallback.bind($slider, callback);
          }

          if(immediate) callback();

          clearTimeout($slider.data('timeout'));
          $(this).data('timeout', setInterval(callback, settings.auto.timeout));

        });

        $slider.bind('stop', function(e) {
          clearTimeout($(this).data('timeout'));

            // Slider is paused, lowlight play button
            if($slider.data('play-control')) {
              $slider.data('play-control').attr('title', settings.auto.controls.tooltip.play).removeClass('active');
            }

            // Highlight pause button
            if($slider.data('pause-control')) {
              $slider.data('pause-control').attr('title', settings.auto.controls.tooltip.paused).addClass('active');
            }

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

})(jQuery);
