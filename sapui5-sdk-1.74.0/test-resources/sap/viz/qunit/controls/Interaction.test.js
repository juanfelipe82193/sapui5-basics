/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/Bar",
	"sap/viz/ui5/types/controller/Interaction",
], function(Bar, Interaction) {

QUnit.module('selection');

QUnit.test("Select One dimension", function(assert){
	  var done = assert.async();
      var oChart = createChart( Bar, {
        dataset : getDataset('a1a2m1')
      });
      oChart.placeAt("content");
      oChart.attachInitialized(function(){
          var selected = [{
      	    data : {
      	    'Color' : 'Red',
      	    'Revenue' : '*'
      	    }
      	  }];
      	  oChart.selection(selected);
      	  var actual = oChart.selection();
      	  var expected = [ {
            data : {
              Color : "Red",
              Product : "Car",
              'Revenue': 46
            }
          }, {
            data : {
              Color : "Red",
              Product : "Truck",
              'Revenue': 72
            } 
          }];
          assert.deepEqual(actual, expected, 'Selected Data as expected.');
          cleanChart(oChart);
          done();
      });	  
});

QUnit.test("Select One Measure", function(assert){
    var done = assert.async();
    var oChart = createChart( Bar, {
        dataset : getDataset('a1a2m1')
      });
    oChart.placeAt("content");
    oChart.attachInitialized(function(){
        var selected = [{
            data : {
            'Revenue' : '*'
            }
          }];
          oChart.selection(selected);
          var actual = oChart.selection();
          assert.deepEqual(actual.length, 4, 'Selected Data as expected.');
          cleanChart(oChart);
          done();
    });
    
});

var oChart, vizOptions;
QUnit.module("Interaction Properties.", {
  beforeEach : function(assert) {
    oChart = createChart( Bar, {
      interaction : {
        selectability : {
          mode : 'single'
        }
      },
      xAxis: {
        lineSize: 42,
        gridline: {
          size:42
        }
      },
      dataset : getDataset('a1a2m1')
    });
  },
  afterEach : function(assert) {
    cleanChart(oChart);
  }
});

QUnit.test("Check Interaction properties - single", function(assert) { 
  oChart = createChart( Bar, {
    interaction : {
      selectability : {
        mode : 'single'
      }
    },
    dataset : getDataset('a1a2m1')
  });
  //Get Options from bar chart
  vizOptions = oChart._getOptions();

  //Viz chart should receive the following options.
  var orignOptions = {
     interaction : {
       selectability : {
         mode : 'single'
       }
     }
  };
  assert.deepEqual(vizOptions.interaction, orignOptions.interaction, "Interaction properties should be the same.");
});

QUnit.test("Check size settings", function(assert) {
  assert.equal(oChart.getXAxis().getLineSize(), 42, "XAxis lineSize should match value set in constructor");
  assert.equal(oChart.getXAxis().getGridline().getSize(), 42, "XAxis gridline size should match value set in constructor");
  
  // set sizes as int via JS API
  oChart.getXAxis().setLineSize(21);
  oChart.getXAxis().getGridline().setSize(21);
  assert.equal(oChart.getXAxis().getLineSize(), 21, "XAxis lineSize should match value set via API");
  assert.equal(oChart.getXAxis().getGridline().getSize(), 21, "XAxis gridline size should match value set via API");

  // set sizes as string via JS API (old API)
  oChart.getXAxis().setLineSize("37");
  oChart.getXAxis().getGridline().setSize("37");
  assert.equal(oChart.getXAxis().getLineSize(), 37, "XAxis lineSize should match value set via API");
  assert.equal(oChart.getXAxis().getGridline().getSize(), 37, "XAxis gridline size should match value set via API");
  
  // set sizes as empty strings via JS API (old API)
  oChart.getXAxis().setLineSize("");
  oChart.getXAxis().getGridline().setSize("");
  assert.equal(oChart.getXAxis().getLineSize(), 1, "XAxis lineSize should match value set via API");
  assert.equal(oChart.getXAxis().getGridline().getSize(), 1, "XAxis gridline size should match value set via API");
  
  // set sizes as string via XMLView
  var xml = 
      '<mvc:View xmlns:viz="sap.viz.ui5" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.viz.ui5.types">'
    + '  <viz:Bar>'
    + '    <viz:xAxis>'
    + '      <Axis lineSize="29" >'
    + '        <gridline>'
    + '          <Axis_gridline size="29" />'
    + '        </gridline>'
    + '      </Axis>'
    + '    </viz:xAxis>'
    + '  </viz:Bar>'
    + '</mvc:View>';
  oChart = sap.ui.xmlview({viewContent:xml}).getContent()[0];
  assert.equal(oChart.getXAxis().getLineSize(), 29, "XAxis lineSize should match value set via API");
  assert.equal(oChart.getXAxis().getGridline().getSize(), 29, "XAxis gridline size should match value set via API");
});

QUnit.test("Set selection mode via controller.interaction_selectability - multiple (via JS API)", function(assert) {
  oChart.getInteraction().setSelectability(new sap.viz.ui5.types.controller.Interaction_selectability({
    // node: old type didn't support 'inclusive', therefore we have to test wit hone of the old values
    mode : sap.viz.ui5.types.controller.Interaction_selectability_mode.multiple
  }));
  
  //Get Options from bar chart
  vizOptions =  oChart.getInteraction().getSelectability().getMode();

  //Viz chart should receive the following options.
  var orignOptions = 'multiple';
  assert.deepEqual(vizOptions, orignOptions, "Interaction properties should be the same.");
});

QUnit.test("Set selection mode via controller.interaction_selectability - multiple (via XMLView)", function(assert) {
  // an XMLView that creates a Bar chart wit thhe old controller.Interaction type  
  var xml = 
    '<mvc:View xmlns:viz="sap.viz.ui5" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.viz.ui5.types.controller">'
    + '  <viz:Bar>'
    + '    <viz:interaction>'
    + '      <Interaction>'
    + '        <selectability>'
    + '          <Interaction_selectability mode="multiple" />'
    + '        </selectability>'
    + '      </Interaction>'
    + '    </viz:interaction>'
    + '  </viz:Bar>'
    + '</mvc:View>';

  var oChart = sap.ui.xmlview({viewContent:xml}).getContent()[0];
    //Get Options from bar chart
  var vizOptions =  oChart.getInteraction().getSelectability().getMode();
  
  //Viz chart should receive the following options.
  var orignOptions = 'multiple';
  assert.deepEqual(vizOptions, orignOptions, "Interaction properties should be the same.");
});

QUnit.test("Set selection mode via controller.intercation - single", function(assert) {
  oChart.setInteraction(new Interaction({
    selectability : {
      mode : sap.viz.ui5.types.controller.Interaction_selectability_mode.single  
    }
  }));
  //Get Options from bar chart
  vizOptions = oChart._getOptions();

  //Viz chart should receive the following options.
  var orignOptions = {
     interaction : {
       selectability : {
         mode : 'single'
       }
     }
  };
  assert.deepEqual(vizOptions.interaction, orignOptions.interaction, "Interaction properties should be the same.");
}); 

var cleanChart = function(oChart) {
  if (oChart) {
    oChart.destroy();
    oChart = undefined;
  }
};

var createChart = function(chartType, settings){
  if(settings === undefined) {
    settings = {};
  }
  if(settings.plotArea === undefined){
    settings.plotArea = {};
  }
  settings.plotArea.animation = {
    dataLoading : false,
    dataUpdating : false,
    resizing : false
  };
  return new chartType(settings);
};

  QUnit.start();
});