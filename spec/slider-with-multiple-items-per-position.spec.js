describe('Slider with multiple items per position', function() {

  var sliderContainer,
      options;

  beforeEach(function() {
    options = {
      itemSelector: 'div'
    };
    sliderContainer = $('<div class="slider" data-positions="2"><div>1</div><div>2</div><div>3</div><div>4</div></div>')
      .appendTo($('body'))
      .slider(options);
  });

  afterEach(function() {
    sliderContainer.remove();
    $('.slider-control').remove();
  });

  it('should only have two positions although there are four items', function() {
    $('.slider-next').click().click();
    expect(sliderContainer).toHaveData('position', 1);
  });

  it('should set the active class on all active items', function() {
    expect($('.slider-active').length).toBe(2);
  });

  it('should set a numeric active class on all active items', function() {
    expect(sliderContainer.find(options.itemSelector).first())
      .toHaveClass('slider-active-0');
    expect(sliderContainer.find(options.itemSelector).eq(1))
      .toHaveClass('slider-active-1');
  });

  it('should set active classes correctly after changing position', function() {
    $('.slider-next').click();
    expect(sliderContainer.find(options.itemSelector).eq(2))
      .toHaveClass('slider-active-0');
    expect(sliderContainer.find(options.itemSelector).eq(3))
      .toHaveClass('slider-active-1');
  });

});
