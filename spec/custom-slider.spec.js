
describe('Slider with custom options', function() {

  var sliderContainer,
      options;

  beforeEach(function() {
    sliderContainer = $('<div class="slider"><div>1</div><div>2</div><div>3</div><div>4</div></ul>')
      .appendTo($('body'));
    options = {
      itemSelector: 'div'
    };
  });

  afterEach(function() {
    sliderContainer.remove();
    var controlClasses = ['prev', 'next', 'goto'].map(function(str) {
      return '.' + (options.cssPrefix || 'slider-') + str;
    }).join(',');
    $(controlClasses).remove();
  });

  it('should match a custom itemSelector', function() {
    sliderContainer.slider(options);
    expect(sliderContainer).toHaveData('positions', 4);
  });

  it('should allow the classname prefix to be overridden', function() {
    options.cssPrefix = 'mySlider-';
    sliderContainer.slider(options);
    expect($('.mySlider-goto')).toExist();
  });

  describe('Overriding the startIndex', function() {

    beforeEach(function() {
      options.startIndex = 1;
      sliderContainer.slider(options);
    });

    it('should start with the position set to the overridden startIndex', function() {
      expect(sliderContainer).toHaveData('position', 1);
    });

    it('should go up 1 step at a time', function() {
      $('.slider-next').click();
      expect(sliderContainer).toHaveData('position', 2);
    });

    it('should correctly identify item links', function() {
      expect($('.slider-goto-0').length).toBe(0);
      expect($('.slider-goto-4')).toExist();
    });

  });

  describe('Defining custom labels', function() {

    describe('Removing the previous control', function() {

      beforeEach(function() {
        options.controls = {
          previous: false
        };
      });

      it('should not have a previous button', function() {
        expect($('.slider-prev').length).toBe(0);
      });

    });

    describe('Removing the next control', function() {

      beforeEach(function() {
        options.controls = {
          next: false
        };
      });

      it('should not have a next button', function() {
        expect($('.slider-next').length).toBe(0);
      });

    });

    describe('Removing the item controls', function() {

      beforeEach(function() {
        options.controls = {
          item: false
        };
      });

      it('should not have item controls', function() {
        expect($('.slider-goto').length).toBe(0);
      });

    });

  });

});
