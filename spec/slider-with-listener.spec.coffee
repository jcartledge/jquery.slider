describe "Slider with event listener", ->
  sliderContainer = undefined
  callback = undefined
  beforeEach ->
    callback = jasmine.createSpy()
    sliderContainer = $("<div class=\"slider\"><div>1</div><div>2</div><div>3</div><div>4</div></ul>").appendTo($("body")).slider(itemSelector: "div").bind("sliderChanged", callback)

  afterEach ->
    sliderContainer.remove()
    $(".slider-control").remove()

  it "should fire a sliderChanged event when next is clicked", ->
    $(".slider-next").click()
    expect(callback).toHaveBeenTriggeredWith 1, 0

  it "should fire a sliderChanged event with correct position when an item control is clicked", ->
    $(".slider-goto-3").click()
    expect(callback).toHaveBeenTriggeredWith 3, 0

  it "should not fire a sliderChanged event when the position has not changed", ->
    $(".slider-prev").click()
    expect(callback).not.toHaveBeenCalled()