sap.ui.define([
	"sap/viz/ui5/controls/Popover",
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/controls/VizTooltip",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel"
], function(Popover, VizFrame, VizTooltip, FeedItem, FlattenedDataset, JSONModel) {

var createXYChart = function(type, connectControl) {
    var initOptions = {
        "vizType" : type ? type : 'info/bar',
        width : '100%',
        height : '100%',
        "uiConfig" : {
            "applicationSet" : "fiori"
        }
    };
    var vizframe = new VizFrame(initOptions);
    var model = new JSONModel({
        "businessData" : [ {
            "Country" : "China",
            "Year" : "2009",
            "Cost" : 80.1
        }, {
            "Country" : "China",
            "Year" : "2010",
            "Cost" : 70.53
        }, {
            "Country" : "China",
            "Year" : "2011",
            "Cost" : 715.3
        }, {
            "Country" : "Japan",
            "Year" : "2009",
            "Cost" : 45.3
        }, {
            "Country" : "Japan",
            "Year" : "2010",
            "Cost" : 67.8
        }, {
            "Country" : "Japan",
            "Year" : "2011",
            "Cost" : 80.1
        }, {
            "Country" : "France",
            "Year" : "2009",
            "Cost" : 80
        }, {
            "Country" : "France",
            "Year" : "2010",
            "Cost" : 70.3
        }, {
            "Country" : "France",
            "Year" : "2011",
            "Cost" : 70.37
        }, {
            "Country" : "UK",
            "Year" : "2009",
            "Cost" : -45.63
        }, {
            "Country" : "UK",
            "Year" : "2010",
            "Cost" : 267.8
        }, {
            "Country" : "UK",
            "Year" : "2011",
            "Cost" : 380
        } ]
    });
    var dataset = new FlattenedDataset({
        "dimensions" : [ {
            "name" : "Country",
            "value" : "{Country}"
        }, {
            "name" : "Year",
            "value" : "{Year}"
        } ],
        "measures" : [ {
            "name" : "Cost",
            "value" : "{Cost}"
        } ],
        "data" : {
            "path" : "/businessData"
        }
    });
    vizframe.setModel(model);
    vizframe.setDataset(dataset);
    var feeds = [ new FeedItem({
        "uid" : "categoryAxis",
        "type" : "Dimension",
        "values" : [ "Country" ]
    }), new FeedItem({
        "uid" : "color",
        "type" : "Dimension",
        "values" : [ "Year" ]
    }), new FeedItem({
        "uid" : "valueAxis",
        "type" : "Measure",
        "values" : [ "Cost" ]
    }) ];
    feeds.forEach(function(feedItem) {
        vizframe.addFeed(feedItem);
    });
    if (connectControl === "tooltip") {
        var tooltip = new VizTooltip({});
        tooltip.connect(vizframe.getVizUid());
    } else {
        var popOver = new Popover({});
        popOver.connect(vizframe.getVizUid());
    }

    vizframe.placeAt("content");

    return {
        vizFrame : vizframe,
        chartPopover : popOver,
        chartTooltip: tooltip
    };
};

var createTimeLineChart = function(connectControl) {
    var initOptions = {
        "vizType" : 'timeseries_line',
        width : '100%',
        height : '100%',
        "uiConfig" : {
            "applicationSet" : "fiori"
        }
    };
    if (connectControl === 'tooltip') {
        initOptions.vizProperties = {
            "timeAxis":{"levels":["year","month","day","hour"]}
        };
    }
    var vizframe = new VizFrame(initOptions);
    var model = new JSONModel({
        "businessData" : [ {
            "Revenue" : 669.0972230862826,
            "Date" : 1420070400000
        }, {
            "Revenue" : 785.6516572646797,
            "Date" : 1420156800000
        }, {
            "Revenue" : 354.9720789305866,
            "Date" : 1420243200000
        }, {
            "Revenue" : 238.8825339730829,
            "Date" : 1420329600000
        }, {
            "Revenue" : 38.120953598991036,
            "Date" : 1420416000000
        }, {
            "Revenue" : 305.40843144990504,
            "Date" : 1420502400000
        }

        ]
    });
    var dataset = new FlattenedDataset({
        "dimensions" : [ {
            "name" : "Date",
            "value" : "{Date}",
            "dataType" : "date"
        }, {
            "name" : "Date",
            "value" : "{Date}"
        } ],
        "measures" : [ {
            "name" : "Revenue",
            "value" : "{Revenue}"
        } ],
        "data" : {
            "path" : "/businessData"
        }
    });
    vizframe.setModel(model);
    vizframe.setDataset(dataset);
    var feeds = [ new FeedItem({
        "uid" : "timeAxis",
        "type" : "Dimension",
        "values" : [ "Date" ]
    }), new FeedItem({
        "uid" : "valueAxis",
        "type" : "Measure",
        "values" : [ "Revenue" ]
    }) ]
    feeds.forEach(function(feedItem) {
        vizframe.addFeed(feedItem);
    });
    if (connectControl === "tooltip") {
        var tooltip = new VizTooltip({});
        tooltip.connect(vizframe.getVizUid());
    } else {
        var popOver = new Popover({});
        popOver.connect(vizframe.getVizUid());
    }
    vizframe.placeAt("content");
    return {
        vizFrame : vizframe,
        chartPopover : popOver,
        chartTooltip: tooltip
    };
};

var createBullet = function(){
     var initOptions = {
        "vizType":'bullet',
        "uiConfig": {
        "applicationSet": "fiori"
    }};
    var vizframe = new VizFrame(initOptions);
    var model = new JSONModel({
        "businessData": [{
            "Country": "China",
            "Product": "Car",
            "Cost": 80.1111111111111,
            "Profit": 133.42
        },
        {
            "Country": "China",
            "Product": "Truck",
            "Cost": 451.3,
            "Profit": 734.2
        },
        {
            "Country": "Japan",
            "Product": "Car",
            "Cost": 45.3,
            "Profit": 73.2
        },
        {
            "Country": "Japan",
            "Product": "Truck",
            "Cost": 70.3,
            "Profit": 121.2
        },
        {
            "Country": "France",
            "Product": "Car",
            "Cost": 80,
            "Profit": 133.23
        },
        {
            "Country": "France",
            "Product": "Truck",
            "Cost": 45.3,
            "Profit": 73.32
        },
        {
            "Country": "UK",
            "Product": "Car",
            "Cost": 45.63,
            "Profit": 73.2
        },
        {
            "Country": "UK",
            "Product": "Truck",
            "Cost": 670.3,
            "Profit": 121.2
        }]
    });
    vizframe.setModel(model);
    var dataset = new FlattenedDataset(
    {
        "dimensions": [{
            "name": "Country",
            "value": "{Country}"
        },
        {
            "name": "Product",
            "value": "{Product}"
        }],
        "measures": [{
            "name": "Cost",
            "value": "{Cost}",
        },{
            "name": "Profit",
            "value": "{Profit}"
        }],
        "data": {
            "path": "/businessData"
        }
    });
    vizframe.setDataset(dataset);
    var feeds =[
        new FeedItem({"values":["Country","Product"],"uid":"categoryAxis","type":"Dimension"}),
        new FeedItem({"values":["Cost","Profit"],"uid":"valueAxis","type":"Measure"})
    ];
    feeds.forEach(function(feedItem) {
        vizframe.addFeed(feedItem);
    })
    var popOver = new Popover({});
    popOver.connect(vizframe.getVizUid());
    vizframe.placeAt("content");
    return {
        vizFrame : vizframe,
        chartPopover : popOver
    };
}

var createChartWithUnitBinding = function() {
    var initOptions = {
        "vizType":'column',
        "uiConfig": {
        "applicationSet": "fiori"
    }};
    var vizframe = new VizFrame(initOptions);
    var model = new JSONModel({
        "businessData": [{
            "Country": "China",
            "Product": "Car",
            "Cost": 80.1111111111111,
            "Profit": 133.42
        },
        {
            "Country": "China",
            "Product": "Truck",
            "Cost": 451.3,
            "Profit": 734.2
        },
        {
            "Country": "Japan",
            "Product": "Car",
            "Cost": 45.3,
            "Profit": 73.2
        },
        {
            "Country": "Japan",
            "Product": "Truck",
            "Cost": 70.3,
            "Profit": 121.2
        },
        {
            "Country": "France",
            "Product": "Car",
            "Cost": 80,
            "Profit": 133.23
        },
        {
            "Country": "France",
            "Product": "Truck",
            "Cost": 45.3,
            "Profit": 73.32
        },
        {
            "Country": "UK",
            "Product": "Car",
            "Cost": 45.63,
            "Profit": 73.2
        },
        {
            "Country": "UK",
            "Product": "Truck",
            "Cost": 670.3,
            "Profit": 121.2
        }]
    });
    vizframe.setModel(model);
    var dataset = new FlattenedDataset(
    {
        "dimensions": [{
            "name": "Country",
            "value": "{Country}"
        },
        {
            "name": "Product",
            "value": "{Product}"
        }],
        "measures": [{
            "name": "Cost",
            "value": "{Cost}",
            "unit": "w"
        },{
            "name": "Profit",
            "value": "{Profit}"
        }],
        "data": {
            "path": "/businessData"
        }
    });
    vizframe.setDataset(dataset);
    var feeds =[
        new FeedItem({"values":["Country","Product"],"uid":"categoryAxis","type":"Dimension"}),
        new FeedItem({"values":["Cost","Profit"],"uid":"valueAxis","type":"Measure"})
    ];
    feeds.forEach(function(feedItem) {
        vizframe.addFeed(feedItem);
    })
    var popOver = new Popover({});
    popOver.connect(vizframe.getVizUid());
    vizframe.placeAt("content");
    return {
        vizFrame : vizframe,
        chartPopover : popOver
    };
};


var createXYChartBigNum = function(type, connectControl) {
    var initOptions = {
        "vizType" : type ? type : 'info/bar',
        width : '100%',
        height : '100%',
        "uiConfig" : {
            "applicationSet" : "fiori"
        }
    };
    var vizframe = new VizFrame(initOptions);
    var model = new JSONModel({
        "businessData" : [ {
            "Country" : "China",
            "Year" : "2009",
            "Cost" :"8237878232378787880.1"
        }, {
            "Country" : "China",
            "Year" : "2010",
            "Cost" : "1337087666787876655.53"
        }, {
            "Country" : "China",
            "Year" : "2011",
            "Cost" : "711212232323232312523.3"
        } ]
    });
    var dataset = new FlattenedDataset({
        "dimensions" : [ {
            "name" : "Country",
            "value" : "{Country}"
        }, {
            "name" : "Year",
            "value" : "{Year}"
        } ],
        "measures" : [ {
            "name" : "Cost",
            "value" : "{Cost}"
        } ],
        "data" : {
            "path" : "/businessData"
        }
    });
    vizframe.setModel(model);
    vizframe.setDataset(dataset);
    var feeds = [ new FeedItem({
        "uid" : "categoryAxis",
        "type" : "Dimension",
        "values" : [ "Country" ]
    }), new FeedItem({
        "uid" : "color",
        "type" : "Dimension",
        "values" : [ "Year" ]
    }), new FeedItem({
        "uid" : "valueAxis",
        "type" : "Measure",
        "values" : [ "Cost" ]
    }) ];
    feeds.forEach(function(feedItem) {
        vizframe.addFeed(feedItem);
    });
    if (connectControl === "tooltip") {
        var tooltip = new VizTooltip({});
        tooltip.connect(vizframe.getVizUid());
    } else {
        var popOver = new Popover({});
        popOver.connect(vizframe.getVizUid());
    }

    vizframe.placeAt("content");

    return {
        vizFrame : vizframe,
        chartPopover : popOver,
        chartTooltip: tooltip
    };
};

	return {
		createXYChart: createXYChart,
		createTimeLineChart: createTimeLineChart,
		createBullet: createBullet,
		createChartWithUnitBinding: createChartWithUnitBinding,
		createXYChartBigNum: createXYChartBigNum
	};

});
