(function() {

  describe("Slider with custom callbacks", function() {
    var options, sliderContainer;
    sliderContainer = $("<ul class=\"slider\"><li>1</li><li>2</li><li>3</li><li>4</li></ul>");
    options = {
      forwardCallback: jasmine.createSpy(),
      backwardCallback: jasmine.createSpy()
    };
    beforeEach(function() {
      return sliderContainer.appendTo($("body"));
    });
    afterEach(function() {
      sliderContainer.trigger("stop").remove();
      return $(".slider-control").remove();
    });
    it("should call the forward callback when advancing", function() {
      sliderContainer.slider(options);
      console.log(sliderContainer);
      expect(options.forwardCallback).not.toHaveBeenCalled();
      $('.slider-next').click();
      return expect(options.forwardCallback).toHaveBeenCalled();
    });
    return it("should call the backward callback when going back", function() {
      sliderContainer.slider(options);
      console.log(sliderContainer);
      $('.slider-prev').click();
      return expect(options.backwardCallback).toHaveBeenCalled();
    });
  });

}).call(this);
