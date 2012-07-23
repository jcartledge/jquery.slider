describe "Automatically updating slider", ->
  sliderContainer = undefined
  callback = undefined
  options = auto:
    enabled: true
    timeout: 10

  beforeEach ->
    callback = jasmine.createSpy()
    sliderContainer = $("<ul class=\"slider\"><li>1</li><li>2</li><li>3</li><li>4</li></ul>").appendTo($("body"))

  afterEach ->
    sliderContainer.slider("stop").remove()
    $(".slider-control").remove()

  it "should animate", ->
    sliderContainer.bind("sliderChanged", callback).slider options
    waits 15
    runs ->
      expect(callback).toHaveBeenTriggeredWith 1, 0

  it "should obey options.auto.start", ->
    options.auto.start = false
    sliderContainer.bind("sliderChanged", callback).slider options
    waits 15
    runs ->
      expect(callback).not.toHaveBeenCalled()

  it "should respond to trigger('start')", ->
    options.auto.start = false
    sliderContainer.bind("sliderChanged", callback).slider options
    sliderContainer.trigger "start"
    waits 15
    runs ->
      expect(callback).toHaveBeenTriggeredWith 1, 0

  it "should respond to trigger('stop')", ->
    sliderContainer.slider options
    sliderContainer.trigger("stop").bind "sliderChanged", callback
    waits 15
    runs ->
      expect(callback).not.toHaveBeenCalled()

  describe "with controls", ->
    beforeEach ->
      options.auto.start = false
      options.auto.controls =
        play: "play"
        pause: "pause"

      sliderContainer.slider options

    it "should have a play button", ->
      expect($(".slider-play")).toHaveText options.auto.controls.play

    it "should have a pause button", ->
      expect($(".slider-pause")).toHaveText options.auto.controls.pause

    it "should play when the play button is activated", ->
      $(".slider-play").click()
      waits 25
      runs ->
        expect(sliderContainer.data("position")).toBe 3

    it "should pause when the pause button is activated", ->
      $(".slider-play").click()
      waits 25
      runs ->
        $(".slider-pause").click()

      waits 25
      runs ->
        expect(sliderContainer.data("position")).toBe 3