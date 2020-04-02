/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/data/FlattenedDataset",
	"test-resources/sap/viz/qunit/controls/CommonUtil"
], function(JSONModel, FeedItem, VizFrame, FlattenedDataset, CommonUtil) {

QUnit.module("donut Chart Types");

var oModel = new JSONModel({
    businessData1 : [{
        "Date": 1388505600000,
        "Country": "China",
        "Value": 131.7715651821345,
        "Value2": 12
    }, {
        "Date": 1388505600000,
        "Country": "Japan",
        "Value": 732.2505286429077,
        "Value2": 123
    }, {
        "Date": 1388505600000,
        "Country": "France",
        "Value": 301.2606957927346,
        "Value2": 12
    }, {
        "Date": 1388505600000,
        "Country": "UK",
        "Value": 815.9925150685012,
        "Value2": 456
    }, {
        "Date": 1391097600000,
        "Country": "China",
        "Value": 184.3122337013483,
        "Value2": 12
    }, {
        "Date": 1391097600000,
        "Country": "Japan",
        "Value": 350.25157197378576,
        "Value2": 123
    }, {
        "Date": 1391097600000,
        "Country": "France",
        "Value": 62.60869628749788,
        "Value2": 123
    }, {
        "Date": 1391097600000,
        "Country": "UK",
        "Value": 897.1779812127352,
        "Value2": 123
    }]
});

QUnit.test("donut  Chart", function(assert) {
    var done = assert.async();

      var oDataset = new FlattenedDataset({
        dimensions: [ {
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
        viztype:"donut"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "size",
            'type': "Measure",
            'values': ["Value"]
        }),
     
        feedColor = new FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        assert.ok(plot != null, "donut Plot exists.");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });   
}); 

  QUnit.start();

});