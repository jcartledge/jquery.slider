describe "Slider with multiple items per position", ->
  sliderContainer = undefined
  options = undefined
  beforeEach ->
    options =
      itemSelector: "div"
      itemsPerPosition: 2

    sliderContainer = $("<div class=\"slider\"><div>1</div><div>2</div><div>3</div><div>4</div></div>").appendTo($("body")).slider(options)

  afterEach ->
    sliderContainer.remove()
    $(".slider-control").remove()

  it "should only have two positions although there are four items", ->
    $(".slider-next").click().click()
    expect(sliderContainer).toHaveData "position", 1

  it "should set the active class on all active items", ->
    expect($(".slider-active").length).toBe 2

  it "should set a numeric active class on all active items", ->
    expect(sliderContainer.find(options.itemSelector).first()).toHaveClass "slider-active-0"
    expect(sliderContainer.find(options.itemSelector).eq(1)).toHaveClass "slider-active-1"

  it "should set active classes correctly after changing position", ->
    $(".slider-next").click()
    expect(sliderContainer.find(options.itemSelector).eq(2)).toHaveClass "slider-active-0"
    expect(sliderContainer.find(options.itemSelector).eq(3)).toHaveClass "slider-active-1"