/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/VizContainer",
	"sap/viz/ui5/controls/common/feeds/AnalysisObject",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/model/json/JSONModel",
	"test-resources/sap/viz/qunit/controls/CommonUtil"
], function(VizContainer, AnalysisObject, FeedItem, FlattenedDataset, JSONModel, CommonUtil) {

	/**
	 * Destroy the created vizcontainer.
	 * @param {obj} _vizContainer
	 *
	 */
var destroyVizContainer = function(_vizContainer) {
	if (_vizContainer) {
		_vizContainer.destroy();
	}
};

 QUnit.module("VizContainer");

 /*
 Test owner: Sandy Zheng 
 Reviewer: Amanda Li
 Date: 2014/1/8
 Description: Test VizContainer.setWidth() and VizContainer.getWidth
 Check points: set/get width of container works fine
 steps: 1.Create a vizContainer and set the width.
 */
 QUnit.test("VizContainer.setWidth/getWidth ", function(assert){
	 var oVizContainer = new VizContainer({
		 uiConfig:  {
					'layout' : 'horizontal',
					'enableMorphing' : true
		 }
     });
	oVizContainer.setWidth('200px'); 
	assert.equal(oVizContainer.getWidth(), '200px', "setWidth/getWidth pass");
	oVizContainer.destroy();
 });
 
 /*
 Test owner: Sandy Zheng 
 Reviewer: Amanda Li
 Date: 2014/1/8
 Description: Test VizContainer.setHeight() and VizContainer.getHeight
 Check points: set/get height of container works fine
 steps: 1.Create a vizContainer and set the height.
 */
 QUnit.test("VizContainer.setHeight/getHeight ", function(assert){
	 var oVizContainer = new VizContainer({
		 uiConfig:  {
					'layout' : 'horizontal',
					'enableMorphing' : true
		 }
     });
	oVizContainer.setHeight('100px'); 
	assert.equal(oVizContainer.getHeight(), '100px', "setHeight/getHeight pass");
	oVizContainer.destroy();
 });
 
  var oModel = new JSONModel({
     businessData : [ {
         Country : "Canada",
         profit : -141.25
     }, {
         Country : "China",
         profit : 133.82
     }, {
         Country : "France",
         profit : 348.76
     }, {
         Country : "Germany",
         profit : 217.29
     }, {
         Country : "India",
         profit : 117.00
     }, {
         Country : "United States",
         profit : 609.16
     } ]
 });

 var oDataset = new FlattenedDataset({
     dimensions : [ {
         axis : 1, 
         name : 'Country',
         value : "{Country}"
     } ],   
     measures : [
     {
         name : 'Profit', // 'name' is used as label in the Legend 
         value : '{profit}' // 'value' defines the binding for the displayed value   
     } ],
     data : {
         path : "/businessData"
     }
 });

   /*
    * test owner:Janet Wang 
    * Reviewer: Amanda Li
    * Date: 2014/1/7 
    * Description: Test for setEnableMorphing/getEnableMorphing api 
     * Check points:setEnableMorphing/getEnableMorphing works well 
    * steps: 1. Create a vizContainer with specified id and uiconfig 
    * 2. Set data for vizContainer
    * 3. setEnableMorphing/getEnableMorphing
     */      
 QUnit.test("VizContainer.enableMorphingTest", function(assert) {
    assert.expect(3);
    var done = assert.async();
	var vizContainer = new VizContainer('ui5VC.morphing',{
		'uiConfig' : {
		'layout' : 'horizontal',
		'enableMorphing' : true
		}
	});
	 vizContainer.setModel(oModel);
     vizContainer.setVizData(oDataset);
     vizContainer.placeAt('content');
	assert.equal(vizContainer.getEnableMorphing(),true,"Test enableMorphing: true by default");

	vizContainer.setEnableMorphing(false);
	assert.equal(vizContainer.getEnableMorphing(),false,"Test enableMorphing: false");
	vizContainer.attachInitialized(function() {
		vizContainer.setEnableMorphing(true);
		assert.equal(vizContainer.getEnableMorphing(),true,"Test enableMorphing: true");
		//destroy the control
		CommonUtil.destroyVizContainer(vizContainer);
		done();
 });

});
/*
 * test owner:Janet Wang 
 * Reviewer: Amanda Li
 * Date: 2014/1/8
 * Description: Test for getAnalysisObjectsForPicker api 
 * Check points: getAnalysisObjectsForPicker works well
 * steps: 1. Create a vizContainer with specified id and uiconfig 
 * 2. Set analysis objects
 *	3. Get the analysis object, verify.
 */

 QUnit.test("VizContainer.analysisObjectsForPickerTest", function(assert) {
	assert.expect(3);
	var done = assert.async();
	 var analysisObjects = [new AnalysisObject({'uid': 'ENTITY_ID_PRODUCT','name': 'Product','type': 'dimension'}),
                       		new AnalysisObject({ 'uid':'ENTITY_ID_COUNTRY', 'name':'Country', 'type':'dimension'	}),
                       		new AnalysisObject({ 'uid':'ENTITY_ID_SALEQUANTITY', 'name':'Sale Quantity', 'type':'measure'}),
                       		new AnalysisObject({ 'uid':'ENTITY_ID_SALEREVENUE', 'name':'Sale Revenue', 'type':'measure'}),
                       		new AnalysisObject({ 'uid':'ENTITY_ID_CITY', 'name':'City', 'type':'dimension'	}),
                       		new AnalysisObject({ 'uid':'ENTITY_ID_SALENUMBER','name':'Sale Number', 'type':'measure' })];

	var analysisObjects1 = [analysisObjects[0], analysisObjects[1], analysisObjects[2], analysisObjects[3]];
	var analysisObjects2 = [analysisObjects[4], analysisObjects[5]];
	//create a vizContainer
	var vizContainer = new VizContainer('ui5VC.aos',{
		'uiConfig' : {
		'layout' : 'horizontal',
		'enableMorphing' : true
		}
	});
     vizContainer.placeAt('content');
 	vizContainer.attachInitialized(function() {
 	 //check default analysis objects is null
 	    assert.equal(CommonUtil.equalAnalysisObjects(vizContainer.getAnalysisObjectsForPicker(), []),true, 'The analysis objects of vizContainer is null by default.');

 	    //Set one analysis objects, then get it to verify
 	    for (var i = 0; i < analysisObjects1.length; i++) {
 	        vizContainer.addAnalysisObjectsForPicker(analysisObjects1[i]);
 	    }
 	    assert.equal(CommonUtil.equalAnalysisObjects(vizContainer.getAnalysisObjectsForPicker(), analysisObjects1),true, 'The analysis objects are set to vizContainer successfully.');

 	    //destroy AnalysisObjectsForPicker and add some aos, then get it to verify the analysis objects is overwritten
 	    vizContainer.destroyAnalysisObjectsForPicker();
 	    for (var i = 0; i < analysisObjects2.length; i++) {
 	        vizContainer.addAnalysisObjectsForPicker(analysisObjects2[i]);
 	        }
 	    assert.equal(CommonUtil.equalAnalysisObjects(vizContainer.getAnalysisObjectsForPicker(), analysisObjects2),true, 'Set another analysis objects, the analysis abjects will be overwrited with new one.');
 	    
 	    //destroy control
 	    CommonUtil.destroyVizContainer(vizContainer);
 	        done();
 	});
});

/*
 * test owner:Janet Wang 
 * Reviewer: Amanda Li
 * Date: 2014/1/8
 * Description: Test for vizSelection api 
 * Check points: vizSelection works well
 * steps: 1. Create a vizContainer with specified id and uiconfig 
 * 2. Set vizData
 *	3. Select some data points, verify
 */
//Selection data
var dataPoints = [{
    "data":{    
    Country : "Canada",
    Profit : -141.25
        	 }
},{
"data":{
    Country : "China",
    Profit : 133.82
    }
}];
QUnit.test("VizContainer.vizSelectionTest", function(assert) {
	assert.expect(3);
	var done = assert.async();
	//create a vizContainer
	var vizContainer = new VizContainer('ui5VizContainer.vizSelection1', {
		'uiConfig' : {
		'layout' : 'horizontal',
		'enableMorphing' : true
		}
	});

	 vizContainer.setModel(oModel);
     vizContainer.setVizData(oDataset);
     
	 // set feeds
     var aobjCountry = new AnalysisObject({
         uid : "Country",
         name : "Country",
         type : "Dimension"
     }), aobjProfit = new AnalysisObject({
         uid : "Profit",
         name : "Profit",
         type : "Measure"
     });
     var feedPrimaryValues = new FeedItem({
         uid : "primaryValues",
         type : "Measure",
         values : [ aobjProfit ]
     }), feedAxisLabels = new FeedItem({
         uid : "axisLabels",
         type : "Dimension",
         values : [ aobjCountry ]
     });
     vizContainer.addFeed(feedPrimaryValues);
     vizContainer.addFeed(feedAxisLabels);
     //select dataPoints
     vizContainer.vizSelection([dataPoints[0]],{
			clearSelection : true
		});
	assert.deepEqual(vizContainer.vizSelection(),null,"The data point can not be selected since vizContainer is not ready");	
	vizContainer.placeAt("content");
     vizContainer.attachInitialized(function() {
         vizContainer.vizSelection(dataPoints,{
             clearSelection : false
         });
         assert.equal(CommonUtil.arrayEqualIgnoreSequence(vizContainer.vizSelection(),dataPoints),true,"The selected data point is correct");
         
         //deselect data points
         vizContainer.vizSelection([], {
             clearSelection : true
         });
         assert.deepEqual(vizContainer.vizSelection(),[],"The data point is deselected");
         
         //destroy control
         CommonUtil.destroyVizContainer(vizContainer);
         
         done();
     });
});

/*
Test owner: Tammy Yang
Reviewer: Amanda Li
Date: 2014/01/08
Description: Test VizContainer: setVizType() and getVizType()
Check points: 1. Set viz type before vizFrame exists, then get viz type, check the viz type could be gotten.
                    2. Set viz type after vizFrame exists, then get viz type, check the viz type could be gotten.
steps: 	1. Create a VizContainer.
            2. Set viz type.
            3. Get viz type and verify.
            4. Show VizContainer to create vizFrame.
            5. Set viz type.
            6. Get viz type and verify.
            7. Destroy VizContainer.
*/
QUnit.test('VizContainer.set/get VizType', function(assert) {
	assert.expect(2);
	var done = assert.async();
	var vizContainer = new VizContainer('', {
		'uiConfig' : {
                         'layout' : 'horizontal',
                         'enableMorphing' : true
        }
	});
	
	//Set and get viz type synchronously
	var vizType = 'viz/bar';
	vizContainer.setVizType(vizType);
	assert.equal(vizContainer.getVizType(),vizType,'The viz type is set to VizContainer and get synchronously.');
	
	//Show VizContainer to create vizFrame, then set and get viz type asynchronously
	vizContainer.placeAt('content');
	vizContainer.attachInitialized(function() {
		vizType = 'viz/line';
		vizContainer.setVizType(vizType);
		assert.equal(vizContainer.getVizType(),vizType,'The viz type is set to VizContainer and get asynchronously.');
		CommonUtil.destroyVizContainer(vizContainer);
		done();
	});	
});
 
/*
Test owner: Tammy Yang
Reviewer: Amanda Li
Date: 2014/01/08
Description: Test VizContainer: setVizCss() and getVizCss()
Check points: 1. Set viz css before vizFrame exists, then get viz css, check the viz css could be gotten.
                    2. Set viz css after vizFrame exists, then get viz css, check the viz css could be gotten and the new css is appended.
steps: 	1. Create a VizContainer.
            2. Set viz css.
            3. Get viz css and verify.
            4. Show VizContainer to create vizFrame.
            5. Set viz css.
            6. Get viz css and verify css could be gotten and new css is appended.
            7. Destroy VizContainer.
*/
QUnit.test('VizContainer.set/get VizCss', function(assert) {
	assert.expect(2);
	var done = assert.async();
	var vizContainer = new VizContainer('', {
		'uiConfig' : {
                         'layout' : 'horizontal',
                         'enableMorphing' : true
        }
	});
	var vizType = 'viz/area';
	vizContainer.setVizType(vizType);
	
	//Set and get viz css synchronously
	var css1 = '.v-background{fill:#FADCF7;} .v-body-title{fill:#6B4D2C;} .v-body-label{fill:#11D3F5;}';
	var css2 = '.v-m-main .v-background-body{fill:#F8FFCD;} .v-m-main .v-background-border{stroke:#DADEBE; stroke-width:4}';
	vizContainer.setVizCss(css1);
	assert.equal(vizContainer.getVizCss(),css1,'The viz css is set to VizContainer and get synchronously.');
	
	//Show VizContainer to create vizFrame, then set and get viz css asynchronously
	vizContainer.placeAt('content');
	vizContainer.attachInitialized(function() {
		vizContainer.setVizCss(css2);
	  //TODO [Christy] Temporary solution. This issue will be fixed later after CSS API is stable. 
		assert.ok((vizContainer.getVizCss().indexOf(css1+css2)) === -1,'The viz css is set to VizContainer and get asynchronously.');
		CommonUtil.destroyVizContainer(vizContainer);
		done();
	});
});
 
/*
Test owner: Tammy Yang
Reviewer: Amanda Li
Date: 2014/01/08
Description: Test VizContainer: setVizProperties() and getVizProperties()
Check points: 1. Set viz properties before vizFrame exists, then get viz properties, check the viz properties could be gotten.
                    2. Set viz properties after vizFrame exists, then get viz css, check the viz properties could be gotten and the new properties is merged.
steps: 	1. Create a VizContainer.
            2. Set viz properties.
            3. Get viz properties and verify.
            4. Show VizContainer to create vizFrame.
            5. Set viz properties.
            6. Get viz properties and verify properties could be gotten and new properties is merged.
            7. Destroy VizContainer.
*/
QUnit.test('VizContainer.set/get VizProperties', function(assert) {
	assert.expect(2);
	var done = assert.async();
	var vizContainer = new VizContainer('', {
		'uiConfig' : {
                         'layout' : 'horizontal',
                         'enableMorphing' : true
        }
	});
	var vizType = 'viz/column';
	vizContainer.setVizType(vizType);
	
	//Set and get viz properties synchronously
	var properties1 = { 
			title : {
				visible : true,
				text : 'title1',
				alignment : "left"
			}
	};
	var properties2 = {
			title : {
				visible : false,
				text : 'title2'
			}
	};
	var expectProperties = {
			title : {
				visible : false,
				text : 'title2',
				alignment : "left"
			}
	};
	vizContainer.setVizProperties(properties1);
	assert.deepEqual(vizContainer.getVizProperties(), properties1, "The viz properties is set to VizContainer and get synchronously");
	
	//Show VizContainer to create vizFrame, then set and get viz css asynchronously
	vizContainer.placeAt('content');
	vizContainer.attachInitialized(function() {
		vizContainer.setVizProperties(properties2);
		assert.deepEqual(vizContainer.getVizProperties().title, expectProperties.title, "The viz properties is set to VizContainer and get asynchronously");
		CommonUtil.destroyVizContainer(vizContainer);
		done();
	});
});
 
/*
Test owner: Tammy Yang
Reviewer: Amanda Li
Date: 2014/01/09
Description: Test VizContainer: addFeed(), destroyFeeds(), getFeeds()
Check points: 1. Set feeds before vizFrame exists, then get feeds, check the feeds could be gotten.
                    2. Set feeds after vizFrame exists, then get feeds, check the feeds could be gotten.
steps: 	1. Create a VizContainer.
            2. Set feeds via addFeed() and destroyFeeds().
            3. Get feeds and verify.
            4. Show VizContainer to create vizFrame.
            5. Set feeds.
            6. Get feeds and verify.
            7. Destroy VizContainer.
*/
QUnit.test('VizContainer.set/get Feeds', function(assert) {
	assert.expect(2);
	var done = assert.async();
	var analysisObjects = [new AnalysisObject({'uid':'ENTITY_ID_PRODUCT', 'name':'Product', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_COUNTRY', 'name':'Country', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_PROFIT', 'name':'Profit', 'type':'measure'}),
							  new AnalysisObject({'uid':'ENTITY_ID_REVENUE', 'name':'Revenue', 'type':'measure'}),
							  new AnalysisObject({'uid':'ENTITY_ID_COUNTRY', 'name':'Country', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_CITY', 'name':'City', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_SALENUMBER', 'name':'Number', 'type':'measure'})];
	var feeds1 = [new FeedItem({'uid':'axisLabels', 'type':'Dimension', 'values':[analysisObjects[0]]}),
						 new FeedItem({'uid':'regionColor', 'type':'Dimension', 'values':[analysisObjects[1]]}),
						 new FeedItem({'uid':'primaryValues', 'type':'Measure', 'values':[analysisObjects[2],analysisObjects[3]]})];
	var feeds2 = [new FeedItem({'uid':'axisLabels', 'type':'Dimension', 'values':[analysisObjects[4]]}),
						 new FeedItem({'uid':'regionColor', 'type':'Dimension', 'values':[analysisObjects[5]]}),
						 new FeedItem({'uid':'primaryValues', 'type':'Measure', 'values':[analysisObjects[6]]})];
	var vizContainer = new VizContainer('', {
		'uiConfig' : {
                         'layout' : 'horizontal',
                         'enableMorphing' : true
        }
	});
	
	var vizType = 'viz/line';
	vizContainer.setVizType(vizType);
	
	//Set feeds before viz frame exists
	CommonUtil.setVizContainerFeeds(vizContainer, feeds1);	
	assert.ok(CommonUtil.compareFeedsUid(vizContainer.getFeeds(),feeds1),'Before viz frame exist, the viz feeds is set to VizContainer and get correctly.');
	
	vizContainer.placeAt('content');	
	vizContainer.attachInitialized(function() {
		//Set feeds after viz frame exists
		CommonUtil.setVizContainerFeeds(vizContainer, feeds2);	
		assert.ok(CommonUtil.compareFeedsUid(vizContainer.getFeeds(),feeds2),'After viz frame exist, the viz feeds is set to VizContainer and get correctly.');
		done();
		CommonUtil.destroyVizContainer(vizContainer);
	});
});

/*
Test owner: Tammy Yang
Reviewer: Amanda Li
Date: 2014/01/10
Description: Test VizContainer: vizUpdate()
Check points: 1. Create a VizContainer and set data and feeds, then update css, properties, feeds and data, verify all of them could be updated
steps: 	1. Create a VizContainer.
            2. Set feeds and data.
            3. Show the VizContainer to create vizFrame.
            4. Update css and verify css is updated.
            4. Update properties and verify properties is updated.
            5. Update feeds and verify feeds is updated..
            6. Update data and verify data is updated.
            7. Destroy VizContainer.
*/
QUnit.test('VizContainer.vizUpdate', function(assert) {
	assert.expect(3);
	var done = assert.async();
	var vizContainer = new VizContainer('', {
		'uiConfig' : {
                         'layout' : 'horizontal',
                         'enableMorphing' : true
        }
	});
	
	var vizType = 'viz/line';
	var oModel1 = new JSONModel({
        businessData1 : [
                {Country :"Canada",revenue:410.87,profit:-141.25, population:34789000},
                {Country :"China",revenue:338.29,profit:133.82, population:1339724852},
                {Country :"France",revenue:487.66,profit:348.76, population:65350000},
                {Country :"Germany",revenue:470.23,profit:217.29, population:81799600},
                {Country :"India",revenue:170.93,profit:117.00, population:1210193422},
                {Country :"United States",revenue:905.08,profit:609.16, population:313490000}
        ]
    });
	
	var oDataset1 = new FlattenedDataset('FD1', {
		dimensions : [
               {
                       axis : 1, 
                       name : 'Country', 
                       value : "{Country}"
               } 
        ],
        measures : [ 
               {
                       name : 'Profit', 
                       value : '{profit}' 
               },
               {
                       name : 'Revenue', 
                       value : '{revenue}'
               } 
        ],
        data : {
               path : "/businessData1"
        }
	});
	var oModel2 = new JSONModel({
        businessData2 : [
                {Product : "Bike", City :"Beijing", number:34789000},
                {Product :"Car", City: "Beijing", number:39724852},
                {Product :"Truck", City: "Beijing", number:65350000},
                {Product : "Bike", City :"Shanghai", number:45789000},
                {Product :"Car", City: "Shanghai", number:23724852},
                {Product :"Truck", City: "Shanghai", number:32350000}
        ]
    });
	
	var oDataset2 = new FlattenedDataset('FD2', {
		dimensions : [
               {
                       axis : 1, 
                       name : 'Product', 
                       value : "{Product}"
               },
               {
            	       axis : 2, 
                       name : 'City', 
                       value : "{City}"
               }
        ],
        measures : [ 
               {
                       name : 'Number', 
                       value : '{number}' 
               }
        ],
        data : {
               path : "/businessData2"
        }
	});
	var analysisObjects = [new AnalysisObject({'uid':'ENTITY_ID_PRODUCT', 'name':'Product', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_COUNTRY', 'name':'Country', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_PROFIT', 'name':'Profit', 'type':'measure'}),
							  new AnalysisObject({'uid':'ENTITY_ID_REVENUE', 'name':'Revenue', 'type':'measure'}),
							  new AnalysisObject({'uid':'ENTITY_ID_COUNTRY', 'name':'Country', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_CITY', 'name':'City', 'type':'dimension'}),
							  new AnalysisObject({'uid':'ENTITY_ID_SALENUMBER', 'name':'Number', 'type':'measure'})];
	var feeds1 = [new FeedItem({'uid':'axisLabels', 'type':'Dimension', 'values':[analysisObjects[1]]}),
						 new FeedItem({'uid':'primaryValues', 'type':'Measure', 'values':[analysisObjects[2],analysisObjects[3]]})];
	var feeds2 = [new FeedItem({'uid':'axisLabels', 'type':'Dimension', 'values':[analysisObjects[0]]}),
						 new FeedItem({'uid':'regionColor', 'type':'Dimension', 'values':[analysisObjects[5]]}),
						 new FeedItem({'uid':'primaryValues', 'type':'Measure', 'values':[analysisObjects[6]]})];
	vizContainer.setVizType(vizType);
	vizContainer.setModel(oModel1);
	vizContainer.setVizData(oDataset1);
	CommonUtil.setVizContainerFeeds(vizContainer, feeds1);	
	vizContainer.placeAt("content");
	
	//TODO [Christy] Temporary solution. This issue will be fixed later after CSS API is stable. 
	var updateOptions1 = {
			css : ' .v-m-root .v-m-tooltip .viz-tooltip-background{width:222px;} .v-m-root .v-m-tooltip .v-background{width:222px;} .v-m-root .v-m-main .v-m-background .v-background-body{height:300px;} .v-m-root .v-m-main .v-m-background .viz-plot-background{height:300px;} .v-m-root .v-m-main .v-m-background .v-background-border{stroke-width:4px;} .v-m-root .v-m-main .v-m-background .viz-plot-background-border{stroke-width:4px;}'
	};
	
	var updateOptions2 = {
			properties : { 
				title : {
					visible : true,
					text : 'title1',
					alignment : "left"
				}
		   },
		   feeds: feeds2
	};
	
	var updateOptions3 = {
			data : oDataset2
	};
	
	var init = 0;
	vizContainer.attachInitialized(function() {
	    if(init <= 0) {
	        init++;
	    }
	    else {
	        return;
	    }
		//Update css only
		vizContainer.vizUpdate(updateOptions1);
		//TODO It's a bug which has been recorded. 
		//equal(vizContainer.getVizCss(), updateOptions1.css, 'The css is updated.');
		
		//Update properties and feeds
		vizContainer.vizUpdate(updateOptions2);
		//Update data
		vizContainer.vizUpdate(updateOptions3);
		vizContainer.setModel(oModel2);
		var count = 0;
		vizContainer.attachInitialized(function() {
		    if(count < 3) {
		        count++;
		    }
		    else {
		        assert.deepEqual(vizContainer.getVizProperties().title, updateOptions2.properties.title, "The properties is updated");
	            assert.ok(CommonUtil.compareFeedsUid(vizContainer.getFeeds(), updateOptions2.feeds),'The feeds is updated.');
	            assert.equal(vizContainer.getVizData().sId, 'FD2', 'The data is updated.');
	            CommonUtil.destroyVizContainer(vizContainer);
	            done();
		    }
		});
	});
});
 /*
 Description: Test set/get VizData
 steps: 1. Create a horizontal vizContainer. Set chart type is viz/bar.
 2. Create a JsonModel and set data, then bind to vizContainer.
 3. Create a FlattenedDataset and set it to vizContainer.
 4. Verify the dataset is correct via get().
 */
QUnit.test("VizContainer. set/getVizdata",function(assert){
	var done = assert.async();
		var vizContainer = new VizContainer('VizContainer.set.getVizdata', {
			'uiConfig' : {
				'layout' : 'horizontal',
				'enableMorphing' : true
			}
		});
		  var oModel = new JSONModel({
              businessData : [
                      {Country :"Canada", revenue:410.87,profit:-141.25, population:34789000},
                      {Country :"China",revenue:338.29,profit:133.82, population:1339724852},
                      {Country :"France",revenue:487.66,profit:348.76, population:65350000},
                      {Country :"Germany",revenue:470.23,profit:217.29, population:81799600},
                      {Country :"India",revenue:170.93,profit:117.00, population:1210193422},
                      {Country :"United States",revenue:905.08,profit:609.16, population:313490000}
              ]
		  });
		  
	 	 var oDataset = new FlattenedDataset('DS', {
             dimensions : [ 
                     {
                             axis : 1, 
                             name : 'Country', 
                             value : "{Country}"
                     } 
             ],
             measures : [ 
                     {
                             name : 'Profit', 
                             value : '{profit}' 
                     }
             ],
             data : {
                     path : "/businessData"
             }
     }); 
	 	 // set feeds
	 var aobjCountry = new AnalysisObject({
	            uid : "Country",
	            name : "Country",
	            type : "dimension"
	        });
	 var aobjProfit = new AnalysisObject({
	            uid : "Profit",
	            name : "Profit",
	            type : "measure"
	        });
	var feedPrimaryValues = new FeedItem({
	            uid : "primaryValues",
	            type : "Measure",
	            values : [ aobjProfit ]
	        }); 
	 var feedAxisLabels = new FeedItem({
	            uid : "axisLabels",
	            type : "Dimension",
	            values : [ aobjCountry ]
	        });
	        
	 	vizContainer.setModel(oModel);
	 	vizContainer.setVizData(oDataset);
	 	vizContainer.addFeed(feedPrimaryValues);
        vizContainer.addFeed(feedAxisLabels);
	 	
	 	vizContainer.placeAt("content");
	 	vizContainer.attachInitialized(function() {
	 		var uid = vizContainer.getVizData().sId;
			assert.equal(uid,'DS','vizdata is correct');
		    CommonUtil.destroyVizContainer(vizContainer);
			done();
		});
 });

 QUnit.start();
 
});

 