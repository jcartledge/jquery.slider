
describe('Slider with custom options', function() {

  var sliderContainer,
      options = {};

  beforeEach(function() {
    sliderContainer = $('<div class="slider"><div>1</div><div>2</div><div>3</div><div>4</div></ul>')
      .appendTo($('body'));
    options = {
      itemSelector: 'div'
    };
  });

  afterEach(function() {
    sliderContainer.remove();
    $('.' + (options.cssPrefix || 'slider-') + 'control').remove();
  });

  describe('Overriding the item selector', function() {

    it('should match a custom itemSelector', function() {
      sliderContainer.slider(options);
      expect(sliderContainer).toHaveData('positions', 4);
    });

  });

  describe('Overriding the CSS prefix', function() {

    beforeEach(function() {
      options.cssPrefix = 'mySlider-';
      sliderContainer.slider(options);
    });

    it('should allow the classname prefix to be overridden', function() {
      expect($('.mySlider-goto')).toExist();
    });

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

  describe('Removing controls', function() {

    beforeEach(function() {
      options.controls = {
        prev: false,
        next: false,
        item: false
      };
      sliderContainer.slider(options);
    });

    it('should not have a previous button', function() {
      expect($('.slider-prev').length).toBe(0);
    });

    it('should not have a next button', function() {
      expect($('.slider-next').length).toBe(0);
    });

    it('should not have item controls', function() {
      expect($('.slider-goto').length).toBe(0);
    });

  });

  describe('Overriding control labels', function() {

    beforeEach(function() {
      options.controls = {
        prev: '◀',
        next: '▶',
        item: '⚫'
      };
      sliderContainer.slider(options);
    });

    it('should no longer have a default previous button', function() {
      expect($('.slider-prev')).toHaveText(options.controls.prev);
    });

    it('should no longer have a default next button', function() {
      expect($('.slider-next')).toHaveText(options.controls.next);
    });

    it('should no longer have a default item button', function() {
      expect($('.slider-goto').first()).toHaveText(options.controls.item);
    });

  });

  describe('Looping', function() {

    var callback, positions;

    beforeEach(function() {
      callback = jasmine.createSpy();
      options.loop = true;
      sliderContainer.slider(options);
      last = sliderContainer.data('positions') - 1;
    });

    it('should loop forwards from end to start', function() {
      $('.slider-goto').last().click();
      sliderContainer.bind('sliderChanged', callback);
      $('.slider-next').click();
      expect(callback).toHaveBeenTriggeredWith(0, last);
    });

    it('should loop backwards from start to end', function() {
      sliderContainer.bind('sliderChanged', callback);
      $('.slider-prev').click();
      expect(callback).toHaveBeenTriggeredWith(last, 0);
    });

  });

});
