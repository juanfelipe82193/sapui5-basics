/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/controls/common/feeds/AnalysisObject",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/controls/Popover",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel",
	"test-resources/sap/viz/qunit/controls/CommonUtil"
], function(VizFrame, AnalysisObject, FeedItem, Popover, FlattenedDataset, JSONModel, CommonUtil) {

QUnit.module("VizFrame");

var getTransformToElement = function(element, target){
    var result;
    if(element.getTransformToElement){
        result = element.getTransformToElement(target);
    }else{
        var mTargetInverse;
        try {
            mTargetInverse = target.getScreenCTM().inverse();
        } catch (e) {
            throw "'target' CTM is not invertible.";
        }
        result = mTargetInverse.multiply(element.getScreenCTM());
    }
    return result;
};
/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/1/27
 Description: Test VizFrame.setWidth() and vizFrame.getWidth
 Check points: set/get width of vizFrame works fine
 steps: 1.Create a VizFrame and set the width.
 */
QUnit.test("VizFrame.setWidth/getWidth ", function(assert) {
    assert.expect(1);
    var oVizFrame = CommonUtil.createVizFrame();
    oVizFrame.setWidth('200px');
    assert.equal(oVizFrame.getWidth(), '200px', "setWidth/getWidth pass");
    oVizFrame.destroy();
});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/1/27
 Description: Test VizFrame.setHeight() and vizFrame.getHeight
 Check points: set/get height of vizFrame works fine
 steps: 1.Create a VizFrame and set the height.
 */
QUnit.test("VizFrame.setHeight/getHeight ", function(assert) {
    assert.expect(1);
    var oVizFrame = CommonUtil.createVizFrame();
    oVizFrame.setHeight('100px');
    assert.equal(oVizFrame.getHeight(), '100px', "setHeight/getHeight pass");
    oVizFrame.destroy();
});

/*
 * test owner:Janet Wang
 * Reviewer: Amanda Li
 * Date: 2014/1/8
 * Description: Test for vizSelection api
 * Check points: vizSelection works well
 * steps: 1. Create a VizFrame with specified id and uiconfig
 * 2. Set vizData
 *	3. Select some data points, verify
 */

QUnit.test("VizFrame.vizSelectionTest", function(assert) {
    assert.expect(4);
    var done = assert.async();
    var oModel = new JSONModel({
        businessData : ModelInfo.businessData
    });
    var oDataset = new FlattenedDataset({
        dimensions : [{
            axis : 1,
            name : 'Country',
            value : "{Country}"
        }],
        measures : [{
            name : 'Profit', // 'name' is used as label in the Legend
            value : '{profit}' // 'value' defines the binding for the displayed value
        }],
        data : {
            path : "/businessData"
        }
    });
    //Selection data
    var dataPoints = [{
        "data" : {
            Country : "Canada",
            Profit : -141.25
        }
    }, {
        "data" : {
            Country : "China",
            Profit : 133.82
        }
    }];
    //create a vizFrame
    var vizFrame = CommonUtil.createVizFrame();

    vizFrame.setModel(oModel);
    vizFrame.setDataset(oDataset);

    // set feeds
    var aobjCountry = new AnalysisObject({
        uid : "Country",
        name : "Country",
        type : 'Dimension'
    }), aobjProfit = new AnalysisObject({
        uid : "Profit",
        name : "Profit",
        type : 'Measure'
    });
    var feedPrimaryValues = new FeedItem({
        uid : "primaryValues",
        type : 'Measure',
        values : [aobjProfit]
    }), feedAxisLabels = new FeedItem({
        uid : "axisLabels",
        type : 'Dimension',
        values : [aobjCountry]
    });
    vizFrame.addFeed(feedPrimaryValues);
    vizFrame.addFeed(feedAxisLabels);
    //select dataPoints
    vizFrame.vizSelection([dataPoints[0]], {
        clearSelection : true
    });
    assert.deepEqual(vizFrame.vizSelection(), null, "The data point can not be selected since vizContainer is not ready");
    vizFrame.placeAt("content");
    vizFrame.attachEventOnce('renderComplete', function() {
        vizFrame.vizSelection(dataPoints, {
            clearSelection : false
        });

        var dataset = vizFrame.getDataset(), selections = vizFrame.vizSelection();
        var context = dataset.findContext(selections[1].data);
        assert.equal(context.getPath(), '/businessData/1', 'findContext work properly')

        selections.forEach(function(dp) {
            delete dp.data._context_row_number;
        });
        assert.equal(CommonUtil.arrayEqualIgnoreSequence(selections, dataPoints), true, "The selected data point is correct");

        //deselect data points
        vizFrame.vizSelection([], {
            clearSelection : true
        });
        assert.deepEqual(vizFrame.vizSelection(), [], "The data point is deselected");
        //destroy control
        CommonUtil.destroyVizFrame(vizFrame);
        done();
    });
});

QUnit.test("VizFrame.vizSelectionTest with context", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oModel = new JSONModel({
        businessData : ModelInfo.businessContextData
    });
    var oDataset = new FlattenedDataset({
        dimensions : [{
            axis : 1,
            name : 'Country',
            value : "{Country}"
        },{
            axis : 1,
            name : 'Year',
            value : "{Year}"
        },{
            axis : 1,
            name : 'City',
            value : "{City}"
        }],
        measures : [{
            name : 'Profit', // 'name' is used as label in the Legend
            value : '{profit}' // 'value' defines the binding for the displayed value
        }],
        data : {
            path : "/businessData"
        }
    });
    //Selection data
    var dataPoints = [{
        "data" : {
            Country : "Canada"

        }
    }, {
        "data" : {
            Country : "China"


        }
    }];
      var dataPointsResult = [{
        "data" : {
            Country : "Canada",
            Profit : -141.25,
            Year: "2001",
            City:"a"
        }
    }, {
        "data" : {
            Country : "China",
            Profit : 133.82,
            Year: "2002",
            City:"b"

        }
    }];
    //create a vizFrame
    var vizFrame = CommonUtil.createVizFrame();
    oDataset.setContext([{id: "Year"}, "City"]);
    vizFrame.setModel(oModel);
    vizFrame.setDataset(oDataset);

    // set feeds
    var aobjCountry = new AnalysisObject({
        uid : "Country",
        name : "Country",
        type : 'Dimension'
    }), aobjProfit = new AnalysisObject({
        uid : "Profit",
        name : "Profit",
        type : 'Measure'
    });
    var feedPrimaryValues = new FeedItem({
        uid : "primaryValues",
        type : 'Measure',
        values : [aobjProfit]
    }), feedAxisLabels = new FeedItem({
        uid : "axisLabels",
        type : 'Dimension',
        values : [aobjCountry]
    });
    vizFrame.addFeed(feedPrimaryValues);
    vizFrame.addFeed(feedAxisLabels);
    //select dataPoints

    vizFrame.placeAt("content");
    vizFrame.attachEventOnce('renderComplete', function() {
        vizFrame.vizSelection(dataPoints, {
            clearSelection : false
        });

        var  selections = vizFrame.vizSelection();


        selections.forEach(function(dp) {
            delete dp.data._context_row_number;
        });
        assert.equal(CommonUtil.arrayEqualIgnoreSequence(selections, dataPointsResult), true, "The selected data point is correct");

        //destroy control
        CommonUtil.destroyVizFrame(vizFrame);
        done();
    });
});

