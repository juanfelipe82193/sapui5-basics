/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"test-resources/sap/viz/qunit/js/vizFrameData"
], function(vizFrameData) {

  var EventTestUtil = {
  selectData : function(index){
    var element = d3.selectAll('#content').selectAll('.v-datapoint')[0][index],
      o = element.getBoundingClientRect(),
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
    var mousedown = document.createEvent ("MouseEvent");
    mousedown.initMouseEvent('mousedown',  true, true, window, 0,
        undefined, undefined, o.x, o.y,
        undefined, undefined, undefined, undefined,
        0, null);
    element.dispatchEvent(mousedown);
    var mouseup = document.createEvent ("MouseEvent");
    mouseup.initMouseEvent('mouseup',  true, true, window, 0,
        undefined, undefined, o.x, o.y,
        undefined, undefined, undefined, undefined,
        0, null);
    element.dispatchEvent(mouseup);
  },
  destroy : function(oControls){
    oControls.chartPopover.destroy();
    oControls.vizFrame.destroy();
  }
};

var result;
$(function() {
  $('#content').css('height', '800px');
});

QUnit.module('Check Bar Chart Popover', {
  beforeEach: function(){
    result = vizFrameData.createXYChart('info/bar');
  },
  afterEach: function(){
    EventTestUtil.destroy(result);
  }
});

QUnit.test("Check small data point." , function( assert ) {
  assert.expect(10);
  var done = assert.async();
  
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Bar chart is renderComplete.');
    EventTestUtil.selectData(2);
  });
  var resPop = result.chartPopover._Popover._oPopover;

  var checkSmallDataPoint = function(e){
    var data = e.getParameters(),
        rectPos = data.openBy.getBoundingClientRect(),
        popPos = this.$().position();
    assert.equal(this.getPlacement(), 'PreferredRightOrFlip', 'Popover should be opened with PreferredRightOrFlip.');
    assert.ok((rectPos.right < popPos.left) && (rectPos.top > popPos.top), 'Popover should be opend in the right side.');

    assert.equal($('.viz-controls-chartPopover-dimension-label').text(), "2009 - France", "Dimension label should be correct.");
    assert.equal($('.viz-controls-chartPopover-measure-name').text(), 'Cost', "Measure label should be correct.");
    assert.equal($('.viz-controls-chartPopover-measure-name').css('text-align'), 'left', "Measure label should align in the left side.");

    assert.equal($('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value >span').text(), "80", "Measure value should be correct.");

    var actualMarker = $('#markers svg'),
    expectedMarker = $('.viz-controls-chartPopover-dimension-marker svg');
    assert.equal(actualMarker.attr('width'), expectedMarker.attr('width'), 'shapeString width should the same as Popover marker');
    assert.equal(actualMarker.find('path').attr('d'), expectedMarker.find('path').attr('d'), 'shapeString path should the same as Popover marker');
    assert.equal(actualMarker.find('path').attr('fill'), expectedMarker.find('path').attr('fill'), 'shapeString fill should the same as Popover marker');

    resPop.detachAfterOpen(checkSmallDataPoint);
    result.vizFrame.detachEvent("_selectionDetails", attachSelectionDetail);
    done();
  };
  resPop.attachAfterOpen(checkSmallDataPoint);

  var attachSelectionDetail = function(oEvent) {
    console.log('_selectionDetails');
    console.log(oEvent.mParameters);
    $('#markers').html(oEvent.mParameters.data[0].shapeString);
  };
  result.vizFrame.attachEvent("_selectionDetails", attachSelectionDetail);
});

