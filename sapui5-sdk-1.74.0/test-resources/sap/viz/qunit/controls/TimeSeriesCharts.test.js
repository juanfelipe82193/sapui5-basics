/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel",
	"test-resources/sap/viz/qunit/controls/CommonUtil"
], function(FeedItem, VizFrame, FlattenedDataset, JSONModel, CommonUtil) {
    "use strict";

QUnit.module("Time Series Chart Types");

var oModel = new JSONModel({
    businessData1 : [{
        "Date": 1388505600000,
        "Country": "China",
        "Value": 131.7715651821345,
        "Value2": 12,
        "Time": "abc"
    }, {
        "Date": 1388505600000,
        "Country": "Japan",
        "Value": 732.2505286429077,
        "Value2": 123,
        "Time": 1388505600000
    }, {
        "Date": 1388505600000,
        "Country": "France",
        "Value": 301.2606957927346,
        "Value2": 12,
        "Time": 1388505600000
    }, {
        "Date": 1388505600000,
        "Country": "UK",
        "Value": 815.9925150685012,
        "Value2": 456,
        "Time": 1388505600000
    }, {
        "Date": 1391097600000,
        "Country": "China",
        "Value": 184.3122337013483,
        "Value2": 12,
        "Time": 1391097600000
    }, {
        "Date": 1391097600000,
        "Country": "Japan",
        "Value": 350.25157197378576,
        "Value2": 123,
        "Time": 1391097600000
    }, {
        "Date": 1391097600000,
        "Country": "France",
        "Value": 62.60869628749788,
        "Value2": 123,
        "Time": 1391097600000
    }, {
        "Date": 1391097600000,
        "Country": "UK",
        "Value": 897.1779812127352,
        "Value2": 123,
        "Time": 1391097600000
    }]
});

QUnit.test("Time Series Line Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_line"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Line Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Time Series Scatter Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_scatter"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Scatter Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Time Series Bubble Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType:'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },{
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_bubble"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedBubbleWidth = new FeedItem({
            'uid': "bubbleWidth",
            'type': "Measure",
            'values': ["Value2"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedBubbleWidth);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Bubble Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});
var oModel2 = new JSONModel({
    businessData1 : [{
        "Date": 1388505600000,
        "Country": "China",
        "Value": 131.7715651821345,
        "Value2": 12
    }, {
        "Date": 1398507600000,
        "Country": "Japan",
        "Value": 732.2505286429077,
        "Value2": 123
    }, {
        "Date": 1408505600000,
        "Country": "France",
        "Value": 301.2606957927346,
        "Value2": 12
    }, {
        "Date": 1418505800000,
        "Country": "UK",
        "Value": 815.9925150685012,
        "Value2": 456
    }, {
        "Date": 1421097600000,
        "Country": "China",
        "Value": 184.3122337013483,
        "Value2": 12
    }, {
        "Date": 1431097800000,
        "Country": "Japan",
        "Value": 350.25157197378576,
        "Value2": 123
    }, {
        "Date": 1441097900000,
        "Country": "France",
        "Value": 62.60869628749788,
        "Value2": 123
    }, {
        "Date": 1451097000000,
        "Country": "UK",
        "Value": 897.1779812127352,
        "Value2": 123
    }]
});
QUnit.test("Time Series Combination Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },
        {
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel2);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value", "Value2"]
        }),

        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': [{"measureNamesDimension": ["valueAxis"]}]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Time Series Combination Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Dual Time Series Combination Chart", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },
        {
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"dual_timeseries_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel2);

    var feedValueAxis = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedValueAxis2 = new FeedItem({
            'uid': "valueAxis2",
            'type': "Measure",
            'values': ["Value2"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': [{"measureNamesDimension": ["valueAxis"]}]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.addFeed(feedValueAxis2);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "Dual Time Series Combination Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Show error message of invalid data format", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Time',
            value: "{Time}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var feedValueAxis = new FeedItem({
        'uid': "valueAxis",
        'type': "Measure",
        'values': ["Value"]
    }),
    feedCategoryAxis = new FeedItem({
        'uid': "timeAxis",
        'type': "Dimension",
        'values': ["Time"]
    }),
    feedColor = new FeedItem({
        'uid': "color",
        'type': "Dimension",
        'values': ["Country"]
    });
    var oVizFrame = CommonUtil.createVizFrame({
        viztype:"timeseries_line"
    });
    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);
    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEvent("renderFail", function() {
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-message").text(), "[50061] - Some dates do not have the correct format",
            "Invalid data message is correct shown");
        setTimeout(function(){
            CommonUtil.destroyVizFrame(oVizFrame);
        }, 0);
        done();
    });
});

QUnit.start();

});