QUnit.test("VizFrame.vizSelectionTest with bubble context", function(assert) {
    assert.expect(1);
    var done = assert.async();
    var oModel = new JSONModel({
        businessData : ModelInfo.businessContextData
    });
    var oDataset = new FlattenedDataset({
        dimensions : [{
            axis : 1,
            name : 'Country',
            value : "{Country}"
        },{
            axis : 1,
            name : 'Year',
            value : "{Year}"
        },{
            axis : 1,
            name : 'City',
            value : "{City}"
        }],
        measures : [{
            name : 'Profit', // 'name' is used as label in the Legend
            value : '{profit}' // 'value' defines the binding for the displayed value
        },{
            name : 'Revenue', // 'name' is used as label in the Legend
            value : '{revenue}' // 'value' defines the binding for the displayed value
        },{
            name : 'Population', // 'name' is used as label in the Legend
            value : '{population}' // 'value' defines the binding for the displayed value
        }],
        data : {
            path : "/businessData"
        }
    });
    //Selection data
    var dataPoints = [{
        "data" : {
            Country : "Canada"

        }
    }, {
        "data" : {
            Country : "China"


        }
    }];
      var dataPointsResult = [{
        "data" : {
            Country : "Canada",
            Profit : -141.25,
            Year: "2001",
            City:"a",
            Revenue:410.87,
            Population:34789000
        }
    }, {
        "data" : {
            Country : "China",
            Profit : 133.82,
            Year: "2002",
            City:"b",
            Revenue:338.29,
            Population:1339724852

        }
    }];
    //create a vizFrame
    var vizType = 'info/bubble';
    var option = {
        viztype: vizType,

    };
    var vizFrame = CommonUtil.createVizFrame(option);
    oDataset.setContext([{id: "Year"}, "City"]);
    vizFrame.setModel(oModel);
    vizFrame.setDataset(oDataset);


    var feedPrimaryValues = new FeedItem({
        uid : "primaryValues",
        type : 'Measure',
        values : ["Profit"]
    }),
    feed2Values = new FeedItem({
        uid : "valueAxis2",
        type : 'Measure',
        values : ["Revenue"]
    }),
      feedWidth = new FeedItem({
        uid : "bubbleWidth",
        type : 'Measure',
        values : ["Population"]
    }),
     feedAxisLabels = new FeedItem({
        uid : "color",
        type : 'Dimension',
        values : ["Country"]
    });
    vizFrame.addFeed(feedPrimaryValues);
    vizFrame.addFeed(feedAxisLabels);
    vizFrame.addFeed(feed2Values);
     vizFrame.addFeed(feedWidth);
    //select dataPoints

    vizFrame.placeAt("content");
    vizFrame.attachEventOnce('renderComplete', function() {
        vizFrame.vizSelection(dataPoints, {
            clearSelection : false
        });

        var  selections = vizFrame.vizSelection();


        selections.forEach(function(dp) {
            delete dp.data._context_row_number;
        });
        assert.equal(CommonUtil.arrayEqualIgnoreSequence(selections, dataPointsResult), true, "The selected data point is correct");

        //destroy control
        CommonUtil.destroyVizFrame(vizFrame);
        done();
    });
});
/*
Test owner: Li, Amanda
Reviewer: Yang, tammy
Date: 2014/01/08
Description: Create a vizFrame, and it is not added into dom. the vizFrame is null, so vizContainer.save() is {}
steps: 1. Create vizFrame.
2. Save the viz instance
3. Verify the save json object. it should be {}.
*/
//QUnit.test("VizFrame.save",function(assert){
//	assert.expect(1);
//	var vizFrame = CommonUtil.createVizFrame();
//	vizFrame.placeAt("content");
//	 var saveJson = vizFrame.save();
//	 var expectResult = {};
//	 assert.deepEqual(saveJson, expectResult,"VizFrame is not created,the result of save() is empty. ");
//	 CommonUtil.destroyVizFrame(vizFrame);
//});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: setVizType() and getVizType()
 Check points: 1. Set viz type before vizFrame exists, then get viz type, check the viz type could be gotten.
 2. Set viz type after vizFrame exists, then get viz type, check the viz type could be gotten.
 steps: 	1. Create a VizFrame.
 2. Set viz type.
 3. Get viz type and verify.
 4. After the vizFrame is created.
 5. Set viz type.
 6. Get viz type and verify.
 7. Destroy vizFrame.
 */
/*
 QUnit.test('VizFrame.set/get VizType', function(assert) {
 assert.expect(5);
 var done = assert.async();
 var vizType = 'bar';
 var option = {viztype:vizType};
 var vizFrame = CommonUtil.createVizFrame(option);

 assert.equal(vizFrame.getVizType(),vizType,'The viz type is set to VizFrame and get synchronously.');
 //Show VizContainer to create vizFrame, then set and get viz type asynchronously
 vizFrame.placeAt('content');
 var callback = function(){
 vizFrame.detachEvent("initialized");
 vizType = 'line';
 vizFrame.setVizType(vizType);
 assert.equal(vizFrame.getVizType(),vizType,'The viz type is set to VizFrame and get asynchronously.');
 vizFrame.setVizType('column');
 assert.equal(vizFrame.getVizType(),'column','The viz type is set to VizFrame and get asynchronously.');
 CommonUtil.destroyVizFrame(vizFrame);
 done();
 };
 vizFrame.attachEvent("initialized", callback);
 });
 */

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: setVizProperties() and getVizProperties()
 Check points: 1. Set viz properties before vizFrame exists, then get viz properties, check the viz properties could be
gotten.
 2. Set viz properties after vizFrame exists, then get viz css, check the viz properties could be gotten and the new
properties is merged.
 steps: 	1. Create a vizFrame.
 2. Set viz properties.
 3. Get viz properties and verify.
 4. After the vizFrame is existed
 5. Set viz properties.
 6. Get viz properties and verify properties could be gotten and new properties is merged.
 7. Destroy vizFrame.
 */
