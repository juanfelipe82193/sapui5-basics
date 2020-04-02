var setDefaultDataset = function(oVizFrame){
  //A Dataset defines how the model data is mapped to the chart
  var oDataset = new sap.viz.ui5.data.FlattenedDataset({
    // a Bar Chart requires exactly one dimension (x-axis)
    'dimensions' : [{
      'name' : 'Country',
      'value' : "{Country}"
    }],
    // it can show multiple measures, each results in a new set of bars in a new color
    'measures' : [
    // measure 1
    {
      'name' : 'Profit', // 'name' is used as label in the Legend
      'value' : '{profit}' // 'value' defines the binding for the displayed value
    }],
    // 'data' is used to bind the whole data collection that is to be displayed in the chart
    'data' : {
      'path' : "/businessData"
    }
  });
  
  // oVizFrame.
  // attach the model to the chart and display it
  oVizFrame.setDataset(oDataset);
  oVizFrame.setModel(amModel);
  
 //set feeds
  var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
    'uid' : "primaryValues",
    'type' : "Measure",
    'values' : ["Profit"]
  }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
    'uid' : "axisLabels",
    'type' : "Dimension",
    'values' : [new sap.viz.ui5.controls.common.feeds.AnalysisObject({
      'uid' : "Country",
      'type' : "Dimension",
      'name' : "Country"
    })]
  });
  
  oVizFrame.addFeed(feedPrimaryValues);
  oVizFrame.addFeed(feedAxisLabels);
};

var setPieDataset = function(oVizFrame){
    //A Dataset defines how the model data is mapped to the chart
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
      // a Bar Chart requires exactly one dimension (x-axis)
      'dimensions' : [{
        'name' : 'Country',
        'value' : "{Country}"
      }],
      // it can show multiple measures, each results in a new set of bars in a new color
      'measures' : [
      // measure 1
      {
        'name' : 'Profit', // 'name' is used as label in the Legend
        'value' : '{profit}' // 'value' defines the binding for the displayed value
      }],
      // 'data' is used to bind the whole data collection that is to be displayed in the chart
      'data' : {
        'path' : "/businessData"
      }
    });
    
    // oVizFrame.
    // attach the model to the chart and display it
    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(amModel);
    
   //set feeds
    var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
      'uid' : "size",
      'type' : "Measure",
      'values' : ["Profit"]
    }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
      'uid' : "color",
      'type' : "Dimension",
      'values' : [ "Country"]
    });
    
    oVizFrame.addFeed(feedPrimaryValues);
    oVizFrame.addFeed(feedAxisLabels);
  };

  
var setBubbleDataset = function(oVizFrame){
  var oDataset = new sap.viz.ui5.data.FlattenedDataset({
    dimensions : [ {
      name : 'Sales_Quarter',
      value : "{Sales_Quarter}"
    }, {
      name : 'Customer Gender',
      value : "{Customer Gender}"
    }, {
      name : 'Sales_Month',
      value : "{Sales_Month}"
    }, {
      name : 'Marital Status',
      value : "{Marital Status}"
    } ],

    measures : [ {
      name : 'Cost',
      value : '{Cost}'
    }, {
      name : 'Unit Price',
      value : '{Unit Price}'
    }, {
      name : 'Gross Profit',
      value : '{Gross Profit}'
    }, {
      name : 'Sales Revenue',
      value : '{Sales Revenue}'
    } ],

    data : {
      path : "/businessData"
    }
  });
  oVizFrame.setDataset(oDataset)
  oVizFrame.setModel(aaaammmmModel);
  
  //set feeds
  var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "primaryValues",
    "type" : "Measure",
    "values" : [ "Cost" ]
  }), feedSecondaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "secondaryValues",
    "type" : "Measure",
    "values" : [ "Unit Price" ]
  }), feedBubbleWidth = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "bubbleWidth",
    "type" : "Measure",
    "values" : [ "Gross Profit" ]
  }), feedBubbleHeight = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "bubbleHeight",
    "type" : "Measure",
    "values" : [ "Sales Revenue" ]
  }), feedRegionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "regionColor",
    "type" : "Dimension",
    "values" : [ "Customer Gender", "Sales_Quarter" ]
  }), feedRegionShape = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "regionShape",
    "type" : "Dimension",
    "values" : [ "Sales_Month", "Marital Status" ]
  });

  oVizFrame.addFeed(feedPrimaryValues);
  oVizFrame.addFeed(feedSecondaryValues);
  oVizFrame.addFeed(feedBubbleWidth);
  oVizFrame.addFeed(feedBubbleHeight);
  oVizFrame.addFeed(feedRegionColor);
  oVizFrame.addFeed(feedRegionShape);
};

