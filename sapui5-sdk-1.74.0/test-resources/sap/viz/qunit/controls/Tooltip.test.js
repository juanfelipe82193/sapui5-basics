/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"test-resources/sap/viz/qunit/js/MouseEventUtils",
	"test-resources/sap/viz/qunit/js/vizFrameData"
], function(mouseEvent, vizFrameData) {

var result;
$(function() {
    $('#content').css('height', '800px');
});

QUnit.module('Check Tooltip Timer', {
    beforeEach: function(){
        result = vizFrameData.createXYChart('info/bar', "tooltip");
    },
    afterEach: function(){
        result.vizFrame.destroy();
        result.chartTooltip.destroy();
    }
});

QUnit.test("Check long timer" , function(assert) {
    var done = assert.async();
    var sid = result.chartTooltip._oTooltipContainer.sId;
    result.chartTooltip._oPopup.attachOpened(function() {
        assert.ok(true, "show tooltip");
        assert.equal(jQuery("#"+sid+" .viz-controls-chartTooltip-label").first().text(), "Year", "Dimension label should be correct");
        assert.equal(jQuery("#"+sid+" .viz-controls-chartTooltip-dimension-value").first().text(), "2009", "Dimension value should be correct");
        assert.equal(jQuery("#"+sid+" .viz-controls-chartTooltip-measure-value .sapMObjectNumberText").first().text(), "80.1", "Measure value should be correct");
        done();
    });

    result.vizFrame.attachEventOnce('renderComplete', function() {
        //result.vizFrame._vizFrame.__internal_reference_VizFrame__._dom's width will change after execute the folloing sentence
        //assert.ok(true, 'Bar chart is renderComplete.'); fail in vote. need to do 
        var elem = jQuery(".v-datapoint")[0];
        var bound  = elem.getBoundingClientRect();
        mouseEvent.simulateMouseMove(elem, bound.left, bound.top);
    });
});

// 2017.08.07
QUnit.module('Check Time Line Chart Tooltip', {
    beforeEach: function(){
        result = vizFrameData.createTimeLineChart("tooltip");
    },
    afterEach: function(){
        result.vizFrame.destroy();
        result.chartTooltip.destroy();
    }
});

QUnit.test("Check Dimension Value" , function(assert) {
    assert.expect(5);
    var done = assert.async();

    var resPop = result.chartTooltip._oPopup;
    var sid = result.chartTooltip._oTooltipContainer.sId;
    var f = function() {
        assert.ok(true, "show tooltip");
        assert.equal(jQuery("#"+sid+" .viz-controls-chartTooltip-label").first().text(), "Date", "Dimension label should be correct");
        var lang = (navigator.systemLanguage?navigator.systemLanguage:navigator.language);
        
        var reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9]) {1}/;
        var pattern=new RegExp(reg);
        var dimensionValue = jQuery("#"+sid+" .viz-controls-chartTooltip-dimension-value").first().text();
        var test = pattern.test(dimensionValue);

        assert.ok(test, "Dimension value should be contain time");
        assert.equal(jQuery("#"+sid+" .viz-controls-chartTooltip-measure-value .sapMObjectNumberText").first().text(), "669.097", "Measure value should be correct");
        resPop.detachClosed(f);
        done();
    };
    resPop.attachOpened(f);

    result.vizFrame.attachEventOnce('renderComplete', function() {
        assert.ok(true, 'Time Line chart is renderComplete.');
        var elem = jQuery(".v-datapoint")[0];
        var bound  = elem.getBoundingClientRect();
        mouseEvent.simulateMouseMove(elem, bound.left, bound.top);
    });
});

QUnit.start();

});