
describe('Basic slider', function() {

  var sliderContainer;

  beforeEach(function() {
    sliderContainer = $('<ul class="slider"><li>1</li><li>2</li></ul>')
      .appendTo($('body'))
      .slider();
  });

  afterEach(function() {
    sliderContainer.remove();
    $('.slider-control').remove();
  });

  describe('Controls should exist and work as expected', function() {

    it('should have a previous control', function() {
      expect($('.slider-prev')).toExist();
    });

    it('should have a next control', function() {
      expect($('.slider-next')).toExist();
    });

    it('should have 2 item controls', function() {
      expect($('.slider-goto').length).toBe(2);
    });

    it('should start on the first slide', function() {
      expect(sliderContainer).toHaveData('position', 0);
    });

    it('should advance when next is clicked', function() {
      $('.slider-next').click();
      expect(sliderContainer).toHaveData('position', 1);
    });

    it('should not advance past the end', function() {
      $('.slider-next').click();
      $('.slider-next').click();
      expect(sliderContainer).toHaveData('position', 1);
    });

    it('should go back when prev is clicked', function() {
      $('.slider-next').click();
      $('.slider-prev').click();
      expect(sliderContainer).toHaveData('position', 0);
    });

    it('should not go back past the start', function() {
      $('.slider-prev').click();
      $('.slider-prev').click();
      expect(sliderContainer).toHaveData('position', 0);
    });

    it('should go to a specific item', function() {
      $('.slider-goto-1').click();
      expect(sliderContainer).toHaveData('position', 1);
      $('.slider-goto-0').click();
      expect(sliderContainer).toHaveData('position', 0);
    });

  });

  describe('Controls should have sensible default labels', function() {

    it('should have a sensible default label for the previous button', function() {
      expect($('.slider-prev')).toHaveText('previous');
    });

    it('should have a sensible default label for the next button', function() {
      expect($('.slider-next')).toHaveText('next');
    });

    it('should have numeric labels for item buttons', function() {
      expect($('.slider-goto-0')).toHaveText('0');
      expect($('.slider-goto-1')).toHaveText('1');
    });

  });

  describe('Controls should set the slider-active class on active items', function() {

    it('should set the slider-active class on the first item initially', function() {
      var pos = sliderContainer.data('position');
      expect(sliderContainer.find('li').first()).toHaveClass('slider-active');
    });

    it('should set the slider-active class on the first item initially', function() {
      $('.slider-next').click();
      var pos = sliderContainer.data('position');
      expect($(sliderContainer.find('li').get(pos))).toHaveClass('slider-active');
    });

  });

});
