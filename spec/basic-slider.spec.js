
describe('Basic slider', function() {

  var sliderContainer;

  beforeEach(function() {
    sliderContainer = $('<ul class="slider"><li>1</li><li>2</li></ul>')
      .appendTo($('body'))
      .slider();
  });

  afterEach(function() {
    sliderContainer.remove();
    $('.slider-prev,.slider-next,.slider-goto').remove();
  });

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
    expect(sliderContainer.data('position')).toBe(0);
  });

  it('should advance when next is clicked', function() {
    $('.slider-next').click();
    expect(sliderContainer.data('position')).toBe(1);
  });

  it('should not advance past the end', function() {
    $('.slider-next').click();
    $('.slider-next').click();
    expect(sliderContainer.data('position')).toBe(1);
  });

  it('should go back when prev is clicked', function() {
    $('.slider-next').click();
    $('.slider-prev').click();
    expect(sliderContainer.data('position')).toBe(0);
  });

  it('should not go back past the start', function() {
    $('slider-prev').click();
    $('slider-prev').click();
    expect(sliderContainer.data('position')).toBe(0);
  });

});
