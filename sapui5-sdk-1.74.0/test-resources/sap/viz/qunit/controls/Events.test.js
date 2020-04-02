/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/Bar",
	"sap/viz/ui5/DualStackedColumn100",
	"sap/viz/ui5/data/FlattenedDataset"
], function(Log, JSONModel, Bar, DualStackedColumn100, FlattenedDataset) {

var beforeCreateVizEventStatus = 0, initializedEventStatus = 0, expectedMsg, initialStatus = 0;

QUnit.module("Event test", {
  beforeEach : function() {
    beforeCreateVizEventStatus = 0;
    initializedEventStatus = 0;
    initialStatus = 0;
  }
});

QUnit.test("Check event is invoked: beforeCreateViz", function(assert) {
   assert.ok(true, "dual stacked bar chart: beforeCreateViz.");
   var done = assert.async();
   var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
   var oModel = new JSONModel(a1a2m1m2m3Model);
   oDataset.setModel(oModel);
   //eventMsg = "";
   var oChart = new DualStackedColumn100({
     plotArea : {
       animation : {
         dataLoading : false,
         dataUpdating : false,
         resizing : false
       }
     },
     dataset : oDataset,
     beforeCreateViz : function(oControlEvent) { 	   
       beforeCreateVizEventStatus = 1;
       Log.info("1. Event(beforeCreateViz) is invoked.");
       assert.ok(true, "1. Event(beforeCreateViz) is invoked.");
     },
     initialized : function(oControlEvent) {
       initializedEventStatus++;
       if ( initializedEventStatus == 1 ) {
         Log.info("1. Event(initialized) should be invoked.");
         assert.ok(beforeCreateVizEventStatus == 1, "1. Event(beforeCreateViz) should be invoked.");
         assert.ok(true, "1. Event(initialized) should be invoked.");
         cleanChart(oChart);
         done();
       }
     }
    });
    oChart.placeAt("content");
	//stop();
});

QUnit.test("Check init event have no exception.", function(assert) {
    var done = assert.async();
    assert.equal(true, true, "Test all kinds of events.");
    var errMsg;
    try {
      var oChart = new DualStackedColumn100({
        dataset : getDataset("a1a2m1m2"),
        beforeCreateViz : function(oControlEvent) {
          Log.info('2. Event(beforeCreateViz) is invoked)')
          assert.ok(true, "2. Event(beforeCreateViz) is invoked)");
        },
        initialized : function(oControlEvent) {
          Log.info('2. Event(initialized) is invoked)')
          assert.ok(true, "2. Event(initialized) is invoked)");
          cleanChart(oChart);
          done();
        },
        deselectData : function(oControlEvent) {
          assert.ok(true, "2. Event(deselectData) is invoked)");
        },
        selectData : function(oControlEvent) {
          assert.ok(true, "2. Event(selectData) is invoked)");
        },
        showTooltip : function(oControlEvent) {
          assert.ok(true, "2. Event(showTooltip) is invoked)");
        },
        hideTooltip : function(oControlEvent) {
          assert.ok(true, "2. Event(hideTooltip) is invoked)");
        }
      });
      oChart.placeAt("content");
    } catch (err) {
      errMsg = err.message;
    }
    assert.equal(errMsg, undefined, "There shouldn't throw error with events callback.");
});

QUnit.test("Check if default selection will call event 'selectData'", function(assert){
   var done = assert.async();
   assert.ok(true, "a1a2m1Model Bar chart.");
   var oData;
     var oDataset = getDataset("a1a2m1");
     oDataset.setDefaultSelection([ {
       Color : "Blue",
       Product : "Car",
       'Measure' : 'Revenue'
     } ]);
     var oChart = new Bar({
       plotArea : {
         animation : {
           dataLoading : false,
           dataUpdating : false,
           resizing : false
         }
       },
       dataset : oDataset,
       initialized : function(oControlEvent) {
         assert.ok(true, "3. Event(initialized) is invoked)");
         cleanChart(oChart);
         done();
       },
       selectData : function(oEvent) {
         oData = oEvent.getParameter("data");
         assert.ok(true, "3. Event(beforeCreateViz) should be invoked.");
       }
     });
     oChart.placeAt("content");
 });

var cleanChart = function(oChart) {
  if (oChart) {
    oChart.destroy();
  }
};

  QUnit.start();

});