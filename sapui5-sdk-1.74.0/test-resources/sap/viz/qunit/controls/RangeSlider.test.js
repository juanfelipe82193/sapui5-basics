/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/qunit/QUnitUtils", 
	"sap/viz/ui5/controls/VizSliderBasic",
	"sap/viz/ui5/controls/VizSliderBasicRenderer",
	"test-resources/sap/viz/qunit/js/RangeSliderData"
], function(qutils, VizSliderBasic, VizSliderBasicRenderer, RangeSliderData) {

$(function() {
    $('#content').css('height', '500px');
    $('#content').css('padding-top', '200px');
    $('#content').css('padding-left', '50px');
});

/* =========================================================== */
/* VizSlider module                                            */
/* =========================================================== */
var oVizFrame;
var frameIndex = 0;
QUnit.module("VizSlider",{
    beforeEach: function(){
      oVizFrame = RangeSliderData.createRangeSliderTime();
    },
    afterEach: function(){
       oVizFrame._getRangeSlider().removeEventDelegate(testObj);
       frameIndex++;
      //oVizFrame.exit();
      //$('#content').html("");
    }
});

var EventTestUtil = {
    selectRangeByHandle : function(){
      var handleElement = document.getElementsByClassName('ui5-sap-viz-vizSliderHandle-right')[frameIndex];
      var o = handleElement.getBoundingClientRect(),
        position = {
          x: (o.left + o.right) / 2,
          y: (o.top + o.bottom) / 2
        },
        mouseInit = {
          bubbles: true,
            cancelable: true,
            view: window,
          clientX: o.x,
          clientY: o.y,
        };
      var mouseEvent = document.createEvent ("MouseEvent");
      // handle select
      mouseEvent.initMouseEvent('mousedown',  true, true, window, 0,
          undefined, undefined, o.x, o.y,
          undefined, undefined, undefined, undefined,
          0, null);
      handleElement.dispatchEvent(mouseEvent);
      mouseEvent.initMouseEvent('mousemove',  true, true, window, 0,
          undefined, undefined, o.x - 100, o.y,
          undefined, undefined, undefined, undefined,
          0, null);
      handleElement.dispatchEvent(mouseEvent);
      mouseEvent.initMouseEvent('mouseup',  true, true, window, 0,
          undefined, undefined, o.x, o.y,
          undefined, undefined, undefined, undefined,
          0, null);
      handleElement.dispatchEvent(mouseEvent);
    },
    selectRangeByProgress:function(){
      // selector select
      var progressElement = document.getElementsByClassName('sapVizSlider')[frameIndex];
      var o = progressElement.getBoundingClientRect(),
        position = {
          x: (o.left + o.right) / 2,
          y: (o.top + o.bottom) / 2
        },
        mouseInit = {
          bubbles: true,
            cancelable: true,
            view: window,
          clientX: o.x,
          clientY: o.y,
        };
      var mouseEvent = document.createEvent ("MouseEvent");
      mouseEvent.initMouseEvent('mousedown',  true, true, window, 0,
          undefined, undefined, o.x , o.y,
          undefined, undefined, undefined, undefined,
          0, null);
      progressElement.dispatchEvent(mouseEvent);
      mouseEvent.initMouseEvent('mousemove',  true, true, window, 0,
          undefined, undefined, o.x + 50 , o.y,
          undefined, undefined, undefined, undefined,
          0, null);
      progressElement.dispatchEvent(mouseEvent);
      mouseEvent.initMouseEvent('mouseup',  true, true, window, 0,
          undefined, undefined, o.x + 50 , o.y,
          undefined, undefined, undefined, undefined,
          0, null);
      progressElement.dispatchEvent(mouseEvent);
    },
    destroy : function(oControls){
      oControls.chartPopover.destroy();
      oControls.vizFrame.destroy();
    }
  };

var testFunc = function(assert, done){
    assert.equal($('.ui5-sap-viz-vizSliderLabel').css('visibility'), "hidden", 
      "percentage label api okay");
    // slider size check
    var jDom = oVizFrame._getVizFrame().$();
    var dom = jDom.context;
    var boundingBox = dom.querySelector(".v-m-plot").getBoundingClientRect();
    var sliderBox = document.getElementsByClassName('ui5-sap-viz-vizRangeSlider')[frameIndex].getBoundingClientRect();

    // slider size
    // attenrion: getBoundingClientRect gives different values in IE&Edge and Chrome, so additional 3px is added
    assert.ok(Math.round(sliderBox.width) + 3 >= Math.round(boundingBox.width), "slider's width greater than plot area");
    assert.ok(Math.round(sliderBox.height) >= Math.round(boundingBox.height), "slider's height greater than plot area");  
    // slider position check
    assert.equal(Math.round(sliderBox.left), Math.round(boundingBox.left), "slider left offset right");
    // slider event checking
    EventTestUtil.selectRangeByHandle();
    EventTestUtil.selectRangeByProgress();
    done();
};

var testObj;

QUnit.test("VizSlider_Column",function(assert){
	testObj = {"onAfterRendering":testFunc.bind(null, assert, assert.async())};
    oVizFrame = RangeSliderData.createRangeSliderColumn();
    oVizFrame.setShowPercentageLabel(false);
    oVizFrame._getRangeSlider().addEventDelegate(testObj,this);
    oVizFrame.placeAt("content");
});


QUnit.test("VizSlider_TimeLine",function(assert){
  oVizFrame = RangeSliderData.createRangeSliderTime();                      
  oVizFrame.setShowPercentageLabel(false);
  var apiTest = function(){
   
    var totalRange = {start: 1419927780773, end: 1433173019227};
    var total = totalRange.end - totalRange.start;

    var initRange = {start: 1420000000000, end: 1430000000000};
    var curRange = oVizFrame.getRange();

    var startDiff = Math.abs(initRange.start - curRange.start)/total;
    var endDiff = Math.abs(initRange.end - curRange.end)/total;

    assert.equal(true,startDiff<0.01 && endDiff<0.01,"API matches");
  };
  oVizFrame._getRangeSlider().addEventDelegate(
    {"onAfterRendering":apiTest},this);
  oVizFrame._getRangeSlider().addEventDelegate(
    {"onAfterRendering":testFunc.bind(null, assert, assert.async())},this);
  oVizFrame.placeAt("content"); 
});


/* =========================================================== */
/* VizSliderBasic module                                       */
/* =========================================================== */
QUnit.module("VizSliderBasic");
QUnit.test("rendering", function(assert) {
  var oSlider0 = new VizSliderBasic();

  var oSlider1 = new VizSliderBasic({
    width: "300px",
    value: 69,
    min: 10,
    max: 100,
    step: 1,
    progress: false,
    visible: false,
    enabled: false
  });

  var oSlider2 = new VizSliderBasic({
    width: "250px",
    value: 67,
    min: 5,
    max: 90,
    step: 1,
    progress: true,
    visible: true,
    enabled: true,
    name: "slider1"
  });

  var oSlider3 = new VizSliderBasic({
    value: 70,
    min: 10,
    max: 100,
    width: "150px",
    step: 5,
    progress : true,
    visible: true,
    enabled: true
  });

  var oSlider4 = new VizSliderBasic({
    value: 27,
    width: "10em"
  });

  var oSlider5 = new VizSliderBasic({
    value: 20,
    width: "15em",
    enabled: false
  });

  var oSlider6 = new VizSliderBasic({
    value: 10.34,
    step: 0.1
  });

  var oSlider7 = new VizSliderBasic({
    value: 50.34,
    step: 0.01,
    min: 50
  });

  var oSlider8 = new VizSliderBasic({
    value: 150,
    step: 50,
    min: 0,
    max: 500
  });

  var oSlider9 = new VizSliderBasic({
    value: 160,
    step: 0.5,
    min: 0,
    max: 500
  });

  var oSlider10 = new VizSliderBasic({
    step: 0.01,
    value: 10.35,
    min: 0,
    max: 500
  });

  var oSlider11 = new VizSliderBasic({
    step: 0.01,
    value: 66,
    min: 10.4,
    max: 500.5
  });

  // arrange
  oSlider0.placeAt("content1");
  oSlider1.placeAt("content1");
  oSlider2.placeAt("content1");
  oSlider3.placeAt("content1");
  oSlider4.placeAt("content1");
  oSlider5.placeAt("content1");
  oSlider6.placeAt("content1");
  oSlider7.placeAt("content1");
  oSlider8.placeAt("content1");
  oSlider9.placeAt("content1");
  oSlider10.placeAt("content1");
  oSlider11.placeAt("content1");
  sap.ui.getCore().applyChanges();

  var aSliders = [oSlider0, oSlider1, oSlider2, oSlider3, oSlider4, oSlider5, oSlider6, oSlider7, oSlider8, oSlider9, oSlider10, oSlider11];
  var CSS_CLASS = VizSliderBasicRenderer.CSS_CLASS;

  // assert
  for (var iIndex = 0, oSlider; iIndex < aSliders.length; iIndex++) {
    oSlider = aSliders[iIndex];

    if (!oSlider.getVisible()) {
      continue;
    }

    if (oSlider.getEnabled()) {

      assert.ok(oSlider.getDomRef(), "The slider HTML DIV element container exist");
      assert.ok(oSlider.getDomRef("inner"), "The slider HTML DIV element exist");

      if (oSlider.getProgress()) {
        assert.ok(oSlider.getDomRef("progress"), "The slider progress indicator HTML DIV element exist");
      }

      assert.ok(oSlider.getDomRef("handle"), "The slider handle HTML Span element exist");

      if (oSlider.getName()) {
        assert.ok(oSlider.getDomRef("input"), "The slider HTML input element exist");
      } else {
        assert.ok(!oSlider.getDomRef("input"), "The slider HTML input element does not exist");
      }

      assert.ok(oSlider.$().hasClass(CSS_CLASS), 'The slider root HTML Div element "must have" the CSS class "' + CSS_CLASS + '"');
      assert.ok(oSlider.$("inner").hasClass(CSS_CLASS + "Inner"), 'The slider first-child HTML Div element "must have" the CSS class "' + CSS_CLASS + 'Inner"');

      if (oSlider.getProgress()) {
        assert.ok(oSlider.$("progress").hasClass(CSS_CLASS + "Progress"), 'The slider progress indicator HTML Div element "must have" the CSS class "' + CSS_CLASS + 'Progress"');
      }

      assert.ok(oSlider.$("handle").hasClass(CSS_CLASS + "Handle"), 'The slider handle HTML Span element "must have" the CSS class "' + CSS_CLASS + 'Handle"');

      if (oSlider.getName()) {
        assert.ok(oSlider.$("input").hasClass(CSS_CLASS + "Input"), 'The slider HTML Input element "must have" the CSS class "' + CSS_CLASS + 'Input"');
      }

      assert.strictEqual(jQuery(oSlider.getFocusDomRef()).attr("aria-disabled"), undefined, 'The "aria-disabled" attribute is not set');
    } else {
      assert.strictEqual(jQuery(oSlider.getFocusDomRef()).attr("aria-disabled"), "true", 'The "aria-disabled" attribute is set');
      assert.ok(oSlider.$().hasClass(CSS_CLASS + "Disabled"), 'The slider HTML DIV element container must have the CSS class "' + CSS_CLASS + 'Disabled"');
    }

    assert.strictEqual(jQuery.trim(oSlider.getDomRef().style.width), oSlider.getWidth(), 'Check if the style attribute has the correct value');
    assert.ok(oSlider.getDomRef("progress"), 'The slider div element "must have" the css class "' + CSS_CLASS + 'Progress"');
    assert.ok(oSlider.getDomRef("handle"), 'The slider span thumb element "must have" the css class "' + CSS_CLASS + 'Handle"');

    if (oSlider.getName()) {
      assert.strictEqual(oSlider.getValue(), +oSlider.$("input").attr("value"), 'The "value" attribute of the INPUT is 0');
      assert.strictEqual(oSlider.getValue(), +oSlider.$("input").prop("value"), 'The "value" property of the INPUT is 0');
    }

    // cleanup
    oSlider.destroy();
  }
});
QUnit.test("Firing events: touchstart", function(assert) {
  // system under test
  var oSlider = new VizSliderBasic({
    width: "250px",
    value: 67,
    min: 5,
    max: 90,
    step: 1
  });
  // arrange
  oSlider.placeAt("content1");
  sap.ui.getCore().applyChanges();
  var oTouches = {
    0: {
      pageX: 150,
      length: 1
    },

    length: 1
  };
  // act
  qutils.triggerTouchEvent("touchstart", oSlider.getDomRef(), {
    targetTouches: oTouches,
    srcControl: oSlider
  });
  // assert
  assert.ok(oSlider.$("inner").hasClass(VizSliderBasicRenderer.CSS_CLASS + "Pressed"), 'On touchstart event the slider innner div muss have the CSS class “' + VizSliderBasicRenderer.CSS_CLASS + 'Pressed”');
  assert.ok(jQuery(oSlider.getFocusDomRef()).hasClass(VizSliderBasicRenderer.CSS_CLASS + "Handle"), "The focus should be in the slider handle");
  // cleanup
  oSlider.destroy();
});

QUnit.start();
});