QUnit.test('VizFrame.set/get VizProperties', function(assert) {
    assert.expect(6);
    var vizFrame = CommonUtil.createVizFrame();
    //Set and get viz properties synchronously
    var properties1 = VizProperty[0];
    var properties2 = VizProperty[1];
    var expectProperties = VizProperty[2];
    vizFrame.setVizProperties(properties1);
    var t1 = vizFrame.getVizProperties().title, t2 = properties1.title;
    assert.equal(t1.alignment, t2.alignment, "The alignment is set to vizFrame and get asynchronously");
    assert.equal(t1.text, t2.text, "The text is set to vizFrame and get asynchronously");
    assert.equal(t1.visible, t2.visible, "The visible is set to vizFrame and get asynchronously");

    //Show vizFrame to create vizFrame, then set and get viz css asynchronously TODO there's nothing async here?
    vizFrame.placeAt('content');

    vizFrame.detachEvent("renderComplete", arguments.callee); // TODO looks suspicious
    vizFrame.setVizProperties(properties2);
    t1 = vizFrame.getVizProperties().title, t2 = expectProperties.title;
    assert.equal(t1.alignment, t2.alignment, "The alignment is set to vizFrame and get asynchronously");
    assert.equal(t1.text, t2.text, "The text is set to vizFrame and get asynchronously");
    assert.equal(t1.visible, t2.visible, "The visible is set to vizFrame and get asynchronously");
    vizFrame.setVizProperties(properties1);
    CommonUtil.destroyVizFrame(vizFrame);
});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: addFeed(), destroyFeeds(), getFeeds()
 Check points: 1. Set feeds before vizFrame exists, then get feeds, check the feeds could be gotten.
 2. Set feeds after vizFrame exists, then get feeds, check the feeds could be gotten.
 steps: 	1. Create a VizFrame.
 2. Set feeds via addFeed() and destroyFeeds().
 3. Get feeds and verify.
 4. After the VizFrame is existed
 5. Set feeds.
 6. Get feeds and verify.
 7. Destroy VizFrame.
 */
QUnit.test('VizFrame.set/get Feeds', function(assert) {
    assert.expect(2);
    var analysisObjects = CommonUtil.createAnalysisObj([0, 1, 2, 3, 4, 5, 6]);

    var feeds1 = [new FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[0]]
    }), new FeedItem({
        'uid' : 'regionColor',
        'type' : 'Dimension',
        'values' : [analysisObjects[1]]
    }), new FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[2], analysisObjects[3]]
    })];
    var feeds2 = [new FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[4]]
    }), new FeedItem({
        'uid' : 'regionColor',
        'type' : 'Dimension',
        'values' : [analysisObjects[5]]
    }), new FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[6]]
    })];
    var option = {
        viztype : 'line'
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    //Set feeds before viz frame exists
    CommonUtil.setVizControlFeeds(vizFrame, feeds1);
    assert.ok(CommonUtil.compareFeedsUid(vizFrame.getFeeds(), feeds1), 'Before viz frame exist, the viz feeds is set to ViizFrame and get correctly.');

    vizFrame.placeAt('content');

    //Set feeds after viz frame exists
    CommonUtil.setVizControlFeeds(vizFrame, feeds2);
    assert.ok(CommonUtil.compareFeedsUid(vizFrame.getFeeds(), feeds2), 'After viz frame exist, the viz feeds is set to VizFrame and get correctly.');
    CommonUtil.destroyVizFrame(vizFrame);

});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: vizUpdate()
 Check points: 1. Create a VizFrame and set data and feeds, then update css, properties, feeds and data, verify all of
them could be updated
 steps: 	1. Create a VizFrame.
 2. Set feeds and data.
 3. After the vizFrame is existed
 4. Update css and verify css is updated.
 4. Update properties and verify properties is updated.
 5. Update feeds and verify feeds is updated..
 6. Update data and verify data is updated.
 7. Destroy VizFrame.
 */
QUnit.test('VizFrame.vizUpdate', function(assert) {
    assert.expect(5);
    var done = assert.async();
    var vizType = 'line';
    var option = {
        viztype : vizType
    };
    var vizFrame = CommonUtil.createVizFrame(option);

    var oModel1 = new JSONModel({
        businessData1 : ModelInfo.businessData
    });

    var oDataset1 = new FlattenedDataset('FrameDS1', {
        dimensions : [{
            name : 'Country',
            value : "{Country}"
        }],
        measures : [{
            name : 'Profit',
            value : '{profit}'
        }, {
            name : 'Revenue',
            value : '{revenue}'
        }],
        data : {
            path : "/businessData1"
        }
    });
    var oModel2 = new JSONModel({
        businessData2 : ModelInfo.businessData2
    });

    var oDataset2 = new FlattenedDataset('FrameDS2', {
        dimensions : [{
            name : 'Product',
            value : "{Product}"
        }, {
            name : 'City',
            value : "{City}"
        }],
        measures : [{
            name : 'Number',
            value : '{number}'
        }],
        data : {
            path : "/businessData2"
        }
    });
    var analysisObjects = [new AnalysisObject({
        'uid' : 'Product',
        'name' : 'Product',
        'type' : 'Dimension'
    }), new AnalysisObject({
        'uid' : 'Country',
        'name' : 'Country',
        'type' : 'Dimension'
    }), new AnalysisObject({
        'uid' : 'Profit',
        'name' : 'Profit',
        'type' : 'Measure'
    }), new AnalysisObject({
        'uid' : 'Revenue',
        'name' : 'Revenue',
        'type' : 'Measure'
    }), new AnalysisObject({
        'uid' : 'Country',
        'name' : 'Country',
        'type' : 'Dimension'
    }), new AnalysisObject({
        'uid' : 'City',
        'name' : 'City',
        'type' : 'Dimension'
    }), new AnalysisObject({
        'uid' : 'Number',
        'name' : 'Number',
        'type' : 'Measure'
    })];
    var feeds1 = [new FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[1]]
    }), new FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[2], analysisObjects[3]]
    })];
    var feeds2 = [new FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[0]]
    }), new FeedItem({
        'uid' : 'regionColor',
        'type' : 'Dimension',
        'values' : [analysisObjects[5]]
    }), new FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[6]]
    })];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    CommonUtil.setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt("content");

    var updateOptions1 = {
        css : '.v-background{fill:#FADCF7;} .v-body-title{fill:#6B4D2C;} .v-body-label{fill:#11D3F5;}'
    };

    var updateOptions2 = {
        properties : {
            title : {
                visible : true,
                text : 'title1',
                alignment : "left"
            }
        },
        feeds : feeds2
    };

    var updateOptions3 = {
        data : oDataset2
    };

    vizFrame.attachEventOnce('renderComplete', function() {
    	setTimeout(function(){
            var t1 = vizFrame.getVizProperties().title;
            var t2 = updateOptions2.properties.title;
            assert.equal(t1.alignment, t2.alignment, "The alignment is set to vizFrame and get asynchronously");
            assert.equal(t1.text, t2.text, "The text is set to vizFrame and get asynchronously");
            assert.equal(t1.visible, t2.visible, "The visible is set to vizFrame and get asynchronously");
            assert.ok(CommonUtil.compareFeedsUid(vizFrame.getFeeds(), updateOptions2.feeds), 'The feeds is updated.');
            assert.equal(vizFrame.getDataset().sId, 'FrameDS2', 'The data is updated.');
            CommonUtil.destroyVizFrame(vizFrame);
            done();
    	}, 1000);
        //Update css only
        vizFrame.vizUpdate(updateOptions1);
        //Update properties and feeds
        vizFrame.vizUpdate(updateOptions2);
        //Update data
        vizFrame.vizUpdate(updateOptions3);
        vizFrame.setModel(oModel2);
    });
});


