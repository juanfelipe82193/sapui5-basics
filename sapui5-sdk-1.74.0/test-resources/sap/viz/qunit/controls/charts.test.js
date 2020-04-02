/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/Area",
	"sap/viz/ui5/Area100",
	"sap/viz/ui5/Bar",
	"sap/viz/ui5/Bubble",
	"sap/viz/ui5/Bullet",
	"sap/viz/ui5/DualBar",
	"sap/viz/ui5/DualColumn",
	"sap/viz/ui5/DualCombination",
	"sap/viz/ui5/DualLine",
	"sap/viz/ui5/DualStackedColumn",
	"sap/viz/ui5/DualStackedColumn100",
	"sap/viz/ui5/Heatmap",
	"sap/viz/ui5/HorizontalArea",
	"sap/viz/ui5/HorizontalArea100",
	"sap/viz/ui5/Line",
	"sap/viz/ui5/TimeBubble",
	"sap/viz/ui5/Treemap",
	"test-resources/sap/viz/qunit/controls/CommonUtil"
], function(FlattenedDataset, JSONModel, Area, Area100, Bar, Bubble, Bullet, DualBar, DualColumn, DualCombination, DualLine, DualStackedColumn, DualStackedColumn100, Heatmap, HorizontalArea, HorizontalArea100, Line, TimeBubble, Treemap, CommonUtil) {

/* 		var sPath = jQuery.sap.getModulePath("sap.viz.resources.templates", "/");
		sap.viz.TemplateManager.loadPath = [sPath];
		jQuery.sap.log.info("VIZ: load path for templates set to " + sPath); */

QUnit.module("Bar charts");

QUnit.test("a1m1 Bar", function(assert){
  assert.ok(true, "a1m1 Bar chart.");
 // sap.viz.TemplateManager.apply('flashy', function(){
    var oDataset = new FlattenedDataset(a1m1Data);
    var oModel = new JSONModel(a1a2m1Model);
    oDataset.setModel(oModel);
    var oChart = new Bar({
      width : "600px",
      height : "100%",
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
 // });
});

QUnit.test("a1a1a2a2m1m2 Bar", function(assert){
  assert.ok(true, "a1a1a2a2m1m2 Bar chart.");        
    var oDataset = new FlattenedDataset(a1a1a2a2m1m2Data);
    var oModel = new JSONModel(a1a1a2a2m1m2Model);
    oDataset.setModel(oModel);
    var oChart = new Bar({
      dataset: oDataset,
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      }
    });
    oChart.placeAt("content"); 
    cleanChart(oChart);
});  

QUnit.module('line');
QUnit.test("a1a1a2a2m1m2 Line with triangle marker", function(assert){
  assert.ok(true, "a1a1a2a2m1m2 Line chart.");        
    var oDataset = new FlattenedDataset(a1a1a2a2m1m2Data);
    var oModel = new JSONModel(a1a1a2a2m1m2Model);
    oDataset.setModel(oModel);
    var oChart = new Line({
      dataset: oDataset,
      plotArea: {
        marker : {
          shape: "triangleUp",
          size: 5,
          visible: true
        },
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      }
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});  

  
QUnit.module("Bubble Charts");
QUnit.test("a1a2m1m2m3 Bubble", function(assert){
  assert.ok(true, "a1a2m1m2m3 Bubble Chart");
	      var oDataset = new FlattenedDataset(a1a2m1m2m3Data);
	      var oModel = new JSONModel(a1a2m1m2m3Model);
	      oDataset.setModel(oModel);
	      var oChart = new Bubble({
	        plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
	        dataset: oDataset
	      });
	      oChart.placeAt("content");
	      cleanChart(oChart);
});

QUnit.test("Time Bubble", function(assert){
  assert.ok(true, "Time Bubble Chart");
    var values = [ 
      { Country : "USA", Revenue : 100, Measure : 80 },
      { Country : "Canada", Revenue : 110, Measure : 50 },
      { Country : "South Africa", Revenue : 180, Measure : 20 },
      { Country : "France", Revenue : 210, Measure : 110 },
      { Country : "China", Revenue : 190, Measure : 150 },
      { Country : "India", Revenue : 90, Measure : 50 },
      { Country : "Janpan", Revenue : 120, Measure : 120 },
      { Country : "Spain", Revenue : 150, Measure : 200 }
    ];
    var startTime = new Date();
    startTime.setFullYear(2013);
    startTime.setMonth(0);
    startTime.setDate(1);
    startTime.setHours(22);
    startTime.setMinutes(51);
    startTime.setSeconds(10);

    var end = new Date();
    end.setFullYear(2013);
    end.setMonth(10);
    end.setDate(20);
    end.setHours(16);
    end.setMinutes(39);
    end.setSeconds(31);

    var range = end.getTime() - startTime.getTime();
    var timeArr = [];
    for (var i = 0; i < values.length; i++) {
      var t = parseInt(range * i * 0.1) + startTime.getTime();
      values[i]['Time'] = t;
    }

    var oModel = new JSONModel({
      data : values
    });   


    var oDataset = new FlattenedDataset({
      dimensions : [ 
         { axis : 1, name : "Country", value : "{Country}" }
      ],
      measures : [ 
         { group : 2, name : "Revenue", value : "{Revenue}" }, 
         { group : 3, name : "Measure", value : "{Measure}" }, 
         { group : 1, name : "Time", value : "{Time}"}
       ],
      data : {
        path : "/data"
      }
    });
    oDataset.setModel(oModel);
    oChart = new TimeBubble({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Dual Line Charts");
QUnit.test("a1a1a2a2m1m1m2 dual line", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Dual Line Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new DualLine({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Dual Bar Charts");
QUnit.test("a1a1a2a2m1m1m2 dual Bar", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Dual Bar Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new DualBar({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Dual Column Charts");
QUnit.test("a1a1a2a2m1m1m2 dual column", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Dual Column Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new DualColumn({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Dual Combination Charts");
QUnit.test("a1a1a2a2m1m1m2 dual combination", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Dual Combination Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new DualCombination({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Dual Stacked Column Charts");
QUnit.test("a1a1a2a2m1m1m2 dual stacked column chart", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Dual Stacked Column Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new DualStackedColumn({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Dual Stacked Bar Charts");
QUnit.test("a1a1a2a2m1m1m2 dual stacked bar chart", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Dual Stacked Bar Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new DualStackedColumn100({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Map Charts");
QUnit.test("a1m1Data heatmap chart", function(assert){
  assert.ok(true, "a1m1Data Heatmap Chart");
    var oDataset = new FlattenedDataset(a1m1Data);
    var oModel = new JSONModel(a1m1Model);
    oDataset.setModel(oModel);
    var oChart = new Heatmap({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.test("a1a1a2a2m1m1m2 treemap chart", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Treemap Chart");
    var oDataset = new FlattenedDataset(a1a2m1m2Data);
    var oModel = new JSONModel(a1a2m1m2Model);
    oDataset.setModel(oModel);
    var oChart = new Treemap({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Area Charts");
QUnit.test("a1a1a2a2m1m1m2 area chart", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Area Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new Area({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.test("a1a1a2a2m1m1m2 Horizontal Area chart", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Horizontal Area Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new HorizontalArea({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.test("a1a1a2a2m1m1m2 area chart", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Area Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new Area100({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.test("a1a1a2a2m1m1m2 Horizontal Area chart", function(assert){
  assert.ok(true, "a1a1a2a2m1m1m2 Horizontal Area Chart");
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    var oChart = new HorizontalArea100({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Bullet Charts");
QUnit.test("a1m1m2m1m2m3 Bullet Chart", function(assert){
  assert.ok(true, "a1m1m2m1m2m3 Bullet Chart");
    var oChart = new Bullet({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: getDataset('a1m1m2m3m3m3')
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});
/*     
QUnit.module("Waterfall Charts");
QUnit.test("a1m1Data waterfall chart", function(assert){
  var done = assert.async();
  assert.ok(true, "a1m1Data waterfall Chart");
  setTimeout(function(assert){
    cleanChart();
    var oDataset = new FlattenedDataset(a1m1Data);
    var oModel = new JSONModel(a1m1Model);
    oDataset.setModel(oModel);
    oChart = new Waterfall({
      dataset: oDataset
    });
    oChart.placeAt("content");
    done();
  }, timer);
});

QUnit.test("a1m1Data Horizontal Waterfall chart", function(assert){
  var done = assert.async();
  assert.ok(true, "a1m1Data Horizontal Waterfall Chart");
  setTimeout(function(assert){
    cleanChart();
    var oDataset = new FlattenedDataset(a1m1Data);
    var oModel = new JSONModel(a1m1Model);
    oDataset.setModel(oModel);
    oChart = new HorizontalWaterfall({
      dataset: oDataset
    });
    oChart.placeAt("content");
    done();
  }, timer);
});

QUnit.test("a1a1a2a2m1m1m2 stacked waterfall chart", function(assert){
  var done = assert.async();
  assert.ok(true, "a1a1a2a2m1m1m2 Stacked Waterfall Chart");
  setTimeout(function(assert){
    cleanChart();
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    oChart = new StackedWaterfall({
      dataset: oDataset
    });
    oChart.placeAt("content");
    done();
  }, timer);
});

QUnit.test("a1a1a2a2m1m1m2 Horizontal Stacked Waterfall chart", function(assert){
  var done = assert.async();
  assert.ok(true, "a1a1a2a2m1m1m2 Horizontal Stacked Waterfall Chart");
  setTimeout(function(assert){
    cleanChart();
    var oDataset = new FlattenedDataset(a1a2m1m1m2Data);
    var oModel = new JSONModel(a1a2m1m2m3Model);
    oDataset.setModel(oModel);
    oChart = new HorizontalStackedWaterfall({
      dataset: oDataset
    });
    oChart.placeAt("content");
    done();
  }, timer);
}); */

QUnit.module("CSS");
QUnit.test("Check CSS style", function(assert){
  assert.ok(true, "a1a2m1Model Bar chart.");
    var css = '.v-background-body{  fill: #ffdead; }';
    var oDataset = new FlattenedDataset(a1a2m1Data);
    var oModel = new JSONModel(a1a2m1Model);
    oDataset.setModel(oModel);
    var oChart = new Bar({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset : oDataset,
      css : css,
      selectData : function(oEvent){
        console.log( oEvent.getParameter("data"));
      }
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Language");
QUnit.test("check language", function(assert){
  assert.ok(true, "a1a2m1Model Bar chart.");
    var oDataset = new FlattenedDataset(a1a2m1Data);
    var oModel = new JSONModel(a1a2m1Model);
    oDataset.setModel(oModel);
    var oChart = new Bar({
      title : {
        visible : true,
      },
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset : oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});

QUnit.module("Selection");
QUnit.test("Select By chart's API", function(assert){
  var done = assert.async();
  assert.ok(true, "a1a2m1Model Bar chart.");        
    var oDataset = new FlattenedDataset(a1a2m1Data);
    var oModel = new JSONModel(a1a2m1Model);
    oDataset.setModel(oModel);
    var oChart = new Bar({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    oChart.attachInitialized(function(assert){
        oChart.setDefaultSelection([{
            Color:"Red", 
            Product:"Car",
            'Measure': 'Revenue'
          }]);
        cleanChart(oChart);
        done();
    }); 
});  

QUnit.test("Select By Dataset API", function(assert){
  assert.ok(true, "a1a2m1Model Bar chart.");        
    var oDataset = new FlattenedDataset(a1a2m1Data);
    var oModel = new JSONModel(a1a2m1Model);
    oDataset.setModel(oModel);
    oDataset.setDefaultSelection([{
      Color:"Red", 
      Product:"Car",
      'Measure': 'Revenue'
    }]);
    var oChart = new Bar({
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
      dataset: oDataset
    });
    oChart.placeAt("content");
    cleanChart(oChart);
});
  
		QUnit.test("Check selected data value", function(assert){
		   assert.ok(true, "a1a2m1Model Bar chart.");
		     var oDataset = new FlattenedDataset(a1a2m1Data);
		     var oModel = new JSONModel(a1a2m1Model);
		     oDataset.setModel(oModel);
		     oDataset.setDefaultSelection([{
		       Color:"Red", 
		       Product:"Car",
		       'Measure': 'Revenue'
		     }]);
		     var oChart = new Bar({
		       plotArea : {
	            animation : {
	              dataLoading : false,
	              dataUpdating : false,
	              resizing : false
	            }
	          },
		       dataset: oDataset,
		       selectData : function(oEvent){
		         // console.log( oEvent.getParameter("data"));
		       }
		     });
		     oChart.placeAt("content");
		     cleanChart(oChart);
		});  
  
		QUnit.module("Dataset");
		
		QUnit.test("Update dataset", function(assert) {
			  var oChart = new Bar({
			    plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
			    dataset : getDataset('a1m1')
			  });
			  oChart.placeAt("content");
			  oChart.setDataset(getDataset("a1m1m2"));
			  assert.equal(JSON.stringify(oChart.getDataset().getVIZDataset().data()), JSON.stringify(a1m1m2VizDataset), "Dataset should be updated.");
			  cleanChart(oChart);
		});
		
		QUnit.test("Destroy dataset", function(assert) {
			  var oChart = new Bar({
			    plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      },
			    dataset : getDataset('a1m1')
			  });
			  oChart.placeAt("content");
			  oChart.destroyDataset();
			  assert.equal(oChart.getDataset(), null, "Dataset should be destroyed.");
			  cleanChart(oChart);
		});
		
		QUnit.test("Update dataset after new chart with no dataset", function(assert) {
			  var oChart = new Bar({
			    plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      }
			  });
			  oChart.placeAt("content");
			  oChart.setDataset(getDataset("a1m1m2"));
			  assert.equal(JSON.stringify(oChart.getDataset().getVIZDataset().data()), JSON.stringify(a1m1m2VizDataset), "Dataset should be updated.");
			  cleanChart(oChart);
		});
/*
QUnit.module("Heatmap Charts.");
QUnit.test("a1a2m1 Heatmap", function(assert){
  var done = assert.async();
  assert.ok(true, "a1a2m1 Heatmap Chart");
  setTimeout(function(){
    cleanChart();
    var oDataset = new FlattenedDataset(a1a2m1Data);
    var oModel = new JSONModel(a1a2m1Model);
    oDataset.setModel(oModel);
    oChart = new Heatmap({
      dataset: oDataset
    });
    oChart.placeAt("content");
    done();
  }, timer)
});
*/

var cleanChart = function(oChart){
  if(oChart){
    oChart.destroy();        
  }
};

QUnit.start();

});