QUnit.test("check Large DataPoint." , function( assert ) {
  assert.expect(4);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Bar chart is renderComplete.');
    EventTestUtil.selectData(8);
  });

  var resPop = result.chartPopover._Popover._oPopover;
  var checkLargeDataPoint = function(e){
    var data = e.getParameters(),
        rectPos = data.openBy.getBoundingClientRect(),
        popPos = this.$().position();
    assert.equal(this.getPlacement(), 'PreferredRightOrFlip', 'Popover should be opened with PreferredRightOrFlip.');
    assert.ok((rectPos.right > popPos.left), 'Popover should be opend in the right side.');
    assert.ok(rectPos.left < popPos.left, 'Popover should not over than rect.left');
    resPop.detachAfterOpen(checkLargeDataPoint);
    done();
  };

  resPop.attachAfterOpen(checkLargeDataPoint);
});

QUnit.test("check Negative DataPoint." , function( assert ) {
  assert.expect(3);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Bar chart is renderComplete.');
    EventTestUtil.selectData(3);
  });

  var resPop = result.chartPopover._Popover._oPopover;
  var checkNegativeDataPoint = function(e){
    var data = e.getParameters(),
        rectPos = data.openBy.getBoundingClientRect(),
        popPos = this.$().position();
    assert.equal(this.getPlacement(), 'PreferredLeftOrFlip', 'Popover should be opened with PreferredLeftOrFlip.');
    assert.ok(rectPos.right < popPos.left + this.$().width(), 'Popover should be opend in the right side.');
    done();

  };
  resPop.attachAfterOpen(checkNegativeDataPoint);
});

QUnit.module('Check Bullet Chart Popover', {
  beforeEach: function(){
    result = vizFrameData.createBullet();
  },
  afterEach: function(){
    EventTestUtil.destroy(result);
  }
});

QUnit.test("Check bullet data point." , function( assert ) {
  assert.expect(11);
  var done = assert.async();
  
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'bullet chart is renderComplete.');
    EventTestUtil.selectData(2);
  });
  var resPop = result.chartPopover._Popover._oPopover;

  var checkSmallDataPoint = function(e){
    var data = e.getParameters(),
        rectPos = data.openBy.getBoundingClientRect(),
        popPos = this.$().position();
    assert.equal(this.getPlacement(), 'PreferredRightOrFlip', 'Popover should be opened with PreferredRightOrFlip.');
    assert.ok((rectPos.right < popPos.left) && (rectPos.top > popPos.top), 'Popover should be opend in the right side.');

    assert.equal($('.viz-controls-chartPopover-dimension-label').text(), "Japan - Car", "Dimension label should be correct.");
    assert.equal($('.viz-controls-chartPopover-measure-name')[0].textContent, 'Cost', "Measure label should be correct.");
    assert.equal($('.viz-controls-chartPopover-measure-name')[1].textContent, 'Profit', "Measure label should be correct.");

    assert.equal($($('.viz-controls-chartPopover-measure-name')[0]).css('text-align'), 'left', "Measure label should align in the left side.");
    assert.equal($($('.viz-controls-chartPopover-measure-name')[1]).css('text-align'), 'left', "Measure label should align in the left side.");

    assert.equal($('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value >span')[0].textContent, "45.3", "Measure value should be correct.");
    assert.equal($('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value >span')[1].textContent, "73.2", "Measure value should be correct.");

    //not exist
    var actualMarker = $('#markers svg'),
    expectedMarker = $('.viz-controls-chartPopover-dimension-marker svg');
    assert.ok(!actualMarker.attr('width'));

    resPop.detachAfterOpen(checkSmallDataPoint);
    result.vizFrame.detachEvent("_selectionDetails", attachSelectionDetail);
    done();
  };
  resPop.attachAfterOpen(checkSmallDataPoint);

  var attachSelectionDetail = function(oEvent) {
    console.log('_selectionDetails');
    console.log(oEvent.mParameters);
    $('#markers').html(oEvent.mParameters.data[0].shapeString);
  };
  result.vizFrame.attachEvent("_selectionDetails", attachSelectionDetail);
});