var setStackedDataset = function(oVizFrame){
  var oDataset = new sap.viz.ui5.data.FlattenedDataset({
    dimensions : [ {
      name : 'Sales_Month',
      value : "{Sales_Month}"
    }, {
      name : 'Sales_Quarter',
      value : "{Sales_Quarter}"
    } ],

    measures : [ {
      name : 'Cost',
      value : '{Cost}'
    }, {
      name : 'Sales Quantity',
      value : '{Sales Quantity}'
    }, {
      name : 'Sales Revenue',
      value : '{Sales Revenue}'
    } ],

    data : {
      path : "/businessData"
    }
  });
  oVizFrame.setDataset(oDataset)
  oVizFrame.setModel(aammmModel);

  // set feeds
  var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "primaryValues",
    "type" : "Measure",
    "values" : [ "Cost", "Sales Quantity", "Sales Revenue" ]
  }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "axisLabels",
    "type" : "Dimension",
    "values" : [ "Sales_Quarter" ]
  }), feedregionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "regionColor",
    "type" : "Dimension",
    "values" : [ "Sales_Month" ]
  });

  oVizFrame.addFeed(feedPrimaryValues);
  oVizFrame.addFeed(feedAxisLabels);
  oVizFrame.addFeed(feedregionColor);
};

var setBulletDataset = function(oVizFrame){
  var oDataset = new sap.viz.ui5.data.FlattenedDataset({
    // a Bar Chart requires exactly one dimension (x-axis)
    'dimensions' : [{
      'name' : 'Country',
      'value' : "{Country}"
    }],
    // it can show multiple measures, each results in a new set of bars in a new color
    'measures' : [
    // measure 1
    {
      'name' : 'profit', // 'name' is used as label in the Legend
      'value' : '{profit}' // 'value' defines the binding for the displayed value
    },{
      'name' : 'target',
      'value' : '{target}'
    }, {
      'name' : 'reference',
      'value' : '{reference}'
    }],
    // 'data' is used to bind the whole data collection that is to be displayed in the chart
    'data' : {
      'path' : "/businessData"
    }
  });
  
  // oVizFrame.
  // attach the model to the chart and display it
  oVizFrame.setDataset(oDataset);
  oVizFrame.setModel(ammModel);
  
 //set feeds
  var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
    'uid' : "primaryValues",
    'type' : "Measure",
    'values' : ["profit"]
  }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
    'uid' : "axisLabels",
    'type' : "Dimension",
    'values' : ["Country"]
  }),feedTargetValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
    'uid' : "targetValues",
    'type' :"Measure",
    'values' : ["target"]
  }), feedReferenceVaule = new sap.viz.ui5.controls.common.feeds.FeedItem({
    'uid' : 'forecastValues',
    'type' : 'Measure',
    'values' : ['reference']
  });
  
  oVizFrame.addFeed(feedPrimaryValues);
  oVizFrame.addFeed(feedAxisLabels);
  oVizFrame.addFeed(feedTargetValues);
  oVizFrame.addFeed(feedReferenceVaule);
};

var setDualDataset = function(oVizFrame){
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
      'dimensions' : [{
        'name' : 'Country',
        'value' : "{Country}"
      }],
      'measures' : [
      {
        'name' : 'profit',
        'value' : '{profit}'
      },{
        'name' : 'target',
        'value' : '{target}'
      }, {
        'name' : 'reference',
        'value' : '{reference}'
      }],
      // 'data' is used to bind the whole data collection that is to be displayed in the chart
      'data' : {
        'path' : "/businessData"
      }
    });
    
    // oVizFrame.
    // attach the model to the chart and display it
    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(ammModel);
    
   //set feeds
    var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
      'uid' : "primaryValues",
      'type' : "Measure",
      'values' : ["profit"]
    }), feedSecondaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : "secondaryValues",
        'type' : "Measure",
        'values' : ["target"]
    }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : "axisLabels",
        'type' : "Dimension",
        'values' : ["Country"]
    });
    
    oVizFrame.addFeed(feedPrimaryValues);
    oVizFrame.addFeed(feedSecondaryValues);
    oVizFrame.addFeed(feedAxisLabels);
  };