/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: getVizUid()
 Check points: 1. Before vizFrame exists, the getVizUid() is null.
 2. After vizFrame exists, the getVizUid() is existed
 steps: 	1. Create a VizFrame.
 2. Check the UID is null.
 3. After the vizFrame is created.
 4. Check the UID .
 5. Destroy vizFrame.
 */
QUnit.test('VizFrame.getVizUid', function(assert) {
    assert.expect(2);
    var vizFrame = CommonUtil.createVizFrame();

    assert.notEqual(vizFrame.getVizUid(), null, 'The vizUid is null and get synchronously.');

    //Show VizContainer to create vizFrame, then get vizUid asynchronously
    vizFrame.placeAt('content');
    assert.notEqual(vizFrame.getVizUid(), null, 'The vizUid is not null and get asynchronously.');
    CommonUtil.destroyVizFrame(vizFrame);
});

/*
Test owner: Amy Li
Reviewer: Amanda Li
Date: 2014/10/13
Description: Test sap.viz.ui5.VizFrame: setVizScales() and getVizScales()
Check points: 1. Set scales before vizFrame render completed, then get scales, check the scales could be gotten.
                        2. Set scales after vizFrame render completed, then get scales, check the scales could be gotten.
Steps: 1. create a vizframe
              2. Set scales via setVizScales().
              3. Get scales and verify.
              4. After the VizFrame is existed
              5. Set scales.
              6. Get scales and verify.
              7. Clear scales and verify.
              8. Destroy VizFrame.
*/
QUnit.test('VizFrame.set/get VizScales', function(assert) {
     assert.expect(4);
     var done = assert.async();
     var vizType = 'line';
     var option = {
         viztype : vizType
     };
     var vizFrame = CommonUtil.createVizFrame(option);

     var oModel1 = new JSONModel({
         businessData1 : ModelInfo.businessData
     });

     var oDataset1 = new FlattenedDataset('FrameDSViz', {
         dimensions : [{
             name : 'Country',
             value : "{Country}"
         }],
         measures : [{
             name : 'Profit',
             value : '{profit}'
         }, {
             name : 'Revenue',
             value : '{revenue}'
         }],
         data : {
             path : "/businessData1"
         }
     });
     var analysisObjects = [new AnalysisObject({
         'uid' : 'Product',
         'name' : 'Product',
         'type' : 'Dimension'
     }), new AnalysisObject({
         'uid' : 'Country',
         'name' : 'Country',
         'type' : 'Dimension'
     }), new AnalysisObject({
         'uid' : 'Profit',
         'name' : 'Profit',
         'type' : 'Measure'
     }), new AnalysisObject({
         'uid' : 'Revenue',
         'name' : 'Revenue',
         'type' : 'Measure'
     }), new AnalysisObject({
         'uid' : 'Country',
         'name' : 'Country',
         'type' : 'Dimension'
     }), new AnalysisObject({
         'uid' : 'City',
         'name' : 'City',
         'type' : 'Dimension'
     }), new AnalysisObject({
         'uid' : 'Number',
         'name' : 'Number',
         'type' : 'Measure'
     })];
     var feeds1 = [new FeedItem({
         'uid' : 'axisLabels',
         'type' : 'Dimension',
         'values' : [analysisObjects[1]]
     }), new FeedItem({
         'uid' : 'primaryValues',
         'type' : 'Measure',
         'values' : [analysisObjects[2], analysisObjects[3]]
     })];
     vizFrame.setModel(oModel1);
     vizFrame.setDataset(oDataset1);
     CommonUtil.setVizControlFeeds(vizFrame, feeds1);
     //Set and get viz scales synchronously
     var scales = [{
        feed : 'color',
        palette : ['#ff0000']
     }];
     vizFrame.setVizScales(scales);
     assert.deepEqual(vizFrame.getVizScales()[0], scales[0], "The scale is set to vizFrame before vizFrame render Completed");
     vizFrame.placeAt('content');
     //add vizFrame to dom, then set and get viz scales asynchronously
     vizFrame.attachEventOnce('renderComplete', function setScales() {
         assert.deepEqual(vizFrame.getVizScales()[0], scales[0], "The scale is set to vizFrame after vizFrame render Completed");
         scales = [{
            feed : 'color',
            palette : ['black']
         }];
         vizFrame.setVizScales(scales);
         vizFrame.detachRenderComplete(setScales);
         vizFrame.attachEventOnce('renderComplete', null, resetScales);
     });
     function resetScales() {
         assert.deepEqual(vizFrame.getVizScales()[0], scales[0], "The scale is reset to vizFrame after vizFrame render Completed");
         vizFrame.detachRenderComplete(resetScales);
         vizFrame.attachEventOnce('renderComplete', null, clearColorScales);
         vizFrame.setVizScales([], {level: "user", replace: true});
     }
     function clearColorScales() {
         scales = [{
             feed : 'color',
             palette : ["sapUiChartPaletteQualitativeHue1","sapUiChartPaletteQualitativeHue2","sapUiChartPaletteQualitativeHue3",
             "sapUiChartPaletteQualitativeHue4","sapUiChartPaletteQualitativeHue5","sapUiChartPaletteQualitativeHue6",
             "sapUiChartPaletteQualitativeHue7","sapUiChartPaletteQualitativeHue8","sapUiChartPaletteQualitativeHue9",
             "sapUiChartPaletteQualitativeHue10","sapUiChartPaletteQualitativeHue11",
            "sapUiChartPaletteQualitativeHue12",
            "sapUiChartPaletteQualitativeHue13",
            "sapUiChartPaletteQualitativeHue14",
            "sapUiChartPaletteQualitativeHue15",
            "sapUiChartPaletteQualitativeHue16",
            "sapUiChartPaletteQualitativeHue17",
            "sapUiChartPaletteQualitativeHue18",
            "sapUiChartPaletteQualitativeHue19",
            "sapUiChartPaletteQualitativeHue20",
            "sapUiChartPaletteQualitativeHue21",
            "sapUiChartPaletteQualitativeHue22"],
             type: 'color'
         }];
         assert.deepEqual(vizFrame.getVizScales()[0], scales[0], "The scale is set to vizFrame after vizFrame render Completed");
         vizFrame.detachRenderComplete(clearColorScales);
         CommonUtil.destroyVizFrame(vizFrame);
         done();
     }
});