QUnit.module('Check Column Chart Popover', {
  beforeEach: function(){
    result = vizFrameData.createXYChart('info/column');
  },
  afterEach: function(){
    EventTestUtil.destroy(result);
  }
});

QUnit.test("check samll data point." , function( assert ) {
  assert.expect(3);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Column chart is renderComplete.');
    EventTestUtil.selectData(0);
  });
  var resPop = result.chartPopover._Popover._oPopover;

  var checkSmallDataPoint = function(e){
    var data = e.getParameters(),
        rectPos = data.openBy.getBoundingClientRect(),
        popPos = this.$().position();
    assert.equal(this.getPlacement(), 'PreferredTopOrFlip', 'Popover should be opened with PreferredTopOrFlip.');
    assert.ok(this.$().height() + popPos.top < rectPos.top, 'Popover should be opend in the top side.');

    resPop.detachAfterOpen(checkSmallDataPoint);
    done();
  };
  resPop.attachAfterOpen(checkSmallDataPoint);
});

QUnit.test("check Large DataPoint." , function( assert ) {
  assert.expect(3);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Column chart is renderComplete.');
    EventTestUtil.selectData(8);
  });
  var resPop = result.chartPopover._Popover._oPopover;

  var checkLargeDataPoint = function(e){
    var data = e.getParameters(),
        rectPos = data.openBy.getBoundingClientRect(),
        popPos = this.$().position();
    assert.equal(this.getPlacement(), 'PreferredTopOrFlip', 'Popover should be opened with PreferredTopOrFlip.');
    // isFixedPadding and general.layout.padding are changed
    assert.ok(rectPos.top < popPos.top, 'Popover should be opend higher than rect.');
    resPop.detachAfterOpen(checkLargeDataPoint);
    done();
  };

  resPop.attachAfterOpen(checkLargeDataPoint);
});

QUnit.test("check Negative DataPoint." , function( assert ) {
  assert.expect(3);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Column chart is renderComplete.');
    EventTestUtil.selectData(3);
  });

  var checkNegativeDataPoint = function(e){
    var data = e.getParameters(),
        rectPos = data.openBy.getBoundingClientRect(),
        popPos = this.$().position();
    assert.equal(this.getPlacement(), 'PreferredBottomOrFlip', 'Popover should be opened with PreferredBottomOrFlip.');
    assert.ok(popPos.top > rectPos.bottom, 'Popover should near rect.');
    done();
  };

  var resPop = result.chartPopover._Popover._oPopover;
  resPop.attachAfterOpen(checkNegativeDataPoint);
});

QUnit.module('Check Time Line Chart Popover', {
  beforeEach: function(){
    result = vizFrameData.createTimeLineChart("popover");
  },
  afterEach: function(){
    EventTestUtil.destroy(result);
  }
});

QUnit.test("check Time format." , function( assert ) {
  assert.expect(6);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Time line chart is renderComplete.');
    EventTestUtil.selectData(1);
  });

  var checkTimeFormat = function(e){
    assert.equal(this.getPlacement(), 'VerticalPreferredTop', 'Popover should be opened with VerticalPreferredTop.');
    assert.equal($('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value >span')[0].innerText, "Jan 2, 2015", "Follows chart's tooltip format");

  var actualMarker = $('#markers svg'),
      expectedMarker = $('.viz-controls-chartPopover-dimension-marker svg');
  assert.equal(actualMarker.attr('width'), expectedMarker.attr('width'), 'shapeString width should the same as Popover marker');
  assert.equal(actualMarker.find('path').attr('d'), expectedMarker.find('path').attr('d'), 'shapeString path should the same as Popover marker');
  assert.equal(actualMarker.find('path').attr('fill'), expectedMarker.find('path').attr('fill'), 'shapeString fill should the same as Popover marker');

  result.vizFrame.detachEvent("_selectionDetails", attachSelectionDetail);
    done();
  };

  var resPop = result.chartPopover._Popover._oPopover;
  resPop.attachAfterOpen(checkTimeFormat);