var setWaterfallDataset = function(oVizFrame){
  var oDataset = new sap.viz.ui5.data.FlattenedDataset({
    dimensions : [ {
      name : 'Cash',
      value : "{Cash}"
    }, {
      name : 'Type',
      value : "{Type}"
    } ],

    measures : [ {
      name : 'Revenue',
      value : '{Revenue}'
    }],

    data : {
      path : "/businessData"
    }
  });
  oVizFrame.setDataset(oDataset)
  oVizFrame.setModel(aamModelWaterfall);

  // set feeds
  var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "valueAxis",
    "type" : "Measure",
    "values" : [ "Revenue"]
  }), feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "categoryAxis",
    "type" : "Dimension",
    "values" : [ "Cash" ]
  }), feedWaterfallType = new sap.viz.ui5.controls.common.feeds.FeedItem({
    "uid" : "waterfallType",
    "type" : "Dimension",
    "values" : [ "Type" ]
  });

  oVizFrame.addFeed(feedValueAxis);
  oVizFrame.addFeed(feedCategoryAxis);
  oVizFrame.addFeed(feedWaterfallType);
};
var setTimeDataset = function (oVizFrame){
    var dataset = new sap.viz.ui5.data.FlattenedDataset(
    {
        "dimensions": [{
            "name": "Date",
            "value": "{Date}",
            "dataType": "date"
        },
        {
            "name": "Date",
            "value": "{Date}"
        }],
        "measures": [{
            "name": "Revenue",
            "value": "{Revenue}"
        },
        {
            "name": "Cost",
            "value": "{Cost}"
        }],
        "data": {
            "path": "/businessData"
        }
    });
    oVizFrame.setModel(timeModel);
    oVizFrame.setDataset(dataset);
    var feeds =[
        new sap.viz.ui5.controls.common.feeds.FeedItem({"uid":"timeAxis","type":"Dimension","values":["Date"]})
        ,
        new sap.viz.ui5.controls.common.feeds.FeedItem({"uid":"color","type":"Dimension","values":[]})
        ,
        new sap.viz.ui5.controls.common.feeds.FeedItem({"uid":"valueAxis","type":"Measure","values":["Revenue", "Cost"]})
        ]
    feeds.forEach(function(feedItem) {
        oVizFrame.addFeed(feedItem);
    });
};