QUnit.test('VizFrame.zoom', function(assert) {
    assert.expect(16);
    var done = assert.async();
    var vizType = 'line';
    var option = {
        viztype: vizType
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    vizFrame.setVizProperties({
        interaction: {
            zoom: {
                enablement: "enabled"
            }
        }
    });
    var oModel1 = new JSONModel({
        businessData1: ModelInfo.businessData
    });

    var oDataset1 = new FlattenedDataset('FrameDSZoomTest', {
        dimensions: [{
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Profit',
            value: '{profit}'
        }, {
            name: 'Revenue',
            value: '{revenue}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var analysisObjects = [new AnalysisObject({
        'uid': 'Product',
        'name': 'Product',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'Profit',
        'name': 'Profit',
        'type': 'Measure'
    }), new AnalysisObject({
        'uid': 'Revenue',
        'name': 'Revenue',
        'type': 'Measure'
    }), new AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'City',
        'name': 'City',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'Number',
        'name': 'Number',
        'type': 'Measure'
    })];
    var feeds1 = [new FeedItem({
        'uid': 'axisLabels',
        'type': 'Dimension',
        'values': [analysisObjects[1]]
    }), new FeedItem({
        'uid': 'primaryValues',
        'type': 'Measure',
        'values': [analysisObjects[2], analysisObjects[3]]
    })];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    CommonUtil.setVizControlFeeds(vizFrame, feeds1);

    vizFrame.placeAt('content');

    var view, plot, viewSize, plotSize, offset, zoomInfo;
    vizFrame.attachEventOnce("_zoomDetected", null, checkZoomInEvent);
    function checkZoomInEvent() {
        zoomInfo = vizFrame._getZoomInfo();
        assert.equal(zoomInfo.enabled, true, "The chart supports zoom");
        assert.equal(zoomInfo.currentZoomLevel, 0, "The chart can't zoom out");
        vizFrame.detachEvent("_zoomDetected", checkZoomInEvent);
        vizFrame.zoom({
            direction: "in"
        });
        vizFrame.attachEventOnce("_zoomDetected", null, checkZoomInInfo);
    }
    function checkZoomInInfo(e) {
        zoomInfo = vizFrame._getZoomInfo();
        assert.ok(zoomInfo.currentZoomLevel > 0, "The chart zoom in");
        var oParameters = e.getParameters();
        assert.equal(oParameters.name, "_zoomDetected", "The event name is right");
        assert.ok(oParameters.data.currentZoomLevel > 0, "The data of event is right");

        view = document.querySelector("#content .v-plot-bound");
        plot = document.querySelector("#content .v-plot-main");
        viewSize = view.getBBox();
        plotSize = plot.getBBox();
        offset = getTransformToElement(plot, view);

        assert.ok(plotSize.width > viewSize.width, "Plot is larger after zoom in");
        assert.ok(offset.e < 0, "Plot's top-left corner is translated off view to keep plot centered");
        vizFrame.detachEvent("_zoomDetected", checkZoomInInfo);
        vizFrame.attachEventOnce("_zoomDetected", null, checkZoomOutInfo);
        vizFrame.zoom({
            direction: "out"
        });
    }
    function checkZoomOutInfo() {
        zoomInfo = vizFrame._getZoomInfo();
        assert.equal(zoomInfo.currentZoomLevel, 0, "The chart can't zoom out");
        view = document.querySelector("#content .v-plot-bound");
        plot = document.querySelector("#content .v-plot-main");
        viewSize = view.getBBox();
        plotSize = plot.getBBox();
        offset = getTransformToElement(plot, view);

        assert.ok(Math.ceil(plotSize.width) === Math.ceil(viewSize.width) && Math.ceil(plotSize.height) === Math.ceil(viewSize.height), "Plot is smaller after zoom out");
        assert.ok(Math.ceil(offset.f) === 0 && Math.ceil(offset.e) === 0, "Plot's top-left corner is translated back to keep plot centered");
        vizFrame.detachEvent("_zoomDetected", checkZoomOutInfo);
        vizFrame.attachEventOnce("_zoomDetected", null, checkNoZoomChart);
        vizFrame.setVizType("info/pie");
    }

    function checkNoZoomChart(e) {
        zoomInfo = vizFrame._getZoomInfo();
        assert.equal(zoomInfo.enabled, false, "The chart doesn't support zoom");
        assert.equal(zoomInfo.currentZoomLevel, null, "The chart Level is null when chart can't zoom ");
        var oParameters = e.getParameters();
        assert.equal(oParameters.name, "_zoomDetected", "The event name is right");
        assert.equal(zoomInfo.currentZoomLevel, null, "The chart Level is null when chart can't zoom ");
        vizFrame.detachEvent("_zoomDetected", checkNoZoomChart);
        vizFrame.attachEventOnce("renderComplete", null, checkZoomInfo);
        vizFrame.setVizType("info/line");
        vizFrame.setVizProperties({
            interaction: {
                zoom: {
                    enablement: "disabled"
                }
            }
        });
    }
    function checkZoomInfo() {
        zoomInfo = vizFrame._getZoomInfo();
        assert.equal(zoomInfo.enabled, false, "The chart can't zoom after set zooming disabled");
        assert.equal(zoomInfo.currentZoomLevel, null, "The chart Level is null when chart can't zoom ");
        vizFrame.detachRenderComplete(checkZoomInfo);
        CommonUtil.destroyVizFrame(vizFrame);
        done();
    }
});

