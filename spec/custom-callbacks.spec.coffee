describe "Slider with custom callbacks", ->
  sliderContainer = $ "<ul class=\"slider\"><li>1</li><li>2</li><li>3</li><li>4</li></ul>"
  options =
    forwardCallback: jasmine.createSpy()
    backwardCallback: jasmine.createSpy()

  beforeEach ->
    sliderContainer.appendTo($("body"))

  afterEach ->
    sliderContainer.trigger("stop").remove()
    $(".slider-control").remove()

  it "should call the forward callback when advancing", ->
    sliderContainer.slider options
    console.log sliderContainer
    expect(options.forwardCallback).not.toHaveBeenCalled()
    $('.slider-next').click()
    expect(options.forwardCallback).toHaveBeenCalled()

  it "should call the backward callback when going back", ->
    sliderContainer.slider options
    console.log sliderContainer
    expect(options.backwardCallback).not.toHaveBeenCalled()
    $('.slider-prev').click()
    expect(options.backwardCallback).toHaveBeenCalled()
