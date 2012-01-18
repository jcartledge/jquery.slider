describe('Automatically updating slider', function() {

  var sliderContainer,
      callback,
      options = {
        auto: {
          enabled: true,
          timeout: 10
        }
      };

  beforeEach(function() {
    callback = jasmine.createSpy();
    sliderContainer = $('<ul class="slider"><li>1</li><li>2</li><li>3</li><li>4</li></ul>')
      .appendTo($('body'));
  });

  afterEach(function() {
    sliderContainer.slider('stop').remove();
    $('.slider-control').remove();
  });

  it('should animate', function() {
    sliderContainer.bind('sliderChanged', callback).slider(options);
    waits(15);
    runs(function() {
      expect(callback).toHaveBeenTriggeredWith(1, 0);
    });
  });

  it('should obey options.auto.start', function() {
    options.auto.start = false;
    sliderContainer.bind('sliderChanged', callback).slider(options);
    waits(15);
    runs(function() {
      expect(callback).not.toHaveBeenCalled();
    });
  });

  it("should respond to .slider('start')", function() {
    options.auto.start = false;
    sliderContainer.bind('sliderChanged', callback).slider(options);
    sliderContainer.slider('start');
    waits(15);
    runs(function() {
      expect(callback).toHaveBeenTriggeredWith(1, 0);
    });
  });

  it("should respond to .slider('stop')", function() {
    sliderContainer.slider(options);
    sliderContainer.slider('stop').bind('sliderChanged', callback);
    waits(15);
    runs(function() {
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with controls', function() {

    beforeEach(function() {
      options.auto.start = false;
      options.auto.controls = {
        play: 'play',
        pause: 'pause'
      };
      sliderContainer.slider(options);
    });

    it('should have a play button', function() {
      expect($('.slider-play')).toHaveText(options.auto.controls.play);
    });

    it('should have a pause button', function() {
      expect($('.slider-pause')).toHaveText(options.auto.controls.pause);
    });

    it('should play when the play button is activated', function() {
      $('.slider-play').click();
      waits(25);
      runs(function() {
        expect(sliderContainer.data('position')).toBe(3);
      });
    });

    it('should pause when the pause button is activated', function() {
      $('.slider-play').click();
      waits(25);
      runs(function() {
        $('.slider-pause').click();
      });
      waits(25);
      runs(function() {
        expect(sliderContainer.data('position')).toBe(3);
      });
    });

  });

});