QUnit.test("dataset.invalidate", function(assert) {
    var done = assert.async();
    var vizType = 'line';
    var option = {
        viztype: vizType
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    vizFrame.setVizProperties({
        interaction: {
            zoom: {
                enablement: "enabled"
            }
        }
    });
    var oModel1 = new JSONModel({
        businessData1: ModelInfo.businessData
    });

    var oDataset1 = new FlattenedDataset('FrameDSUpdateTest', {
        dimensions: [{
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Profit',
            value: '{profit}'
        }, {
            name: 'Revenue',
            value: '{revenue}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var analysisObjects = [new AnalysisObject({'uid': 'Product', 'name': 'Product', 'type': 'Dimension'}),
                           new AnalysisObject({'uid': 'Country', 'name': 'Country', 'type': 'Dimension'}),
                           new AnalysisObject({'uid': 'Profit', 'name': 'Profit', 'type': 'Measure'}),
                           new AnalysisObject({'uid': 'Revenue', 'name': 'Revenue', 'type': 'Measure'}),
                           new AnalysisObject({'uid': 'Country', 'name': 'Country', 'type': 'Dimension'}),
                           new AnalysisObject({'uid': 'City', 'name': 'City', 'type': 'Dimension'}),
                           new AnalysisObject({'uid': 'Number', 'name': 'Number', 'type': 'Measure'})];
    var feeds1 = [new FeedItem({'uid': 'axisLabels', 'type': 'Dimension', 'values': [analysisObjects[1]]}),
                  new FeedItem({'uid': 'primaryValues', 'type': 'Measure', 'values': [analysisObjects[2], analysisObjects[3]]})];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    CommonUtil.setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt('content');
    vizFrame.attachEvent("renderComplete", function() {
        oDataset1.invalidate();
        assert.ok(vizFrame._invalidateDataset, "invalidate Dataset marks vizFrame._invalidateDataset flag");
        CommonUtil.destroyVizFrame(vizFrame);
        done();
    });

});


function getChartTitle(){
    return document.querySelector(".viz-title-label").textContent;
}

function testSetViz(applicationSet, assert) {
    var done = assert.async();
    assert.expect(16);
    var vizType = 'info/line';
    var option = {
        viztype: vizType,
        uiConfig: {
            'applicationSet': applicationSet
        }
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    var oModel1 = new JSONModel({
        businessData1: ModelInfo.businessData
    });
    var oDataset1 = new FlattenedDataset('FrameDSZoomTest', {
        dimensions: [{
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Profit',
            value: '{profit}'
        }, {
            name: 'Revenue',
            value: '{revenue}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var analysisObjects = [new AnalysisObject({
        'uid': 'Product',
        'name': 'Product',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'Profit',
        'name': 'Profit',
        'type': 'Measure'
    }), new AnalysisObject({
        'uid': 'Revenue',
        'name': 'Revenue',
        'type': 'Measure'
    }), new AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'City',
        'name': 'City',
        'type': 'Dimension'
    }), new AnalysisObject({
        'uid': 'Number',
        'name': 'Number',
        'type': 'Measure'
    })];
    var feeds1 = [new FeedItem({
        'uid': 'axisLabels',
        'type': 'Dimension',
        'values': [analysisObjects[1]]
    }), new FeedItem({
        'uid': 'primaryValues',
        'type': 'Measure',
        'values': [analysisObjects[2], analysisObjects[3]]
    })];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    CommonUtil.setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt('content');
    var chatType, chartTitle;
    var step = 0;
    vizFrame.attachEvent('renderComplete', function() {
        if (step === 0) {
            chatType = this._vizFrame.type();
            assert.equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            assert.equal(chartTitle, "Title of Chart", "the default chart title");

            var userProp = {
                "title": {
                    "text": "apple",
                    "visible": true
                }
            };
            vizFrame.setVizProperties(userProp);
        } else if (step === 1) {
            chartTitle = getChartTitle();
            assert.equal(chartTitle, "apple", "user-defined title");
            vizFrame.setVizType('info/column');
        } else if (step === 2) {
            chatType = this._vizFrame.type();
            assert.equal(chatType, "info/column", "chart type check");

            chartTitle = getChartTitle();
            assert.equal(chartTitle, "apple", "user-defined title");
            vizFrame.setVizType('info/line');
        } else if (step ===3){
            chatType = this._vizFrame.type();
            assert.equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            assert.equal(chartTitle, "apple", "user-defined title");
            vizFrame.setVizType('info/dual_stacked_bar');
        } else if (step === 4) {
            chatType = this._vizFrame.type();
            assert.equal(chatType, "info/dual_stacked_bar", "chart type check");

            //the valueAxis color of dual_stacked_bar chart  is different than non-dual charts.
            var valueAxisColor = vizFrame.getVizProperties().valueAxis.color;
            assert.equal(CommonUtil.unifyHexNotation(valueAxisColor), "sapUiChartPaletteSequentialHue1Dark1", "valueAxis color check");

            chartTitle = getChartTitle();
            assert.equal(chartTitle, "apple", "user-defined title");
            sap.ui.getCore().applyTheme("sap_hcb");
        } else if (step === 5) {
            vizFrame.setVizType('info/line');
        } else if (step === 6) {
            chatType = this._vizFrame.type();
            assert.equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            assert.equal(chartTitle, "apple", "user-defined title");

            var valueAxisColor = vizFrame.getVizProperties().valueAxis.color;
            assert.equal(CommonUtil.unifyHexNotation(valueAxisColor), "#ffffff" , "valueAxis color check");

            var chartTitleColor = vizFrame.getVizProperties().title.style.color;
            assert.equal(CommonUtil.unifyHexNotation(chartTitleColor), "#ffffff", "high contrast theme applied");
            sap.ui.getCore().applyTheme("sap_bluecrystal");
        } else {
            chatType = this._vizFrame.type();
            assert.equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            assert.equal(chartTitle, "apple", "user-defined title");
            CommonUtil.destroyVizFrame(vizFrame);
            done();
        }
        step++;
    });
}

QUnit.test('vizFrame.setVizType', testSetViz.bind(null, "fiori"));
QUnit.test('vizFrame.setVizType without applicationSet', testSetViz.bind(null, null));

QUnit.test("dataset.emptydataerr", function(assert) {
    var done = assert.async();
    var vizType = 'timeseries_column';
    var option = {
        viztype: vizType
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    var amModel = new JSONModel({
      "milk": [{
        "Date": "1/1/2015",
        "Actual": 385000.00,
        "Forecast": 450000.22
    },
    {
        "Date": "7/1/2015",
        "Actual": 500.00,
        "Forecast": 450.22
    }]
    });
       //A Dataset defines how the model data is mapped to the chart
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType:'date'
        }],
        measures: [{
            name: 'Actual',
            value: '{Actual}'
        },{
            name: 'Forecast',
            value: '{Forecast}'
        }],
        data: {
           // path: "/milk"
        }
    });

    vizFrame.setDataset(oDataset);
    vizFrame.setModel(amModel);

     //set feeds
    var  feeds1 = [new FeedItem({
        'uid': "timeAxis",
        'type': "Dimension",
        'values': ["Date"]
        }), new FeedItem({
        'uid': "valueAxis",
        'type': "Measure",
        'values': ["Forecast"]
    })];

    CommonUtil.setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt('content');
    vizFrame.attachEventOnce("renderComplete", emptyDataCheck);

    function emptyDataCheck() {
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-title").text(), "No data", "Empty data message shows right");
        vizFrame.detachEvent("renderFail", emptyDataCheck);
        sap.ui.getCore().attachThemeChanged(checkThemeBelize);
        sap.ui.getCore().applyTheme("sap_belize");
    }

    function checkThemeBelize() {
        var message$ = vizFrame.$().find(".ui5-viz-controls-viz-description-message");
        var title$ = vizFrame.$().find(".ui5-viz-controls-viz-description-title");
        var detail$ = vizFrame.$().find(".ui5-viz-controls-viz-description-detail");
        var messageColor = message$.css('color');
        assert.ok(messageColor === title$.css('color') && messageColor === detail$.css('color') &&
            messageColor === "rgb(51, 51, 51)", "error message color should be #333333 in belize theme");
        assert.ok(title$.css('font-weight') === '400' &&
            title$.css('font-weight') === message$.css('font-weight'), "error message font-weight should be regular in belize theme");
        assert.ok(title$.css('font-size') === '16px' &&
            detail$.css('font-weight') === message$.css('font-weight'), "error message font-size should be correct in belize theme");

        sap.ui.getCore().detachThemeChanged(checkThemeBelize);
        sap.ui.getCore().attachThemeChanged(checkThemeHcb);
        sap.ui.getCore().applyTheme("sap_hcb");
    }

    function checkThemeHcb() {
        var message$ = vizFrame.$().find(".ui5-viz-controls-viz-description-message");
        var title$ = vizFrame.$().find(".ui5-viz-controls-viz-description-title");
        var detail$ = vizFrame.$().find(".ui5-viz-controls-viz-description-detail");
        var messageColor = message$.css('color');
        assert.ok(messageColor === title$.css('color') && messageColor === detail$.css('color') &&
            messageColor === "rgb(255, 255, 255)", "error message color should be #ffffff in hcb theme");
        assert.ok(title$.css('font-weight') === '400' &&
            title$.css('font-weight') === message$.css('font-weight'), "error message font-weight should be regular in hcb theme");
        assert.ok(title$.css('font-size') === '16px' &&
            detail$.css('font-weight') === message$.css('font-weight'), "error message font-size should be correct in belize theme");

        sap.ui.getCore().detachThemeChanged(checkThemeHcb);
        CommonUtil.destroyVizFrame(vizFrame);
        done();
    }
});

QUnit.test("dataset.invalidataerr", function(assert) {
    var done = assert.async();
    var vizType = 'timeseries_column';
    var option = {
        viztype: vizType
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    var amModel = new JSONModel({
      "milk": [{
        "Date": "1/1/2015",
        "Actual": 385000.00,
        "Forecast": 450000.22
    },
    {
        "Date": "1/1/2015",
        "Actual": 500.00,
        "Forecast": 450.22
    }]
    });
    var oDataset = new FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType:'date'
        }],
        measures: [{
            name: 'Actual',
            value: '{Actual}'
        },{
            name: 'Forecast',
            value: '{Forecast}'
        }],
        data: {
            path: "/milk"
        }
    });

    vizFrame.setDataset(oDataset);
    vizFrame.setModel(amModel);

     //set feeds
    var  feeds1 = [new FeedItem({
        'uid': "timeAxis",
        'type': "Dimension",
        'values': ["Date"]
        }), new FeedItem({
        'uid': "valueAxis",
        'type': "Measure",
        'values': ["Forecast"]
    })];

    CommonUtil.setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt('content');
