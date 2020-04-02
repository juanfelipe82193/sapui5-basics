/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel",
	"test-resources/sap/viz/qunit/controls/CommonUtil"
], function(VizFrame, FeedItem, FlattenedDataset, JSONModel, CommonUtil) {

QUnit.module("Category Ticker Test");

var oModel = new JSONModel({
    businessData1 : [{
        "Year": '2001',
        "Country": "China",
        "Product": "Car",
        "Value": 131.7715651821345,
        "Value2": 12,
        "Forecast": 123,
        "Additional": 456
    }, {
        "Year": '2001',
        "Country": "Japan",
        "Product": "Car",
        "Value": 732.2505286429077,
        "Value2": 123,
        "Forecast": 123,
        "Additional": 456
    }, {
        "Year": '2002',
        "Country": "China",
        "Product": "Car",
        "Value": 301.2606957927346,
        "Value2": 12,
        "Forecast": 123,
        "Additional": 456
    }, {
        "Year": '2002',
        "Country": "Japan",
        "Product": "Motor",
        "Value": 815.9925150685012,
        "Value2": 456,
        "Forecast": 123,
        "Additional": 456
    }, {
        "Year": '2003',
        "Country": "China",
        "Product": "Motor",
        "Value": 184.3122337013483,
        "Value2": 12,
        "Forecast": 123,
        "Additional": 456
    }, {
        "Year": '2003',
        "Country": "Japan",
        "Product": "Motor",
        "Value": 350.25157197378576,
        "Value2": 123,
        "Forecast": 123,
        "Additional": 456
    }]
});



QUnit.test("Column/Bar category ticker", function(assert) {
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Year',
            value: "{Year}",
            
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
        viztype:"info/bar"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "primaryValues",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "axisLabels",
            'type': "Dimension",
            'values': ["Year"]
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
        var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
        assert.ok(tickers.length != 0, "category tickers exist");
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Column/Bar category ticker2", function(assert) {
    var done = assert.async();
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Year',
            value: "{Year}",
            
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
        viztype:"info/column"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new FeedItem({
            'uid': "primaryValues",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new FeedItem({
            'uid': "axisLabels",
            'type': "Dimension",
            'values': ["Year"]
        });
//        feedColor = new FeedItem({
//            'uid': "color",
//            'type': "Dimension",
//            'values': ["Country"]
//        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
   // oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
        assert.ok(tickers.length === 0, "no category tickers exist");
       
        CommonUtil.destroyVizFrame(oVizFrame);
        done();
    });
});

QUnit.test("Column/Bar category ticker3", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            viztype:"info/column"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Value"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
            });
         

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");
          
            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("Column/Bar category ticker4", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            viztype:"info/bar"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
            });

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");
            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
    });
    
QUnit.test("Stacked Column/ Stacked Bar category ticker", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            viztype:"stacked_column"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
            });

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");
         
            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("Stacked Column/ Stacked Bar category ticker2", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            viztype:"stacked_column"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year", "Country"]
            });
           

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
       // oVizFrame.addFeed(feedColor);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");
         
            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("Stacked combination category ticker", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            viztype:"stacked_combination"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
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
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");
          
            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("Stacked Combination category ticker2", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            viztype:"stacked_combination"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setVizProperties({plotArea:{dataShape:{primaryAxis:["line", "line"]}}});
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
            })
           ;
           

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length > 0, "category tickers exist");
            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("Combination category ticker", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}"
                
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
            viztype:"combination"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setVizProperties({plotArea:{dataShape:{primaryAxis:["bar", "bar"]}}});
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
            });
           

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length !== 0, "category tickers exist");

            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("Combination category ticker2", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            viztype:"combination"
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setVizProperties({plotArea:{dataShape:{primaryAxis:["bar", "bar"]}}});
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
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
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length !== 0, "category tickers exist");

            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
    
QUnit.test("bullet category ticker old style", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [ {
                name: 'Country',
                value: "{Country}"
            }],
            measures: [{
                name: 'Value',
                value: '{Value}'
            },{
                name: 'Value2',
                value: '{Value2}'
            }
           ],
            data: {
                path: "/businessData1"
            }
        });
        var oVizFrame = CommonUtil.createVizFrame({
            viztype:"bullet"
        });

        oVizFrame.setDataset(oDataset);
     
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "primaryValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Country"]
            });
//        ,
//            feedColor = new FeedItem({
//                'uid': "color",
//                'type': "Dimension",
//                'values': ["Country"]
//            });
//           

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");

            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("bullet category ticker new style", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
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
            }
          ],
            data: {
                path: "/businessData1"
            }
        });
        var oVizFrame = CommonUtil.createVizFrame({
            viztype:"bullet"
        });

        oVizFrame.setDataset(oDataset);
     
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "actualValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year","Country"]
            });
//        ,
//            feedColor = new FeedItem({
//                'uid': "color",
//                'type': "Dimension",
//                'values': ["Country"]
//            });
//           

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
       // oVizFrame.addFeed(feedColor);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length !== 0, "no category tickers exist");

            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("bullet category ticker new style2", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
            }],
            measures: [{
                name: 'Value',
                value: '{Value}'
            },{
                name: 'Value2',
                value: '{Value2}'
            }
           ],
            data: {
                path: "/businessData1"
            }
        });
        var oVizFrame = CommonUtil.createVizFrame({
            viztype:"bullet"
        });

        oVizFrame.setDataset(oDataset);
     
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "actualValues",
                'type': "Measure",
                'values': ["Value", "Value2"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "axisLabels",
                'type': "Dimension",
                'values': ["Year"]
            });
//           

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
       // oVizFrame.addFeed(feedColor);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length !== 0, "no category tickers exist");

            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});
    
QUnit.test("heatmap category ticker new style2", function(assert) {
        var done = assert.async();
        var oDataset = new FlattenedDataset({
            dimensions: [{
                name: 'Year',
                value: "{Year}",
                
            },
            {
                name: 'Country',
                value: "{Country}",
                
            },
            {
                name: 'Product',
                value: "{Product}",
                
            }],
            measures: [{
                name: 'Value',
                value: '{Value}'
            }
           ],
            data: {
                path: "/businessData1"
            }
        });
        var oVizFrame = CommonUtil.createVizFrame({
            viztype:"heatmap"
        });

        oVizFrame.setDataset(oDataset);
     
        oVizFrame.setModel(oModel);

        var feedValueAxis = new FeedItem({
                'uid': "color",
                'type': "Measure",
                'values': ["Value"]
            }),
            feedCategoryAxis = new FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Year"]
            }),
            feedCategoryAxis2 = new FeedItem({
                'uid': "categoryAxis2",
                'type': "Dimension",
                'values': ["Country", "Product"]
            });
         

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.addFeed(feedCategoryAxis2);
       // oVizFrame.addFeed(feedColor);
        oVizFrame.placeAt('content');
        oVizFrame.attachEventOnce('renderComplete', function(){
            var tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");
            
            tickers = document.querySelectorAll("#content .v-m-main .v-m-categoryAxis2 .v-m-axisBody .v-tick-group .v-tick");
            assert.ok(tickers.length === 0, "no category tickers exist");

            CommonUtil.destroyVizFrame(oVizFrame);
            done();
        });
});


QUnit.start();

});
