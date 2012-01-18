describe('Slider with multiple items per position', function() {

  var sliderContainer;

  beforeEach(function() {
    sliderContainer = $('<div class="slider" data-positions="2"><div>1</div><div>2</div><div>3</div><div>4</div></div>')
      .appendTo($('body'))
      .slider({itemSelector: 'div'});
  });

  afterEach(function() {
    sliderContainer.remove();
    $('.slider-control').remove();
  });

  it('should only have two positions although there are four items', function() {
    $('.slider-next').click().click();
    expect(sliderContainer).toHaveData('position', 1);
  });

});