var popOver =	 new Popover({});
    popOver.connect(vizFrame.getVizUid());
    vizFrame.attachEventOnce("renderFail", checkMessage);
    function checkMessage() {
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-title").text(), "Invalid data", "Invalid data message shows right");
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-detail").text(), "The dataset does not match the selected time levels.", "Description of invalid data message shows right");
        assert.ok(vizFrame._connectPopover, "The popOver should always connect to the vizFrame");
        vizFrame.detachEvent("renderFail", checkMessage);

        vizFrame.attachEventOnce("renderFail", null, setLocal);
        sap.ui.getCore().getConfiguration().setLanguage("fr");
    }

    function setLocal() {
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-title").text(), "Données non valides", "Error message shows right after localization");
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-detail").text(), "Le jeu de données ne correspond pas aux niveaux temporels sélectionnés.", "Description of error message shows right after localization");
        vizFrame.detachEvent("renderFail", setLocal);
        vizFrame.attachEventOnce("renderComplete", null, switchChartType);
        vizFrame.setVizType("bar");
    }
    function switchChartType() {
        assert.ok(document.querySelectorAll(".v-datapoint").length > 0, "Chart is rendered when switch chart type");
        assert.equal(document.querySelectorAll(".v-info").length, 1, "Chart place is right when switch chart type.");
        assert.ok(vizFrame._connectPopover, "The popOver should always connect to the vizFrame");
        vizFrame.detachRenderComplete(switchChartType);
        vizFrame.attachEventOnce("renderFail", null, switchChartType2);
        vizFrame.setVizType("timeseries_column");
    }
    function switchChartType2() {
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-title").text(), "Données non valides", "Error message shows right when switch chart type agin");
        assert.equal(this.$().find(".ui5-viz-controls-viz-description-detail").text(), "Le jeu de données ne correspond pas aux niveaux temporels sélectionnés.", "Description of error message shows right");
        vizFrame.detachEvent("renderFail",switchChartType2);
        vizFrame.attachEventOnce("renderComplete", null, switchChartType3);
        vizFrame.setVizType("bar");
    }
    function switchChartType3() {
        assert.ok(document.querySelectorAll(".v-datapoint").length > 0, "Chart is rendered when switch chart chart type agin.");
        assert.equal(document.querySelectorAll(".v-info").length, 1, "Chart place is correct when switch chart chart type agin.");
        vizFrame.detachRenderComplete(switchChartType3);
        sap.ui.getCore().getConfiguration().setLanguage("en");
        CommonUtil.destroyVizFrame(vizFrame);
        done();
    }

});