var setDualTimeDataset = function(oVizFrame){
    var dataset = new sap.viz.ui5.data.FlattenedDataset(
            {
                "dimensions": [{
                    "name": "Date",
                    "value": "{Date}",
                    "dataType": "date"
                },
                {
                    "name": "Date",
                    "value": "{Date}"
                }],
                "measures": [{
                    "name": "Revenue",
                    "value": "{Revenue}"
                },
                {
                    "name": "Cost",
                    "value": "{Cost}"
                }],
                "data": {
                    "path": "/businessData"
                }
            });
            oVizFrame.setModel(timeModel);
            oVizFrame.setDataset(dataset);
            var feeds =[
                new sap.viz.ui5.controls.common.feeds.FeedItem({"uid":"timeAxis","type":"Dimension","values":["Date"]})
                ,
                new sap.viz.ui5.controls.common.feeds.FeedItem({"uid":"color","type":"Dimension","values":[]})
                ,
                new sap.viz.ui5.controls.common.feeds.FeedItem({"uid":"valueAxis","type":"Measure","values":["Revenue"]}),
                new sap.viz.ui5.controls.common.feeds.FeedItem({"uid":"valueAxis2","type":"Measure","values":["Cost"]})
                ]
            feeds.forEach(function(feedItem) {
                oVizFrame.addFeed(feedItem);
            });  
};
var timeModel = new sap.ui.model.json.JSONModel(
        {
            "businessData": [{
                "Revenue": 163.62221771851182,
                "Cost": 356.27565113827586,
                "Date": 1420070400000
            },
            {
                "Revenue": 283.9446363504976,
                "Cost": 24.706132942810655,
                "Date": 1420156800000
            },
            {
                "Revenue": 456.4784395042807,
                "Cost": 182.28097446262836,
                "Date": 1420243200000
            },
            {
                "Revenue": 773.3653974719346,
                "Cost": 287.08286583423615,
                "Date": 1420329600000
            },
            {
                "Revenue": 607.0065011736006,
                "Cost": 454.6978313010186,
                "Date": 1420416000000
            },
            {
                "Revenue": 85.13362286612391,
                "Cost": 87.68369094468653,
                "Date": 1420502400000
            },
            {
                "Revenue": 67.93552567251027,
                "Cost": 999.7971644625068,
                "Date": 1420588800000
            },
            {
                "Revenue": 214.01331154629588,
                "Cost": 48.32593537867069,
                "Date": 1420675200000
            },
            {
                "Revenue": 316.755817970261,
                "Cost": 736.2604313530028,
                "Date": 1420761600000
            },
            {
                "Revenue": 151.43703133799136,
                "Cost": 669.0219826996326,
                "Date": 1420848000000
            },
            {
                "Revenue": 716.836936539039,
                "Cost": 956.9466814864427,
                "Date": 1420934400000
            },
            {
                "Revenue": 626.1762212961912,
                "Cost": 206.4744143281132,
                "Date": 1421020800000
            },
            {
                "Revenue": 107.0285418536514,
                "Cost": 845.195044297725,
                "Date": 1421107200000
            },
            {
                "Revenue": 499.7934999410063,
                "Cost": 152.73416810669005,
                "Date": 1421193600000
            },
            {
                "Revenue": 57.60230962187052,
                "Cost": 570.4043454024941,
                "Date": 1421280000000
            },
            {
                "Revenue": 525.9184762835503,
                "Cost": 303.83889679796994,
                "Date": 1421366400000
            },
            {
                "Revenue": 719.4294282235205,
                "Cost": 694.9723837897182,
                "Date": 1421452800000
            },
            {
                "Revenue": 729.634536197409,
                "Cost": 683.2135878503323,
                "Date": 1421539200000
            },
            {
                "Revenue": 596.1992372758687,
                "Cost": 609.6282491926104,
                "Date": 1421625600000
            },
            {
                "Revenue": 722.1290648449212,
                "Cost": 371.45711528137326,
                "Date": 1421712000000
            },
            {
                "Revenue": 6.038181250914931,
                "Cost": 876.1695323046297,
                "Date": 1421798400000
            },

            {
                "Revenue": 804.4082142878324,
                "Cost": 981.5277359448373,
                "Date": 1423267200000
            },
            {
                "Revenue": 827.7007252909243,
                "Cost": 79.20015580020845,
                "Date": 1423353600000
            },
            {
                "Revenue": 101.41317080706358,
                "Cost": 601.8939102068543,
                "Date": 1423440000000
            },
            {
                "Revenue": 274.15770827792585,
                "Cost": 570.9973692428321,
                "Date": 1423526400000
            },
            {
                "Revenue": 211.85032208450139,
                "Cost": 35.836717346683145,
                "Date": 1423612800000
            },
            {
                "Revenue": 133.74186772853136,
                "Cost": 616.9187077321112,
                "Date": 1423699200000
            },
            {
                "Revenue": 169.11059780977666,
                "Cost": 323.64689465612173,
                "Date": 1423785600000
            },
            {
                "Revenue": 984.3492589425296,
                "Cost": 695.0582726858556,
                "Date": 1423872000000
            },
            {
                "Revenue": 281.26668953336775,
                "Cost": 731.8900229874998,
                "Date": 1423958400000
            },
           
            {
                "Revenue": 732.3133663740009,
                "Cost": 984.786536777392,
                "Date": 1424476800000
            },
            {
                "Revenue": 579.5146781019866,
                "Cost": 784.5072702039033,
                "Date": 1424563200000
            },
            {
                "Revenue": 162.24518651142716,
                "Cost": 533.1787513568997,
                "Date": 1424649600000
            },
            {
                "Revenue": 215.52710700780153,
                "Cost": 328.3798969350755,
                "Date": 1424736000000
            },
            {
                "Revenue": 317.45847035199404,
                "Cost": 399.86363309435546,
                "Date": 1424822400000
            },
            {
                "Revenue": 285.6373330578208,
                "Cost": 540.1806910522282,
                "Date": 1424908800000
            },
            {
                "Revenue": 458.92346021719277,
                "Cost": 273.8717058673501,
                "Date": 1424995200000
            },
            {
                "Revenue": 407.6294736005366,
                "Cost": 307.67278699204326,
                "Date": 1425081600000
            },
            {
                "Revenue": 844.1622673999518,
                "Cost": 881.4978408627212,
                "Date": 1425168000000
            },
            {
                "Revenue": 156.5289639402181,
                "Cost": 460.15396318398416,
                "Date": 1425254400000
            },
            {
                "Revenue": 452.7163200546056,
                "Cost": 348.43586874194443,
                "Date": 1425340800000
            },
            {
                "Revenue": 919.4825675804168,
                "Cost": 24.513499345630407,
                "Date": 1425427200000
            },
            {
                "Revenue": 986.038391245529,
                "Cost": 150.63403360545635,
                "Date": 1425513600000
            },
            {
                "Revenue": 190.98301278427243,
                "Cost": 802.2719216533005,
                "Date": 1425600000000
            },
            {
                "Revenue": 462.2864064294845,
                "Cost": 905.8794544544071,
                "Date": 1425686400000
            },
            {
                "Revenue": 755.5622975341976,
                "Cost": 288.2655297871679,
                "Date": 1425772800000
            },
            {
                "Revenue": 923.5954645555466,
                "Cost": 186.10217911191285,
                "Date": 1425859200000
            },
            {
                "Revenue": 680.8686449658126,
                "Cost": 319.5328488945961,
                "Date": 1425945600000
            },
            {
                "Revenue": 809.4418898690492,
                "Cost": 733.377621974796,
                "Date": 1426032000000
            },
            {
                "Revenue": 186.89675070345402,
                "Cost": 3.34581988863647,
                "Date": 1426118400000
            },
            {
                "Revenue": 336.20488503947854,
                "Cost": 393.5747540090233,
                "Date": 1426204800000
            },
            {
                "Revenue": 908.6266597732902,
                "Cost": 291.9219385366887,
                "Date": 1426291200000
            },
            {
                "Revenue": 855.9801073279232,
                "Cost": 954.4806242920458,
                "Date": 1426377600000
            },
            {
                "Revenue": 164.44899793714285,
                "Cost": 265.4194897040725,
                "Date": 1426464000000
            },
            {
                "Revenue": 15.537644270807505,
                "Cost": 141.07549376785755,
                "Date": 1426550400000
            },
            {
                "Revenue": 838.9458297751844,
                "Cost": 814.7822236642241,
                "Date": 1426636800000
            },
            {
                "Revenue": 154.30739126168191,
                "Cost": 412.4261501710862,
                "Date": 1426723200000
            },
            {
                "Revenue": 798.7504585180432,
                "Cost": 971.4207896031439,
                "Date": 1426809600000
            },
            {
                "Revenue": 596.2059586308897,
                "Cost": 723.3078861609101,
                "Date": 1426896000000
            },
            {
                "Revenue": 620.4730405006558,
                "Cost": 261.38211763463914,
                "Date": 1426982400000
            },
            {
                "Revenue": 235.26620608754456,
                "Cost": 219.27580167539418,
                "Date": 1427068800000
            },
            {
                "Revenue": 924.9472785741091,
                "Cost": 549.2745887022465,
                "Date": 1427155200000
            },
            {
                "Revenue": 431.97655165567994,
                "Cost": 296.5760629158467,
                "Date": 1427241600000
            },
            {
                "Revenue": 772.774109384045,
                "Cost": 623.3943772967905,
                "Date": 1427328000000
            },
            {
                "Revenue": 925.3094061277807,
                "Cost": 91.28985810093582,
                "Date": 1427414400000
            },
            {
                "Revenue": 88.89117510989308,
                "Cost": 838.1796646863222,
                "Date": 1427500800000
            },
            {
                "Revenue": 10.23804978467524,
                "Cost": 592.6839502062649,
                "Date": 1427587200000
            },
            {
                "Revenue": 216.58818959258497,
                "Cost": 465.31020919792354,
                "Date": 1427673600000
            },
            {
                "Revenue": 424.04685728251934,
                "Cost": 316.3415512535721,
                "Date": 1427760000000
            },
            {
                "Revenue": 273.938518948853,
                "Cost": 606.4248634502292,
                "Date": 1427846400000
            }]

        });