var attachSelectionDetail = function(oEvent) {
  console.log('_selectionDetails');
  console.log(oEvent.mParameters);
  $('#markers').html(oEvent.mParameters.data[0].shapeString);
};
result.vizFrame.attachEvent("_selectionDetails", attachSelectionDetail);

});

QUnit.test("check Time format with Popover's formatString." , function( assert ) {
  assert.expect(3);
  var done = assert.async();
  result.chartPopover.setFormatString({'Date':'yyyy-mm-dd'});
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'Time line chart is renderComplete.');
    EventTestUtil.selectData(1);
  });

  var checkTimeFormat = function(e){
    assert.equal(this.getPlacement(), 'VerticalPreferredTop', 'Popover should be opened with VerticalPreferredTop.');
    assert.equal($('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value >span')[0].innerText, "2015-01-02", "Follows chart's tooltip format");

    done();
  };

  var resPop = result.chartPopover._Popover._oPopover;
  resPop.attachAfterOpen(checkTimeFormat);
});

QUnit.module('Check unit displayed in Popover', {
  beforeEach: function(){
    result = vizFrameData.createChartWithUnitBinding();
  },
  afterEach: function(){
    EventTestUtil.destroy(result);
  }
});

QUnit.test("check unitBinding" , function( assert ) {
  assert.expect(5);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    assert.ok(true, 'chart with unitBinding is renderComplete.');
    var aMeasure = getMeasureByName.call(this, 'Cost');
    assert.equal(aMeasure.getUnit(), 'w' ,'Unit is correct binding with constructor');
    aMeasure = getMeasureByName.call(this, 'Profit');
    assert.equal(aMeasure.getUnit(), '','Measure Profit is not binding unit');
    aMeasure.setUnit('x');
    assert.equal(aMeasure.getUnit(), 'x' ,'unitBinding is set correct');
    EventTestUtil.selectData(0);
  });

  var getMeasureByName = function(sName) {
      return this.getDataset().getMeasures().filter(function(d) {return d.getName() === sName;})[0];
  }

  var checkUnitBinding = function(e){
    assert.equal($('.viz-controls-chartPopover-measure-labels.viz-controls-chartPopover-measure-value >span')[1].textContent, "w", "unitBinding is correct displayed in Popover");
    done();
  };

  var resPop = result.chartPopover._Popover._oPopover;
  resPop.attachAfterOpen(checkUnitBinding);
});

QUnit.test("check unit format setting" , function( assert ) {
  assert.expect(1);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    EventTestUtil.selectData(1);
  });

  var checkUnitBinding = function(e){
    assert.equal($('.viz-controls-chartPopover-measure-labels >span')[1].innerText, "*^", "unit setting is correct and the priority of format setting is highter than unitBinding");
    done();
  };

  result.chartPopover.setFormatString({'Cost':{formatPattern:'StandardFloat',dataUnit:"*^"}});
  var resPop = result.chartPopover._Popover._oPopover;
  resPop.attachAfterOpen(checkUnitBinding);
});


QUnit.module('Check big Number displayed in Popover', {
  beforeEach: function(){
    result = vizFrameData.createXYChartBigNum();
  },
  afterEach: function(){
    EventTestUtil.destroy(result);
  }
});

QUnit.test("check bigNumber display" , function( assert ) {
  assert.expect(1);
  var done = assert.async();
  result.vizFrame.attachEventOnce('renderComplete', function() {
    EventTestUtil.selectData(1);
  });

  var checkUnitBinding = function(e){
    assert.equal($('.viz-controls-chartPopover-measure-labels >span')[0].innerText, "1,337,087,666,787,876,655.53",
     "Big Number string display correctly");
    done();
  };

  var resPop = result.chartPopover._Popover._oPopover;
  resPop.attachAfterOpen(checkUnitBinding);

});

  QUnit.start();
});