//as the bullet chart is the most complex, the follwings use bullet chart to test the function
QUnit.test("dataset.exportToSVGString", function(assert) {
    var done = assert.async();
    var option = {
        viztype: 'bullet'
    };
    var vizFrame = CommonUtil.createVizFrame(option);
    vizFrame.setVizProperties({
        plotArea: {
          colorPalette: ['sapUiChartPaletteSemanticNeutralDark1'],
          gap: {
            visible: true,
            type: "negative",
            negativeColor: 'sapUiChartPaletteSemanticBad'
          }
        }
    });
    var oModel = new JSONModel({
        milk : bulletModelInfo.milk
    });
    var oDataset = new FlattenedDataset({
        // a Bar Chart requires exactly one dimension (x-axis)
        'dimensions' : [{
            'name' : 'Store Name',
            'value' : "{Store Name}"
        }],
        // it can show multiple measures, each results in a new set of bars in a new color
        'measures' : [
        {
           'name' : 'Revenue', // 'name' is used as label in the Legend
           'value' : '{Revenue}' // 'value' defines the binding for the displayed value
        },{
           'name' : 'Additional Revenue',
           'value' : '{Additional Revenue}'
        }, {
           'name' : 'Forecast',
           'value' : '{Forecast}'
        }, {
           'name': "Target",
           'value': "{Target}"
        }, {
           'name': 'Revenue2',
           'value': '{Revenue2}'
        }, {
           'name': 'Additional Revenue2',
           'value': '{Additional Revenue2}'
        }, {
           'name': "Forecast2",
           'value': "{Forecast2}"
        }, {
           'name': "Target2",
           'value': "{Target2}"
        }],
        // 'data' is used to bind the whole data collection that is to be displayed in the chart
        'data' : {
           'path' : "/milk"
        }
      });
      vizFrame.setDataset(oDataset)
      vizFrame.setModel(oModel);

      // set feeds
      var feedPrimaryValues = new FeedItem({
        'uid' : "actualValues",
        'type' : "Measure",
        'values' : ["Revenue"]
      }), feedAxisLabels = new FeedItem({
        'uid' : "categoryAxis",
        'type' : "Dimension",
        'values' : ["Store Name"]
      }),feedTargetValues = new FeedItem({
        'uid' : "targetValues",
        'type' :"Measure",
        'values' : ["Target"]
      });

      vizFrame.addFeed(feedPrimaryValues);
      vizFrame.addFeed(feedAxisLabels);
      vizFrame.addFeed(feedTargetValues);

      vizFrame.placeAt('content');
      var emptySVG = vizFrame.exportToSVGString();
      assert.equal(emptySVG,"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\"/>");
      vizFrame.attachEvent("renderComplete", function() {
        //an empty <defs>, v-m-action-layer-group, v-m-decoration-layer-group, v-m-backgroup
        //v-m-title, v-m-legendgroup, v-m-mian, defs-diagonalhatch.
        var svgResult = $($.parseHTML(vizFrame.exportToSVGString()));
        var svgResultLength = svgResult.children().length;
        var mainChild = svgResult.find(".v-m-main").children().length;
        assert.equal(svgResultLength,9);

        //hideTitleLegend = true,v-m-tile and v-m-legendgroup will be removed
        svgResultLength = $($.parseHTML(vizFrame.exportToSVGString({hideTitleLegend:true}))).children().length;
        assert.equal(svgResultLength,7);

        //hideAxis = true, v-m-main.v-m-yAxis, v-m-main.v-m-yAxis2, v-m-main.v-m-xAxis, v-m-main.v-m-xAxis2, v-m-main.v-m-zAxis
        //but in this case only move v-m-yAxis and v-m-xAxis2
        var svgResult = $($.parseHTML(vizFrame.exportToSVGString({width:400,height:400,hideTitleLegend:true,hideAxis:true})));
        var width = svgResult.attr("width");
        var height  = svgResult.attr("height");
        svgResultLength = svgResult.children().length;
        mainChild -= svgResult.find(".v-m-main").children().length;
        assert.equal(width,400);
        assert.equal(height,400);
        assert.equal(svgResultLength,7);
        assert.equal(mainChild,2);
        CommonUtil.destroyVizFrame(vizFrame);
        done();
      });


QUnit.test("Calculated Fields by formatter function", function(assert) {
      var done = assert.async();
      assert.ok(true, "a1m1");
      var startTime = 1420240200000;
      var initOptions = {
        "vizType":'timeseries_line',
        "uiConfig": {
        "applicationSet": "fiori"
      }};
      var vizframe = new VizFrame(initOptions);
      var model = new JSONModel({
          "businessData": [
             {"Date" : 1420070400000, actual: 200, forecast: 210},
             {"Date" : 1420156800000, actual: 220, forecast: 240},
             {"Date" : 1420243200000, actual: 150, forecast: 260},
             {"Date" : 1420329600000, forecast: 300},
             {"Date" : 1420416000000, forecast: 330}
          ]
      });
      var dataset = new FlattenedDataset({
         dimensions : [{"name": "Date", "value": "{Date}", "dataType": "date"}],
         measures : [ {name: 'Actual', value: "{actual}"}, {name: 'Forecast', value: "{forecast}"},{
            name : "Profit",
            value : {
                parts:[ {path:"Date"}, {path: "actual"}, {path: "forecast"}],
                formatter : function(values) {
                    if(values && values.length > 1){
                      if(values[0] < startTime){
                          return values[1];
                      }else{
                          return values[2];
                      }
                    }else{
                        return values;
                    }
                }
            }
          } ],
          "data": {
              "path": "/businessData"
          }
      });
      vizframe.setModel(model);
      vizframe.setDataset(dataset);
      dataset.setContext([{
        id: 'Actual'
      },{
        id: 'Forecast'
      }]);
      var feeds =[
        new FeedItem({"uid":"timeAxis","type":"Dimension","values":["Date"]}),
        new FeedItem({"uid":"valueAxis","type":"Measure","values":["Profit"]})
      ];
      feeds.forEach(function(feedItem) {
          vizframe.addFeed(feedItem);
      });
      vizframe.placeAt("content");
      vizframe.attachEventOnce('renderComplete', function() {
        assert.ok(true, 'Time Line chart is renderComplete.');
        var ds = dataset.getVIZFlatDataset();
        assert.deepEqual(ds.measures(), ["Profit"], "Only Profit is binded.");
        assert.equal(ds.data().metadata.fields.length, 4, "Has bounded measures.");
        assert.deepEqual(ds.data().data[0], [1420070400000, 200, 210, 200], "Profit should be Actual.");
        assert.deepEqual(ds.data().data[2], [1420243200000, 150, 260, 260], "Profit should be Forecast.");
        assert.deepEqual(ds.data().data[4], [1420416000000, null, 330, 330], "Profit should be Forecast.");

        CommonUtil.destroyVizFrame(vizframe);
        done();
      });

    });


QUnit.test("find Context", function(assert) {
        var done = assert.async();
        var oModel = new JSONModel({
            businessData : ModelInfo.businessData
        });
        var oDataset = new FlattenedDataset({
            dimensions : [ {
                axis : 1,
                name : 'Country',
                value : "{Country}"
            } ],
            measures : [ {
                name : 'Profit', // 'name' is used as label in the Legend
                value : '{profit}' // 'value' defines the binding for the displayed value
            } ],
            data : {
                path : "/businessData"
            }
        });
        //create a vizFrame
        var vizFrame = CommonUtil.createVizFrame();

        vizFrame.setModel(oModel);
        vizFrame.setDataset(oDataset);

        // set feeds
        var aobjCountry = new AnalysisObject(
                {
                    uid : "Country",
                    name : "Country",
                    type : "Dimension"
                }), aobjProfit = new AnalysisObject(
                {
                    uid : "Profit",
                    name : "Profit",
                    type : "Measure"
                });
        var feedPrimaryValues = new FeedItem(
                {
                    uid : "primaryValues",
                    type : "Measure",
                    values : [ aobjProfit ]
                }), feedAxisLabels = new FeedItem(
                {
                    uid : "axisLabels",
                    type : "Dimension",
                    values : [ aobjCountry ]
                });
        vizFrame.addFeed(feedPrimaryValues);
        vizFrame.addFeed(feedAxisLabels);
        vizFrame.placeAt("content");
        var oSelect = {
            data : {
                Country : "Canada",
                profit : -141.25,
                population : 34789000,
                _context_row_number : 0
            }
        };
        var oContext = vizFrame.getDataset().findContext(oSelect.data);
        assert.equal(oContext, null,
                'Before redering chart, the context value is undefined');
        vizFrame.attachEvent('renderComplete', function onRenderComplete(event) {
            vizFrame.detachEvent('renderComplete', onRenderComplete);
            oContext = vizFrame.getDataset().findContext(oSelect.data);
            var expectObj = {
                Country : "China",
                revenue : 338.29,
                profit : 133.82,
                population : 1339724852
            };
            assert.equal(oContext.sPath, "/businessData/0",
                    'the context spath is correct');
            var businessData = oContext.getProperty('/businessData/1');
            assert.deepEqual(businessData, expectObj,
                    'the one data point is correct');
            CommonUtil.destroyVizFrame(vizFrame);
            done();
        });
    });

});

QUnit.start();

});