// Prepare business data
var ammModel = new sap.ui.model.json.JSONModel({
  'businessData' : [{
    'Country' : "Canada",
    'profit' : 141.25,
    'target' : 100,
    'reference' : 70
  }, {
    'Country' : "China",
    'profit' : 133.82,
    'target' : 180,
    'reference' : 200
  }, {
    'Country' : "France",
    'profit' : 348.76,
    'target' : 400,
    'reference' : 330
  }, {
    'Country' : "Germany",
    'profit' : 217.29,
    'target' : 290,
    'reference' : 230
  }, {
    'Country' : "India",
    'profit' : 117.00,
    'target' : 200,
    'reference' : 120
  }, {
    'Country' : "United States",
    'profit' : 609.16,
    'target' : 640,
    'reference': 590
  }]
});

var aamModelWaterfall = new sap.ui.model.json.JSONModel({
  'businessData' : [{
    'Cash' : "Previous",
    'Type' : "total",
    'Revenue' : 10,
  }, {
    'Cash' : "Product rev",
    'Type' : null,
    'Revenue' : 39,
  }, {
    'Cash' : "Services rev",
    'Type' : null,
    'Revenue' : 14,
  }, {
	'Cash' : "Other rev",
	'Type' : null,
	'Revenue' : 15,
  }, {
    'Cash' : "Revs",
    'Type' : "subtotal: 3",
    'Revenue' : 68,
  }, {
    'Cash' : "Before Cost",
    'Type' : "total",
    'Revenue' : 78,
  }, {
    'Cash' : "Fixed cost",
    'Type' : null,
    'Revenue' : -29,
  }, {
    'Cash' : "Var cost",
    'Type' : null,
    'Revenue' : -29,
  }, {
    'Cash' : "Cost",
    'Type' : "subtotal: 2",
    'Revenue' : -58,
  }, {
    'Cash' : "Balance",
    'Type' : "total",
    'Revenue' : 20,
  }]
});

