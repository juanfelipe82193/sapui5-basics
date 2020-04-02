/*
	Test case - DecisionTableSettings
	- Test the Refresh Dialog Message logic
*/


sap.ui.require(['jquery.sap.global', 
				'sap/rules/ui/DecisionTableSettings', 
				'sap/rules/ui/services/ExpressionLanguage'],
	function(jQuery, DecisionTableSettings, ExpressionLanguage) {
		'use strict';
        //================================================================================
        // Prepare Test Data
        //================================================================================
       //QUnit.begin(function () {
		QUnit.module( "Test Refresh", {
            beforeEach: function() {

				//Get vocabulary (ajax call)
				this.oVocaFlight = (function getTestData(){
	                return jQuery.sap.sjax({
	                    url: '../localService/data/static/vocabulary/FlightVoca.json',
	                    dataType: "json"
	                }).data;
				})();
				this.oExpressionLanguage = new ExpressionLanguage();
				this.oExpressionLanguage.setData(this.oVocaFlight);
				
				this.oDecisionTableSettings = new DecisionTableSettings({
				expressionLanguage: this.oExpressionLanguage,
				hitPolicies: [sap.rules.ui.RuleHitPolicy.FirstMatch, sap.rules.ui.RuleHitPolicy.AllMatch]});
				
				this._settingsModel = new sap.ui.model.json.JSONModel();
				this.oDecisionTableSettings.setModel(this._settingsModel, "settingsModel");

				this.columnsOld =  [{Result:{DataObjectAttributeId:"idA",DataObjectAttributeName:"nameA",BusinessDataType:"typeA"}},
								   {Result:{DataObjectAttributeId:"idB",DataObjectAttributeName:"nameB",BusinessDataType:"typeB"}},
								   {Result:{DataObjectAttributeId:"idC",DataObjectAttributeName:"nameC",BusinessDataType:"typeC"}}
								   ];
								   
				this.columnsNew =  [{DataObjectAttributeId:"idA",name:"nameA",businessDataType:"typeA"},
								   {DataObjectAttributeId:"idB",name:"nameB",businessDataType:"typeB2"},
								   {DataObjectAttributeId:"idD",name:"nameD",businessDataType:"typeD"}
								   ];
								   
				this.columnsOldAtRule =  [{DataObjectAttributeId:"idA",name:"nameA",businessDataType:"typeA"},
								   {DataObjectAttributeId:"idB",name:"nameB",businessDataType:"typeB"},
								   {DataObjectAttributeId:"idC",name:"nameC",businessDataType:"typeC"}
								   ];
				this.updatesExpected = {"addedColumns":["nameD"],"changedColumns":["nameB"],"removedColumns":["nameC"]};
				this.noUpdatedExpected = {"addedColumns":[],"changedColumns":[],"removedColumns":[]};
				
				this.updatesStrMessageExpected = "Columns 'nameD' were added.Columns 'nameB' were changed.Columns 'nameC' were removed.Refreshing the result will delete all the values in the removed columns.Are you sure you want to continue?";
				this.noUpdatedStrMessageExpected = null;	
            }
        });	

		//================================================================================
		// Test Refresh Result Updates
		//================================================================================
			
		QUnit.test("Test Refresh: Check Updated Columns statistics", function(assert){

				var updates = this.oDecisionTableSettings._getResultsUpdates(this.columnsOld,this.columnsNew);
				var noUpdated = this.oDecisionTableSettings._getResultsUpdates(this.columnsOld,this.columnsOldAtRule);

				assert.deepEqual(noUpdated, this.noUpdatedExpected, "Check no result column updates");
				assert.deepEqual(updates, this.updatesExpected, "Check result column updates: 1 Created, 1 Deleted, 1 Changed");
				
		});
		
		//================================================================================
		// Test Refresh Dialog Message
		//================================================================================
			
		QUnit.test("Test Refresh  details: Check Dialog Message", function(assert){
				var updatesMessage = this.oDecisionTableSettings._getMessageByResultUpdates(this.updatesExpected);
				var noUpdatedMessage = this.oDecisionTableSettings._getMessageByResultUpdates(this.noUpdatedExpected);

				assert.deepEqual(updatesMessage, this.updatesStrMessageExpected, "Check no result message");
				assert.deepEqual(noUpdatedMessage, this.noUpdatedStrMessageExpected, "Check result column updates message");
				assert.deepEqual(this.oDecisionTableSettings.getModel("settingsModel").getProperty("/refreshButtonEnabled"),false,"Check refresh button is disabled");

		});		
	});
