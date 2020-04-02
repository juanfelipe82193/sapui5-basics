/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/Bar", 
	"sap/viz/ui5/Bubble",
	"sap/viz/ui5/Column",
	"sap/viz/ui5/Combination", 
	"sap/viz/ui5/Donut",
	"sap/viz/ui5/DualBar",
	"sap/viz/ui5/DualColumn",
	"sap/viz/ui5/DualLine",
	"sap/viz/ui5/DualStackedColumn",
	"sap/viz/ui5/DualStackedColumn100",
	"sap/viz/ui5/Line",
	"sap/viz/ui5/Pie",
	"sap/viz/ui5/Scatter",
	"sap/viz/ui5/StackedColumn",
	"sap/viz/ui5/StackedColumn100",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel"
], function(Bar, Bubble, Column, Combination, Donut, DualBar, DualColumn, DualLine, DualStackedColumn, DualStackedColumn100, Line, Pie, Scatter, StackedColumn, StackedColumn100, FlattenedDataset, JSONModel) {

QUnit.module("init with properties");

QUnit.test('Check General Layout Properties', function(assert) {
  var done = assert.async();
  var oChart = createChart(Bar, {
    general: {
      layout: {
        padding : 1
      }
    },
    dataset : getDataset('a1a2m1')
  });
  oChart.placeAt("content");  
  var vizOptions = oChart._getOptions();
  var orignOptions = {
      general: {
        layout: {
          padding : 1
        }
      }  
  };
  assert.deepEqual(vizOptions.general, orignOptions.general, true, "Layout properties should be the same.");
  
  oChart.attachInitialized(function(){         
      oChart.getGeneral().getLayout().setPadding(5);
      assert.equal(oChart.getGeneral().getLayout().getPadding(), 5, "oChart.getGeneral().getLayout().setPadding(5), the padding should be 5.");
      cleanChart(oChart);
      done(); 
  });
});

QUnit.test('Check Legend Properties', function(assert) {
    var done = assert.async();
    var oChart = createChart( Bar, {
      legend : {
        title : {
          visible : true,
          text : "Revenue"
        }
      },
      plotArea : {
        colorPalette : [ "red", "blue", "yellow" ]
      },
      dataset : getDataset('a1a2m1')
    });
    oChart.placeAt("content");  
    var vizOptions = oChart._getOptions();
    
    var orignOptions = {
        legend: {
          title : {
            visible : true,
            text : "Revenue"
          }
        }    
    };
    var orignOptions_plotarea = {
      plotArea : {
        colorPalette : [ "red", "blue", "yellow" ]
      }
    };
    oChart.attachInitialized(function(){
        assert.deepEqual(vizOptions.legend, orignOptions.legend, true, "Legend properties should be the same.");
        cleanChart(oChart);
        done();
    });
});

QUnit.module("Init with properties for charts");

QUnit.test('Check Properties: Pie(plotArea.tooltip/plotArea.drawingEffect)',function(assert){
    var done = assert.async();
    var oChart = createChart( Pie, {
      plotArea : {
        toolTip : {
          visible : true,
          valueFormat : "0.00",
          percentageFormat:"0.00%",
          formatString: [".0"]
        },
        drawingEffect : "glossy"
      },
      dataset : getDataset('a1m1')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();

    var options_pie_plotArea_tooltip = {
      visible : false,
      valueFormat : "0.00",
      percentageFormat:"0.00%",
      formatString: [".0"]
    };
    
    oChart.attachInitialized(function(){
        assert.equal(oChart.getPlotArea().getToolTip().getVisible(), true, "Set Visible.");
        assert.deepEqual(oChart.getPlotArea().getToolTip().getFormatString(), options_pie_plotArea_tooltip.formatString, "Set FormatString.");
        assert.equal(oChart.getPlotArea().getDrawingEffect(), "glossy", "Set drawing effect.");
        cleanChart(oChart); 
        done();
    });
});

QUnit.test('Check Properties: Donut(title/legend/plotArea/tooltip)', function(assert) {
    var done = assert.async();
    var oChart = createChart( Donut, {
      title : {
        visible : true,
        text : "This is customer defined title",
        alignment : "left",
      },
      plotArea : {
        colorPalette : [ "blue", "green", "yellow" ],
        drawingEffect : sap.viz.ui5.types.Pie_drawingEffect.glossy
      },
      dataset : getDataset('a1m1')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
      
    var options_donut_plotArea = {
      colorPalette : [ "blue", "green", "yellow" ],
      drawingEffect : 'glossy',
      animation : {
        dataLoading : false,
        dataUpdating : false,
        resizing : false
      }
    };
    var options_donut_title = {
      visible : true,
      text : "This is customer defined title",
      alignment : "left",
    };
    assert.deepEqual(vizOptions.plotArea, options_donut_plotArea, "Init plotArea: oChart._getOptions().plotArea");
    assert.deepEqual(vizOptions.title, options_donut_title, "Init title: oChart._getOptions().title");
    oChart.attachInitialized(function(){
        assert.equal(oChart.getTitle().getVisible(), true, "Init title: oChart.getTitle().getVisible()");
        assert.equal(oChart.getLegend().getVisible(), true, "Default legend: oChart.getLegend().getVisible()");
        assert.equal(oChart.getPlotArea().getToolTip().getVisible(), true, "Default tooltip: oChart.getTooltip().getVisible()");
        assert.equal(oChart.getPlotArea().getToolTip().getFormatString(), null, "Default tooltip: oChart.getTooltip().getFormatString()");
        cleanChart(oChart); 
        done();
    });
});     

QUnit.test('Check Properties: Donut(invalid tooltip)', function(assert) {     
    var oChart = createChart( Donut, {
      tooltip : {},
      dataset : getDataset('a1m1')
    });
    oChart.placeAt("content");
    assert.equal(oChart._getOptions().tooltip, null, "Tooltip: oChart._getOptions().tooltip");
    cleanChart(oChart);  
});

QUnit.test('Check Properties: Pie(datalabel.formatString)',function(assert){
    var datalabelOps = {
      visible: true
    };
    var oChart = createChart( Pie, {
      dataLabel : datalabelOps,
      dataset : getDataset('a1m1')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();

    assert.deepEqual(vizOptions.dataLabel, datalabelOps,"Set FormatString.");
    cleanChart(oChart);
});

QUnit.test('Check Properties: Combination(plotArea.bar/plotArea.line)', function(assert){
    var done = assert.async();
    var oChart = createChart( Combination, {
      plotArea : {
        bar : {
          isRoundCorner : true
        },
        line : {
          width : 5,
          marker : {
            visible : true,
            shape : 'circle',
            size : 5
          }
        }
      },
      dataset : getDataset('a1a2m1m1')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_combination = {
      bar : {
        isRoundCorner : true
      },
      line : {
        width : 5,
        marker : {
          size : 5
        }
      }
    };
    assert.deepEqual(vizOptions.plotArea.bar, options_combination.bar, "Init plotArea.bar");
    assert.deepEqual(vizOptions.plotArea.line, options_combination.line, "Init plotArea.line");
    oChart.attachInitialized(function(){
        assert.equal(oChart.getPlotArea().getLine().getWidth(), 5, "Init plotArea.line: oChart.getPlotArea().getLine().getWidth()");
        assert.equal(oChart.getPlotArea().getLine().getMarker().getSize(), 5, "Init plotArea.line: oChart.getPlotArea().getLine().getWidth()");
        cleanChart(oChart); 
        done();
    });
    
});

QUnit.test('Check Properties: Column(width/height)', function(assert) {
    var done = assert.async();
    var oChart = createChart( Column, {
      plotArea : {
        colorPalette : [ "red", "blue", "yellow" ],
        drawingEffect : sap.viz.ui5.types.VerticalBar_drawingEffect.glossy,
        isRoundCorner : true
      },
      width : '300px',
      height : '300px',
      dataset : getDataset('a1a2m1')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_column = {
      colorPalette : [ "red", "blue", "yellow" ],
      drawingEffect : 'glossy',
      animation : {
        dataLoading : false,
        dataUpdating : false,
        resizing : false
      },
      isRoundCorner : true
    };
    assert.deepEqual(vizOptions.plotArea.colorPalette, options_column.colorPalette, "Check column plotarea properties -- colorPalette.");
    assert.equal(vizOptions.plotArea.drawingEffect, options_column.drawingEffect, "Check column plotarea properties -- drawingEffect.");
    assert.deepEqual(vizOptions.plotArea.animation, options_column.animation, "Check column plotarea properties -- animation.");
    assert.equal(vizOptions.plotArea.isRoundCorner, options_column.isRoundCorner, "Check column plotarea properties -- isRoundCorner.");
    oChart.attachInitialized(function(){
        assert.equal(oChart.getWidth(), '300px', "Init width: oChart.getWidth()");
        assert.equal(oChart.getHeight(), '300px', "Init height: oChart.getHeight()");
        cleanChart(oChart);
        done(); 
    });
    
});

QUnit.test('Check Properties: Line (xAxis/yAxis)', function(assert) {
    var oChart = createChart( Line, {
      xAxis : {
        lineSize : 5,
        title : {
          text : "customer defined title",
          visible : true
        },
        color : "red",
        visible : true
      },
      yAxis : {
        lineSize : 5,
        title : {
          text : "customer defined title",
          visible : true
        },
        color : "blue",
        visible : true
      },
      dataset : getDataset('a1a2m1')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_line = {
      yAxis : {
        lineSize : 5,
        color : "blue",
        title : {
          visible : true,
          text : "customer defined title"
        }
      },
      xAxis : {
        lineSize : 5,
        color : "red",
        title : {
          visible : true,
          text : "customer defined title"
        }
      }
    };

    assert.deepEqual(vizOptions.yAxis, options_line.yAxis, "Check line properties." + stringfyJSONCompareMessage(vizOptions.yAxis, options_line.yAxis));
    assert.deepEqual(vizOptions.xAxis, options_line.xAxis, "Check line properties." + stringfyJSONCompareMessage(vizOptions.xAxis, options_line.xAxis));
    cleanChart(oChart);
});

QUnit.test( 'Check Properties: Bar(legend)',  function(assert) {
    var oChart = createChart( Bar, {
      legend : {
        visible : true,
        title : {
          visible : true,
          text : "customer defined legend title"
        }
      },
      dataset : getDataset('a1a2m1')
    });
    oChart.placeAt("content");
    vizOptions = oChart._getOptions();
    var options_bar_legend = {
      //visible: true,
      title : {
        visible : true,
        text : "customer defined legend title"
      }
    };
    assert.deepEqual(vizOptions.legend, options_bar_legend, "Check bar legend properties.(Will remove the properties which same to default value)");
    cleanChart(oChart);
});

QUnit.test('Check Properties: Bubble (shapePalette)', function(assert) {      
    var oChart = createChart( Bubble, {
      plotArea : {
        colorPalette : [ "red", "blue", "yellow" ],
        shapePalette : [ 'triangle-up', 'triangle-down', 'triangle-left',
            'triangle-right', 'cross' ],
        drawingEffect : sap.viz.ui5.types.Bubble_drawingEffect.normal,
      },
      dataset : getDataset('a1m1m2m3m4')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_bubble = {
      colorPalette : [ "red", "blue", "yellow" ],
      shapePalette : [ 'triangle-up', 'triangle-down', 'triangle-left',
          'triangle-right', 'cross' ],
      //drawingEffect : 'normal',
      animation : {
        dataLoading : false,
        dataUpdating : false,
        resizing : false
      }
    };
    assert.deepEqual(vizOptions.plotArea, options_bubble, "Check bubble plotarea properties.");
    cleanChart(oChart);
});

QUnit.test('Check Properties: Scatter (shapePalette)', function(assert) {      
   var oChart = createChart( Scatter, {
      plotArea : {
        colorPalette : [ "red", "blue", "yellow" ],
        shapePalette : [ 'circle', 'triangle-down', 'cross', 'triangle-right',
            'intersection' ],
        drawingEffect : sap.viz.ui5.types.Scatter_drawingEffect.normal,
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        },
      },
      dataset : getDataset('a1m1m2')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_scatter = {
      colorPalette : [ "red", "blue", "yellow" ],
      shapePalette : [ 'circle', 'triangle-down', 'cross', 'triangle-right',
          'intersection' ],
      //drawingEffect : 'normal',
      animation : {
        dataLoading : false,
        dataUpdating : false,
        resizing : false
      }
    };
    assert.deepEqual(vizOptions.plotArea, options_scatter, "Check scatter plotarea properties.");
    cleanChart(oChart);
});

QUnit.test( 'Check Properties: Stacked Column (legendGroup)', function(assert) {
    var oChart = createChart( StackedColumn, {
      legendGroup : {
        layout : {
          position : "left"
        }
      },
      dataset : getDataset('a1a2m1')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
   
    var options_stackedcolumn_legendContainer = {
      layout : {
        position : "left"
      }
    };
        //console.log(JSON.stringify(vizOptions.legendContainer));
        //console.log(JSON.stringify(options_stackedcolumn_legendContainer));
        //equal(simpleObjectEquals(vizOptions.legendContainer,options_stackedcolumn_legendContainer),true,"Check stacked column legendContainer properties.");
   assert.deepEqual(vizOptions.legendGroup, options_stackedcolumn_legendContainer, "Check stacked column legendContainer properties.");
   cleanChart(oChart);
});

QUnit.test( 'Check Properties: Percentage Stacked Column', function(assert) {
    var oChart = createChart( StackedColumn100, {
       plotArea : {
         colorPalette : [ "red", "blue", "yellow" ],
         drawingEffect : sap.viz.ui5.types.StackedVerticalBar_drawingEffect.glossy,
         isRoundCorner : true
       },
       dataset : getDataset('a1a2m1')
     });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_stackedcolumn_100 = {
      colorPalette : [ "red", "blue", "yellow" ],
      drawingEffect : 'glossy',
      animation : {
        dataLoading : false,
        dataUpdating : false,
        resizing : false
      },
      isRoundCorner : true
    };
    assert.deepEqual(vizOptions.plotArea.colorPalette, options_stackedcolumn_100.colorPalette, "Check percentage stacked column plotarea properties -- colorPalette.");
    assert.equal(vizOptions.plotArea.drawingEffect, options_stackedcolumn_100.drawingEffect, "Check percentage stacked column plotarea properties -- drawingEffect.");
    assert.deepEqual(vizOptions.plotArea.animation, options_stackedcolumn_100.animation, "Check percentage stacked column plotarea properties -- animation.");
    assert.equal(vizOptions.plotArea.isRoundCorner, options_stackedcolumn_100.isRoundCorner, "Check percentage stacked column plotarea properties -- isRoundCorner.");
    cleanChart(oChart);
});

QUnit.test( 'Check Properties: Dual Bar (interaction/dataLabel)', function(assert) {
    var oChart = createChart( DualBar, {
       interaction : {
         selectability : {
           mode : sap.viz.ui5.types.controller.Interaction_selectability_mode.single
         }
       },
       dataLabel : {
         visible : true,
         position : sap.viz.ui5.types.Datalabel_position.outside
       },
       dataset : getDataset('a1a2m1m2')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_dualbar = {
      interaction : {
        selectability : {
          mode : 'single'
        }
      },
      dataLabel : {
        visible : true,
        position : 'outside'
      }
    };
    assert.deepEqual(vizOptions.interaction.selectability, options_dualbar.interaction.selectability, "Check dual bar properties (interaction).");
    assert.deepEqual(vizOptions.dataLabel, options_dualbar.dataLabel, "Check dual bar properties (dataLabel).");
    cleanChart(oChart);
});

QUnit.test('Check Properties: Dual Column', function(assert) {
    var oChart = createChart( DualColumn, {
      dataLabel : {
      },
      dataset : getDataset('a1a2m1m2')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_dualbar = {
      dataLabel : {
        
      }
    };
    assert.deepEqual(vizOptions.dataLabel, options_dualbar.dataLabel,  "Check dual column properties.");
    cleanChart(oChart);
});

QUnit.test( 'Check Properties: Dual Combination(plotArea.animation)', function(assert) {
    var oChart = createChart( sap.viz.ui5.DualCombination, {
      interaction : {
        selectability : {
          mode : sap.viz.ui5.types.controller.Interaction_selectability_mode.single
        }
      },
      dataLabel : {
        visible : true,
        position : sap.viz.ui5.types.Datalabel_position.outside
      },
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        },
        primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
        secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
        drawingEffect : sap.viz.ui5.types.Bar_drawingEffect.glossy,
        bar : {
          isRoundCorner : true
        },
        line : {
          width : 5,
          marker : {
            visible : true,
            shape : 'circle',
            size : 5
          }
        }
      },
      dataset : getDataset('a1a2m1m2')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_dualbar = {
      interaction : {
        selectability : {
          mode : 'single'
        }
      },
      dataLabel : {
        visible : true,
        position : 'outside',
        formatString : [ [ null ] ]
      },
      plotArea : {
        animation : {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        },
        colorPalette : [ "#748CB2", "#9CC677", "#EACF5E", "#F9AD79",
            "#D16A7C", "#8873A2", "#3A95B3", "#B6D949", "#FDD36C",
            "#F47958", "#A65084", "#0063B1", "#0DA841", "#FCB71D",
            "#F05620", "#B22D6E", "#3C368E", "#8FB2CF", "#95D4AB",
            "#EAE98F", "#F9BE92", "#EC9A99", "#BC98BD", "#1EB7B2",
            "#73C03C", "#F48323", "#EB271B", "#D9B5CA", "#AED1DA",
            "#DFECB2", "#FCDAB0", "#F5BCB4" ],
        primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
        secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
        drawingEffect : 'glossy',
        bar : {
          isRoundCorner : true
        },
        line : {
          width : 5,
          marker : {
            size : 5
          }
        }
      }
    };
    assert.deepEqual(vizOptions.animtaion, options_dualbar.animation, "Check dual combination animation properties.");
    cleanChart(oChart);
});

QUnit.test( 'Check Properties: Dual Line', function(assert) {
    var oChart = createChart( DualLine, {
      interaction : {
        selectability : {
          mode : sap.viz.ui5.types.controller.Interaction_selectability_mode.single
        }
      },
      dataLabel : {
        visible : true,
        position : sap.viz.ui5.types.Datalabel_position.outside
      },
      plotArea : {
        primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
        secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
        drawingEffect : sap.viz.ui5.types.Bar_drawingEffect.glossy,
        width : 5,
        hoverline : {
          visible : false
        },
        marker : {
          visible : true,
          shape : sap.viz.ui5.types.Line_marker_shape.diamond,
          size : 5
        }
      },
      dataset : getDataset('a1a2m1m2')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_dualline = {
      interaction : {
        selectability : {
          mode : 'single'
        }
      },
      dataLabel : {
        visible : true,
        position : 'outside'
      },
      plotArea : {
        primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
        secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
        drawingEffect : 'glossy',
        width : 5,
        hoverline : {
          visible : false
        },
        marker : {
          
          shape : 'diamond',
          size : 5
        },
        animation: {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      }
    };
    assert.deepEqual(vizOptions.interaction.selectability, options_dualline.interaction.selectability,"Check dual line properties. -- interaction.selectability");
    assert.deepEqual(vizOptions.dataLabel, options_dualline.dataLabel,"Check dual line properties. -- dataLabel");
    assert.deepEqual(vizOptions.plotArea, options_dualline.plotArea,"Check dual line properties. -- plotArea");
    cleanChart(oChart);
});

QUnit.test('Check Properties: Dual Stacked Column',function(assert) {
    var oChart = createChart( DualStackedColumn, {
       dataLabel : {
         visible : true,
         position : sap.viz.ui5.types.Datalabel_position.outside
       },
       plotArea : {
         primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
         secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
         drawingEffect : sap.viz.ui5.types.Bar_drawingEffect.glossy,
         isRoundCorner : true
       },
       dataset : getDataset('a1a2m1m2')
     });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_dualbar = {
      dataLabel : {
        visible : true,
        position : 'outside'
      },
      plotArea : {
        primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
        secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
        drawingEffect : 'glossy',
        isRoundCorner : true,
        animation: {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      }
    };
    assert.deepEqual(vizOptions, options_dualbar, "Check dual stacked column properties.");
    cleanChart(oChart);
});

QUnit.test( 'Check Properties: Dual Percentage Stacked Column', function(assert) {
    var oChart = createChart( DualStackedColumn100, {
      dataLabel : {
        visible : true,
        position : sap.viz.ui5.types.Datalabel_position.outside
      },
      plotArea : {
        primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
        secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
        drawingEffect : sap.viz.ui5.types.Bar_drawingEffect.glossy,
        isRoundCorner : true
      },
      dataset : getDataset('a1a2m1m2')
    });
    oChart.placeAt("content");
    var vizOptions = oChart._getOptions();
    var options_dualbar = {
      dataLabel : {
        visible : true,
        position : 'outside'
      },
      plotArea : {
        primaryValuesColorPalette : [ '#3D88C4', '#8FBADD', '#B8D4E9', '#7AAED6', '#A3C7E3' ],
        secondaryValuesColorPalette : [ '#EE4A40', '#F16C64', '#F8B1AD', '#F05B52', '#F37D76' ],
        drawingEffect : 'glossy',
        isRoundCorner : true,
        animation: {
          dataLoading : false,
          dataUpdating : false,
          resizing : false
        }
      }
    };
    assert.equal(simpleObjectEquals(vizOptions, options_dualbar), true, "Check dual percentage stacked column properties.");
    cleanChart(oChart);
});

QUnit.test('Check Properties: Pie (dataTransform)',function(assert){
    var oChart = createChart( Pie, { 
       dataTransform : {
         autoBinning: {
           enable: true,
           binNumber: 3
         }
      },
      dataset : getDataset('a1a1m1')
    });
    oChart.placeAt("content"); 
    var vizOptions = oChart._getOptions();
    var options_pie = {
     dataTransform : {
       autoBinning: {
         enable: true,
         binNumber: 3
      }
     }
    };
    assert.deepEqual(vizOptions.dataTransform, options_pie.dataTransform,"Check pie properties (dataTransform).");
    cleanChart(oChart);
});

QUnit.test('Check Properties: Scatter (dataTransform)',function(assert){
    var oChart = createChart( Scatter, { 
        dataTransform : {
           autoBinning: {
               enable: true,
               binNumber: 9
           }
      },
      dataset : getDataset('a1a1m1m2')
    });
    oChart.placeAt("content"); 
    var vizOptions = oChart._getOptions();
    var options_scatter = {
      dataTransform : {
         autoBinning: {
          enable: true,
          binNumber: 9
         }
     }
    };
    assert.deepEqual(vizOptions.dataTransform, options_scatter.dataTransform,"Check scatter properties (dataTransform).");
    cleanChart(oChart);
 });

QUnit.test("Check Properties: a1a1a2a2m1m2 Line with triangle marker: triangleUp/triangleDown/triangleLeft/triangleRight", function(assert) {
    var done = assert.async();
    var oDataset = new FlattenedDataset(a1a1a2a2m1m2Data);
    var oModel = new JSONModel(a1a1a2a2m1m2Model);
    oDataset.setModel(oModel);
    var oChart = createChart( sap.viz.ui5.Line, {
      dataset : oDataset,
      plotArea : {
        marker : {
          shape : "triangleUp",
          size : 5,
          visible : true
        }
      }
    });
    oChart.placeAt("content");
    oChart.attachInitialized(function(){
        assert.equal(oChart._getOptions().plotArea.marker.shape, "triangle-up", "The oChart._getOptions().plotArea.marker.shape: triangleUp should be converted into triangle-up");
        assert.equal(oChart.getPlotArea().getMarker().getShape(), "triangleUp", "Test oChart.getPlotArea().getMarker().getShape(): it should be triangleUp.");
        oChart.getPlotArea().getMarker().setShape("triangleDown");
        assert.equal(oChart._getOptions().plotArea.marker.shape, "triangle-down", "The oChart._getOptions().plotArea.marker.shape: triangleDown should be converted into triangle-down");
        assert.equal(oChart.getPlotArea().getMarker().getShape(), "triangleDown", "Test oChart.getPlotArea().getMarker().getShape(): it should be triangleDown.");
        oChart.getPlotArea().getMarker().setShape("triangleLeft");
        assert.equal(oChart._getOptions().plotArea.marker.shape, "triangle-left", "The oChart._getOptions().plotArea.marker.shape: triangleLeft should be converted into triangle-left");
        assert.equal(oChart.getPlotArea().getMarker().getShape(), "triangleLeft", "Test oChart.getPlotArea().getMarker().getShape(): it should be triangleLeft.");
        oChart.getPlotArea().getMarker().setShape("triangleRight");
        assert.equal(oChart._getOptions().plotArea.marker.shape, "triangle-right", "The oChart._getOptions().plotArea.marker.shape:triangleUp should be converted into triangle-right");
        assert.equal(oChart.getPlotArea().getMarker().getShape(), "triangleRight", "Test oChart.getPlotArea().getMarker().getShape(): it should be triangleRight.");
        cleanChart(oChart);
        done();
    });      
});

var oChart, vizOptions;
QUnit.module("Set properties via function", {
  beforeEach : function() {
    if(oChart === undefined){
      oChart = createChart( Bar, {
        dataset : getDataset('a1a2m1')
      });
      oChart.placeAt("content");
    }
  }
});

QUnit.test("Set Legend", function(assert) {
    oChart.getLegend().getTitle().setVisible(true).setText("New Revenue");
    //Get Options from bar chart
    vizOptions = oChart._getOptions();
  
    //Viz chart should receive the following options.
    var orignOptions = {
      legend : {
        title : {
          visible : true,
          text : "New Revenue"
        }
      }
    };
    assert.deepEqual(vizOptions.legend, orignOptions.legend, "Legend properties should be the same.");
});

QUnit.test("Set LegendContainer", function(assert) {
    oChart.getLegendGroup().getLayout().setPosition('left');

    //Get Options from bar chart
    vizOptions = oChart._getOptions();
    
    //Viz chart should receive the following options.
    var orignOptions = {
      legendGroup : {
        layout: {
          position: 'left'
        }
      }
    };
    assert.deepEqual(vizOptions.legendGroup, orignOptions.legendGroup, "Legend properties should be the same.");
});

QUnit.test("Set Axis", function(assert) {
    oChart.getXAxis().setAxisline(new sap.viz.ui5.types.Axis_axisline({
      'visible' : false
    })).setGridline(new sap.viz.ui5.types.Axis_gridline({
      "type" : sap.viz.ui5.types.Axis_gridline_type.dotted,
      "color" : "#ffffff",
      "size" : 5
    })).setLabel(new sap.viz.ui5.types.Axis_label({
      "visible" : false,
    })).setTitle(new sap.viz.ui5.types.Axis_title({
      "visible" : true,
      "text" : 'tile'
    })).setColor('yellow').setLineSize(5);
    vizOptions = oChart._getOptions();
    
    var valueAxis_option = {
      "lineSize" : 5,
      "color" : "yellow",
      "title" : {
        "visible" : true,
        "text" : 'tile'
      },
      "gridline" : {
        "type" : "dotted",
        "color" : "#ffffff",
        "size" : 5
      },
      "axisline" : {
        "visible" : false
      },
      "label" : {
        "visible" : false,
        
      }
    };
    assert.deepEqual(vizOptions.xAxis, valueAxis_option, "Axis properties should be the same.");
});

QUnit.test("Set Title", function(assert) {
    oChart.getTitle().setVisible(true).setText('title of the bar chart').setAlignment(sap.viz.ui5.types.Title_alignment.left);
    vizOptions = oChart._getOptions();

    var titleOption = {
      "visible" : true,
      "text" : "title of the bar chart",
      "alignment" : "left"
    };
    assert.deepEqual(vizOptions.title, titleOption, "Title properties should be the same.");
});

QUnit.test("Set background effect and direction", function(assert) {
    oChart.getBackground().setDirection(
        sap.viz.ui5.types.Background_direction.horizontal).setDrawingEffect(
        sap.viz.ui5.types.Background_drawingEffect.glossy);
    vizOptions = oChart._getOptions();
    
    var backgroundOption = {
      "drawingEffect" : "glossy",
      "direction" : "horizontal"
    };
    assert.deepEqual(vizOptions.background, backgroundOption, "Background properties should be the same.");
});

QUnit.test("Set background border ", function(assert) {      
    oChart.getBackground().setBorder(
      new sap.viz.ui5.types.Background_border({
        left : {
          visible : false
        },
        right : {
          visible : false
        },
        top : {
          visible : false
        },
        bottom : {
          visible : false
        }
      }));
    vizOptions = oChart._getOptions();
    
    var backgroundOption = {
      "border" : {
        "left" : {
          "visible" : false
        },
        "right" : {
          "visible" : false
        },
        "top" : {
          "visible" : false
        },
        "bottom" : {
          "visible" : false
        }
      }
    };
    assert.deepEqual(vizOptions.background.border, backgroundOption.border, "Background properties should be the same.");
});

QUnit.test("Set datalabel property", function(assert) {      
    oChart.getDataLabel().setVisible(true).setPosition(sap.viz.ui5.types.Datalabel_position.outside).setFormatString([ [ '0.00' ] ]);
    vizOptions = oChart._getOptions();
    
    var datalabelOption = {
      visible : true,
      position : 'outside',
      formatString : [ [ '0.00' ] ]
    };
    assert.deepEqual(vizOptions.dataLabel, datalabelOption, "Datalabel properties should be the same.");
});

QUnit.test('Set General Layout Properties', function(assert) {    
    oChart.getGeneral().getLayout().setPadding(1);
    vizOptions = oChart._getOptions();
  
    assert.equal(oChart.getGeneral().getLayout().getPadding(), 1, "oChart.getGeneral().getLayout().setPadding(1), the padding should be 1.");
    cleanChart(oChart);
});

QUnit.module("Test css");

QUnit.test("Check CSS style", function(assert) {
    var done = assert.async();
  //ok(true, "a1a2m1Model Bar chart.");
    var css = '.v-background-body{  fill: #ffdead; }';
    var oChart = createChart( Bar, {
      dataset : getDataset("a1a2m1"),
      css : css,
      selectData : function(oEvent) {
        console.log(oEvent.getParameter("data"));
      }
    });
    oChart.placeAt("content");
    oChart.attachInitialized(function(){
        assert.equal(oChart.getCss(), css, "Test css.");
        cleanChart(oChart);
        done();
    });
    
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