var aammmModel = new sap.ui.model.json.JSONModel({
  'businessData' : [ {
    "Sales_Month" : "April",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Sales_Quarter" : "Q2",
    "Cost" : 742.61,
    "Sales Quantity" : 891,
    "Sales Revenue" : 1870.36
  }, {
    "Sales_Month" : "April",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Sales_Quarter" : "Q3",
    "Cost" : 1216.55,
    "Sales Quantity" : 1420,
    "Sales Revenue" : 3041.1
  }, {
    "Sales_Month" : "August",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Sales_Quarter" : "Q4",
    "Cost" : 1575.67,
    "Sales Quantity" : 1870,
    "Sales Revenue" : 3952.2
  }, {
    "Sales_Month" : "February",
    "Sales_Quarter" : "Q1",
    "Cost" : 882.95,
    "Sales Quantity" : 1036,
    "Sales Revenue" : 2159.99
  }, {
    "Sales_Month" : "February",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Sales_Quarter" : "Q1",
    "Cost" : 659.49,
    "Sales Quantity" : 819,
    "Sales Revenue" : 1663.68
  }, {
    "Sales_Month" : "January",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Sales_Quarter" : "Q3",
    "Cost" : 1018.96,
    "Sales Quantity" : 1245,
    "Sales Revenue" : 2564.71
  }, {
    "Sales_Month" : "July",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Sales_Quarter" : "Q2",
    "Cost" : 986.02,
    "Sales Quantity" : 1182,
    "Sales Revenue" : 2477.06
  }, {
    "Sales_Month" : "June",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Sales_Quarter" : "Q1",
    "Cost" : 1106.31,
    "Sales Quantity" : 1328,
    "Sales Revenue" : 2760.62
  }, {
    "Sales_Month" : "March",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Sales_Quarter" : "Q2",
    "Cost" : 801.71,
    "Sales Quantity" : 971,
    "Sales Revenue" : 2005.36
  }, {
    "Sales_Month" : "May",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Sales_Quarter" : "Q4",
    "Cost" : 1436.89,
    "Sales Quantity" : 1687,
    "Sales Revenue" : 3584.49
  }, {
    "Sales_Month" : "October",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Sales_Quarter" : "Q4",
    "Cost" : 962.08,
    "Sales Quantity" : 1145,
    "Sales Revenue" : 2409.93
  }, {
    "Sales_Month" : "September",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Sales_Quarter" : "Q3",
    "Cost" : 1140.38,
    "Sales Quantity" : 1329,
    "Sales Revenue" : 2856.73
  }, {
    "Sales_Month" : "September",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Sales Quantity" : null,
    "Sales Revenue" : null
  } ]
});

