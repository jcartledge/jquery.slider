describe "Slider with custom options", ->
  sliderContainer = undefined
  options = {}
  beforeEach ->
    sliderContainer = $("<div class=\"slider\"><div>1</div><div>2</div><div>3</div><div>4</div></ul>").appendTo($("body"))
    options = itemSelector: "div"

  afterEach ->
    sliderContainer.remove()
    $("." + (options.cssPrefix or "slider-") + "control").remove()

  describe "Overriding the item selector", ->
    it "should match a custom itemSelector", ->
      sliderContainer.slider options
      expect(sliderContainer).toHaveData "positions", 4

  describe "Overriding the CSS prefix", ->
    beforeEach ->
      options.cssPrefix = "mySlider-"
      sliderContainer.slider options

    it "should allow the classname prefix to be overridden", ->
      expect($(".mySlider-goto")).toExist()

  describe "Overriding the startIndex", ->
    beforeEach ->
      options.startIndex = 1
      sliderContainer.slider options

    it "should start with the position set to the overridden startIndex", ->
      expect(sliderContainer).toHaveData "position", 1

    it "should go up 1 step at a time", ->
      $(".slider-next").click()
      expect(sliderContainer).toHaveData "position", 2

    it "should correctly identify item links", ->
      expect($(".slider-goto-0").length).toBe 0
      expect($(".slider-goto-4")).toExist()

  describe "Removing controls", ->
    beforeEach ->
      options.controls =
        prev: false
        next: false
        item: false

      sliderContainer.slider options

    it "should not have a previous button", ->
      expect($(".slider-prev").length).toBe 0

    it "should not have a next button", ->
      expect($(".slider-next").length).toBe 0

    it "should not have item controls", ->
      expect($(".slider-goto").length).toBe 0

  describe "Overriding control labels", ->
    beforeEach ->
      options.controls =
        prev: "◀"
        next: "▶"
        item: "⚫"

      sliderContainer.slider options

    it "should no longer have a default previous button", ->
      expect($(".slider-prev")).toHaveText options.controls.prev

    it "should no longer have a default next button", ->
      expect($(".slider-next")).toHaveText options.controls.next

    it "should no longer have a default item button", ->
      expect($(".slider-goto").first()).toHaveText options.controls.item

  describe "Looping", ->
    callback = undefined
    positions = undefined
    last = undefined
    beforeEach ->
      callback = jasmine.createSpy()
      options.loop = true
      sliderContainer.slider options
      last = sliderContainer.data("positions") - 1

    it "should loop forwards from end to start", ->
      $(".slider-goto").last().click()
      sliderContainer.bind "sliderChanged", callback
      $(".slider-next").click()
      expect(callback).toHaveBeenTriggeredWith 0, last

    it "should loop backwards from start to end", ->
      sliderContainer.bind "sliderChanged", callback
      $(".slider-prev").click()
      expect(callback).toHaveBeenTriggeredWith last, 0

    it "should set not set disabled class on the next button when the end is reached", ->
      $(".slider-goto").last().click()
      expect($(".slider-next")).not.toBeDisabled()

    it "should not set disabled class on the previous button when the start is reached", ->
      $(".slider-next").click()
      $(".slider-prev").click()
      expect($(".slider-prev")).not.toBeDisabled()

    it "should set disabled class on the previous button initially", ->
      expect($(".slider-prev")).not.toBeDisabled()