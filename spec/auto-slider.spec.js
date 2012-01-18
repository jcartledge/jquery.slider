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
    var controlClasses = ['prev', 'next', 'goto'].map(function(str) {
      return '.slider-' + str;
    }).join(',');
    $(controlClasses).remove();
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

});