var amModel = new sap.ui.model.json.JSONModel({
  'businessData' : [{
    'Country' : "Canada",
    'profit' : -141.25
  }, {
    'Country' : "China",
    'profit' : 133.82
  }, {
    'Country' : "France",
    'profit' : 348.76
  }, {
    'Country' : "Germany",
    'profit' : 217.29
  }, {
    'Country' : "India",
    'profit' : 117.00
  }, {
    'Country' : "United States",
    'profit' : 609.16
  }]
});

var aaaammmmModel = new sap.ui.model.json.JSONModel({
  'businessData' : [ {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : 189.9,
    "Unit Price" : 151.17,
    "Gross Profit" : 281.59,
    "Sales Revenue" : 471.49
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : 207.61,
    "Unit Price" : 161.23,
    "Gross Profit" : 309.06,
    "Sales Revenue" : 516.67
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : 191.2,
    "Unit Price" : 158.83,
    "Gross Profit" : 298.44,
    "Sales Revenue" : 489.64
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : 153.9,
    "Unit Price" : 137.85,
    "Gross Profit" : 238.66,
    "Sales Revenue" : 392.56
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "April",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : 249.74,
    "Unit Price" : 200.51,
    "Gross Profit" : 376.74,
    "Sales Revenue" : 626.48
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : 335.83,
    "Unit Price" : 264.13,
    "Gross Profit" : 482.45,
    "Sales Revenue" : 818.28
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : 279.43,
    "Unit Price" : 228.96,
    "Gross Profit" : 431.15,
    "Sales Revenue" : 710.58
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : 351.55,
    "Unit Price" : 297.95,
    "Gross Profit" : 534.21,
    "Sales Revenue" : 885.76
  }, {
    "Sales_Month" : "August",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : 294.91,
    "Unit Price" : 239.93,
    "Gross Profit" : 435.4,
    "Sales Revenue" : 730.31
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : 445.68,
    "Unit Price" : 346.31,
    "Gross Profit" : 683.04,
    "Sales Revenue" : 1128.72
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : 387.07,
    "Unit Price" : 303.18,
    "Gross Profit" : 572.65,
    "Sales Revenue" : 959.72
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "December",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : 448.01,
    "Unit Price" : 361.67,
    "Gross Profit" : 685.44,
    "Sales Revenue" : 1133.45
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : 211.69,
    "Unit Price" : 182.44,
    "Gross Profit" : 309.5,
    "Sales Revenue" : 521.19
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : 246.24,
    "Unit Price" : 201.7,
    "Gross Profit" : 348.35,
    "Sales Revenue" : 594.59
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : 201.88,
    "Unit Price" : 165.6,
    "Gross Profit" : 302.05,
    "Sales Revenue" : 503.93
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : 223.14,
    "Unit Price" : 186.7,
    "Gross Profit" : 317.14,
    "Sales Revenue" : 540.28
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "February",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : 156.51,
    "Unit Price" : 124.57,
    "Gross Profit" : 236.83,
    "Sales Revenue" : 393.34
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : 126.61,
    "Unit Price" : 107.48,
    "Gross Profit" : 190.19,
    "Sales Revenue" : 316.8
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : 183.24,
    "Unit Price" : 165.29,
    "Gross Profit" : 287.44,
    "Sales Revenue" : 470.68
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : 193.13,
    "Unit Price" : 182.78,
    "Gross Profit" : 289.73,
    "Sales Revenue" : 482.86
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "January",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : 214.12,
    "Unit Price" : 187.66,
    "Gross Profit" : 325.16,
    "Sales Revenue" : 539.28
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : 255.07,
    "Unit Price" : 209.48,
    "Gross Profit" : 393.23,
    "Sales Revenue" : 648.3
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : 282.24,
    "Unit Price" : 243.62,
    "Gross Profit" : 431.04,
    "Sales Revenue" : 713.28
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : 267.53,
    "Unit Price" : 216.96,
    "Gross Profit" : 396.32,
    "Sales Revenue" : 663.85
  }, {
    "Sales_Month" : "July",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : 226.97,
    "Unit Price" : 182.7,
    "Gross Profit" : 349.36,
    "Sales Revenue" : 576.33
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : 247.73,
    "Unit Price" : 190.14,
    "Gross Profit" : 349.7,
    "Sales Revenue" : 597.43
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : 257.74,
    "Unit Price" : 212.16,
    "Gross Profit" : 392.86,
    "Sales Revenue" : 650.6
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : 253.58,
    "Unit Price" : 203.97,
    "Gross Profit" : 399.12,
    "Sales Revenue" : 652.7
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "June",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : 250.27,
    "Unit Price" : 201.03,
    "Gross Profit" : 368.7,
    "Sales Revenue" : 618.97
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : 308.73,
    "Unit Price" : 238.02,
    "Gross Profit" : 456.24,
    "Sales Revenue" : 764.97
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : 260.72,
    "Unit Price" : 219.36,
    "Gross Profit" : 395.2,
    "Sales Revenue" : 655.92
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : 286.59,
    "Unit Price" : 238.84,
    "Gross Profit" : 434.17,
    "Sales Revenue" : 720.76
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "March",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : 217.93,
    "Unit Price" : 179.7,
    "Gross Profit" : 326.97,
    "Sales Revenue" : 544.9
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : 164.91,
    "Unit Price" : 126.1,
    "Gross Profit" : 244.7,
    "Sales Revenue" : 409.61
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : 170.41,
    "Unit Price" : 156.2,
    "Gross Profit" : 267.54,
    "Sales Revenue" : 437.95
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : 248.46,
    "Unit Price" : 197.53,
    "Gross Profit" : 364.44,
    "Sales Revenue" : 612.9
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "May",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : 294.75,
    "Unit Price" : 246.51,
    "Gross Profit" : 449.48,
    "Sales Revenue" : 744.23
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : 400.49,
    "Unit Price" : 320.65,
    "Gross Profit" : 591.57,
    "Sales Revenue" : 992.06
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : 371.72,
    "Unit Price" : 292.97,
    "Gross Profit" : 545.95,
    "Sales Revenue" : 917.67
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "November",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : 369.93,
    "Unit Price" : 306.45,
    "Gross Profit" : 560.6,
    "Sales Revenue" : 930.53
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : 196.24,
    "Unit Price" : 170.83,
    "Gross Profit" : 310.85,
    "Sales Revenue" : 507.09
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : 236.69,
    "Unit Price" : 201.88,
    "Gross Profit" : 343.89,
    "Sales Revenue" : 580.58
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : 271.42,
    "Unit Price" : 219.92,
    "Gross Profit" : 403.62,
    "Sales Revenue" : 675.04
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "October",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : 257.73,
    "Unit Price" : 212.69,
    "Gross Profit" : 389.49,
    "Sales Revenue" : 647.22
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : 259.79,
    "Unit Price" : 210.79,
    "Gross Profit" : 400.91,
    "Sales Revenue" : 660.7
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : 280.97,
    "Unit Price" : 230.15,
    "Gross Profit" : 417.93,
    "Sales Revenue" : 698.9
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Married",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q3",
    "Cost" : 363.3,
    "Unit Price" : 293.63,
    "Gross Profit" : 531.69,
    "Sales Revenue" : 894.99
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Female",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q1",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q2",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q3",
    "Cost" : 236.32,
    "Unit Price" : 203.18,
    "Gross Profit" : 365.82,
    "Sales Revenue" : 602.14
  }, {
    "Sales_Month" : "September",
    "Marital Status" : "Single",
    "Customer Gender" : "Male",
    "Sales_Quarter" : "Q4",
    "Cost" : null,
    "Unit Price" : null,
    "Gross Profit" : null,
    "Sales Revenue" : null
  } ]
});