
describe('Slider with event listener', function() {

  var sliderContainer,
      callback;

  beforeEach(function() {
    callback = jasmine.createSpy();
    sliderContainer = $('<div class="slider"><div>1</div><div>2</div><div>3</div><div>4</div></ul>')
      .appendTo($('body'))
      .slider({itemSelector: 'div'})
      .bind('sliderChanged', callback);
  });

  afterEach(function() {
    sliderContainer.remove();
    var controlClasses = ['prev', 'next', 'goto'].map(function(str) {
      return '.slider-' + str;
    }).join(',');
    $(controlClasses).remove();
  });

  it('should fire a sliderChanged event when next is clicked', function() {
    $('.slider-next').click();
    expect(callback).toHaveBeenTriggeredWith(1, 0);
  });

  it('should fire a sliderChanged event with correct position when an item control is clicked', function() {
    $('.slider-goto-3').click();
    expect(callback).toHaveBeenTriggeredWith(3, 0);
  });

  it('should not fire a sliderChanged event when the position has not changed', function() {
    $('.slider-prev').click();
    expect(callback).not.toHaveBeenCalled();
  });

});
