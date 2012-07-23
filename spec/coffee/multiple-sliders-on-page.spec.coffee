describe "Multiple sliders on one page", ->
  sliderContainer1 = undefined
  sliderContainer2 = undefined
  beforeEach ->
    sliderContainer1 = $("<ul class=\"slider slider-1\"><li>1</li><li>2</li><li>3</li></ul>").appendTo($("body")).slider()
    sliderContainer2 = $("<ul class=\"slider slider-2\"><li>1</li><li>2</li><li>3</li></ul>").appendTo($("body")).slider()

  afterEach ->
    sliderContainer1.remove()
    sliderContainer2.remove()
    $(".slider-control").remove()

  it "should not disable controls of slider above when slider controls are disabled", ->
    $(".slider-next").eq(1).click().click().click()
    expect($(".slider-next").eq(1)).toBeDisabled()
    expect($(".slider-next").eq(0)).not.toBeDisabled()