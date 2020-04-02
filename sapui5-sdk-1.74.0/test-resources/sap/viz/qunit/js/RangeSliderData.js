sap.ui.define([
	"sap/viz/ui5/controls/VizSlider",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel"
], function(VizSlider, FeedItem, FlattenedDataset, JSONModel) {

var createRangeSliderTime = function(){
	var initOptions = {
    	"vizType": "timeseries_line",
    	"uiConfig": {
        	"applicationSet": "fiori"
		 },
		 "range" : {start: 1420000000000, end: 1430000000000}
	};

	var vizframe = new VizSlider(initOptions);

	var model = new JSONModel(
	{
	    "businessData": [{
	        "Country": "China",
	        "Tax": 68.74129734933376,
	        "Date": 1420070400000
	    },
	    {
	        "Country": "Japan",
	        "Tax": 469.49445689097047,
	        "Date": 1420070400000
	    },
	    {
	        "Country": "France",
	        "Tax": 786.9790350086987,
	        "Date": 1420070400000
	    },
	    {
	        "Country": "UK",
	        "Tax": 235.14807038009167,
	        "Date": 1420070400000
	    },
	    {
	        "Country": "China",
	        "Tax": 753.5625018645078,
	        "Date": 1422662400000
	    },
	    {
	        "Country": "Japan",
	        "Tax": 666.7062356136739,
	        "Date": 1422662400000
	    },
	    {
	        "Country": "France",
	        "Tax": 849.2572987452149,
	        "Date": 1422662400000
	    },
	    {
	        "Country": "UK",
	        "Tax": 37.66878182068467,
	        "Date": 1422662400000
	    },
	    {
	        "Country": "China",
	        "Tax": 219.8575211223215,
	        "Date": 1425254400000
	    },
	    {
	        "Country": "Japan",
	        "Tax": 881.2251812778413,
	        "Date": 1425254400000
	    },
	    {
	        "Country": "France",
	        "Tax": 282.6830903068185,
	        "Date": 1425254400000
	    },
	    {
	        "Country": "UK",
	        "Tax": 765.7210510224104,
	        "Date": 1425254400000
	    },
	    {
	        "Country": "China",
	        "Tax": 947.2194274421781,
	        "Date": 1427846400000
	    },
	    {
	        "Country": "Japan",
	        "Tax": 309.41323027946055,
	        "Date": 1427846400000
	    },
	    {
	        "Country": "France",
	        "Tax": 787.0587811339647,
	        "Date": 1427846400000
	    },
	    {
	        "Country": "UK",
	        "Tax": 566.6894514579326,
	        "Date": 1427846400000
	    },
	    {
	        "Country": "China",
	        "Tax": 473.3121800236404,
	        "Date": 1430438400000
	    },
	    {
	        "Country": "Japan",
	        "Tax": 702.9698025435209,
	        "Date": 1430438400000
	    },
	    {
	        "Country": "France",
	        "Tax": 447.6791324559599,
	        "Date": 1430438400000
	    },
	    {
	        "Country": "UK",
	        "Tax": 820.7472339272499,
	        "Date": 1430438400000
	    },
	    {
	        "Country": "China",
	        "Tax": 60.784638626500964,
	        "Date": 1433030400000
	    },
	    {
	        "Country": "Japan",
	        "Tax": 12.696569785475731,
	        "Date": 1433030400000
	    },
	    {
	        "Country": "France",
	        "Tax": 913.2153333630413,
	        "Date": 1433030400000
	    },
	    {
	        "Country": "UK",
	        "Tax": 143.86586216278374,
	        "Date": 1433030400000
	    }]
	}
	);
	var dataset = new FlattenedDataset(
	{
	    "dimensions": [{
	        "name": "Country",
	        "value": "{Country}"
	    },
	    {
	        "name": "Date",
	        "value": "{Date}",
	        "dataType": "date"
	    },
	    {
	        "name": "Date",
	        "value": "{Date}"
	    }],
	    "measures": [{
	        "name": "Tax",
	        "value": "{Tax}"
	    }],
	    "data": {
	        "path": "/businessData"
	    }
	});
	vizframe.setModel(model);
	vizframe.setDataset(dataset);
	var feeds =[
		new FeedItem({"uid":"timeAxis","type":"Dimension","values":["Date"]}),
		new FeedItem({"uid":"color","type":"Dimension","values":["Country"]}),
		new FeedItem({"uid":"valueAxis","type":"Measure","values":["Tax"]})
		];
	feeds.forEach(function(feedItem) {
		vizframe.addFeed(feedItem);
	});
	return vizframe;
};
var createRangeSliderColumn = function(){
	var rawData = {
		'businessData' : [{
			'Country' : "Canada",
			'Product':"Car",
			'profit' : -141.25
		}, {
			'Country' : "China",
			'Product':"Car",
			'profit' : 133.82
		}, {
			'Country' : "France",
			'Product':"Car",
			'profit' : 348.76
		}, {
			'Country' : "Germany",
			'Product':"Car",
			'profit' : 217.29
		}, {
			'Country' : "India",
			'Product':"Car",
			'profit' : 117.00
		}, {
			'Country' : "United States",
			'Product':"Car",
			'profit' : 609.16
		},{
			'Country' : "Canada",
			'Product':"Bike",
			'profit' : 141.25
		}, {
			'Country' : "China",
			'Product':"Bike",
			'profit' : 153.82
		}, {
			'Country' : "France",
			'Product':"Bike",
			'profit' : 38.76
		}, {
			'Country' : "Germany",
			'Product':"Bike",
			'profit' : 219
		}, {
			'Country' : "India",
			'Product':"Bike",
			'profit' : 17.00
		}, {
			'Country' : "United States",
			'Product':"Bike",
			'profit' : 69.16
		}]
	};
	var oModel = new JSONModel(rawData);

	// A Dataset defines how the model data is mapped to the chart
	var oDataset = new FlattenedDataset({
		// a Bar Chart requires exactly one dimension (x-axis)
		'dimensions' : [{
			'name' : 'Country',
			'value' : "{Country}"
		},{
			'name' : 'Product',
			'value' : "{Product}"
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


	// create a VizFrame for range slider
	var oVizFrame = new VizSlider({
	'uiConfig' : {
	'applicationSet': 'fiori'
	},
	'vizType' : 'column'

	});				
	oVizFrame.setWidth("900px");
	oVizFrame.setHeight("125px");
	// oVizFrame.
	// attach the model to the chart and display it
	oVizFrame.setDataset(oDataset);
	oVizFrame.setModel(oModel);
	var feedPrimaryValues = new FeedItem({
		'uid' : "primaryValues",
		'type' : "Measure",
		'values' : ["Profit"]
	}), feedAxisLabels = new FeedItem({
		'uid' : "axisLabels",
		'type' : "Dimension",
		'values' : ["Country"]
	}),
	 feedColor = new FeedItem({
			'uid' : "color",
			'type' : "Dimension",
			'values' : ["Product"]
		});

	oVizFrame.addFeed(feedPrimaryValues);
	oVizFrame.addFeed(feedAxisLabels);
	oVizFrame.addFeed(feedColor);
	return oVizFrame;
};

	return {
		createRangeSliderTime: createRangeSliderTime,
		createRangeSliderColumn: createRangeSliderColumn
	};

});