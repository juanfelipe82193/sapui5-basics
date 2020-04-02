sap.ui.require([
	'jquery.sap.global', 
	'sap/rules/ui/RuleBuilder',
	'sap/rules/ui/services/ExpressionLanguage',
	'test/sap/rules/ui/TestUtils'
],	function(jQuery, RuleBuilder, ExpressionLanguage, TestUtils) {
	'use strict';
	
	//================================================================================
	// Validation: test API only, without rendering
	//================================================================================
	QUnit.module("Validation API (error is cells + header)", {
		beforeEach: function() {
			
			TestUtils.startRequestRecorder({
				filePath: "data/", 
				fileName: "DT_Error_In_Cells_And_Header"
			});
			
			var sRuleId = '005056912EC51EE689FF728583164199',
				version = "000001",
				sVocaId = sRuleId;
			
			var controls = TestUtils.createRuleControlPack({
				uiControlType: "DecisionTable",
				ruleIds: [sRuleId], 
				ruleVersions: [version],
				vocaId: sVocaId,
				loadRuleData: false
			});
			
			this.oDecisionTable = controls.uiControls[0];
			this.oDecisionTable.placeAt("content");

			// QUnit will wait for all data be loaded
			TestUtils.qUnitWaitForData(controls.dataSyncPromise);
		},
		afterEach: function() {
			TestUtils.stopRequestRecorder();
			this.oDecisionTable.destroy();
		}
	});

	QUnit.test("_getRuleData method", function(assert) {

		assert.expect(2);

		var oDT = this.oDecisionTable;
		
		// check rule has data
		var ruleData = oDT._getRuleData();
		assert.ok(jQuery.isEmptyObject(ruleData) === false, "Result has data");
		
		// check rule's data is as expected
		var expectedRuleData = jQuery.sap.sjax({
			url: 'data/Rule_005056912EC51EE689FF728583164199.json',
			dataType: "json"
		}).data;
			
		var ruleDataStr = JSON.stringify(ruleData);
		var expectedRuleDataStr = JSON.stringify(expectedRuleData);
		assert.strictEqual(ruleDataStr, expectedRuleDataStr, "Data should be as expected");
		
	});
	
	QUnit.skip("_flatRule method", function(assert) {

		assert.expect(2);

		var oDT = this.oDecisionTable;
		
		var ruleData = oDT._getRuleData();
		
		ruleData.DecisionTable.DecisionTableColumns.results.forEach( function(col, index) {
					if (col.Type === "CONDITION") {
						col.Condition.ParserResults = {
							"Status":"Success",
							"ActualReturnType": null,
                            "Converted": {
                                "Expression": col.Condition.Expression + " Display",
                                "FixedOperator": "greater than"
                            }
						};
					}
		});
		
		// Flat cells
		ruleData.DecisionTable.DecisionTableRows.results.forEach( function(row) {
			var cellArr = row.Cells;
			cellArr.forEach( function(cell) {
				cell.ParserResults = {
					"Status":"Success",
					"ActualReturnType": null,
                    "Converted": {
                        "Content": cell.Content + " Display"
                    }
				};
			});
		});
				
		// check rule has data
		var flatRuleData = oDT._flatRule(ruleData);
		assert.ok(jQuery.isEmptyObject(flatRuleData) === false, "Result has data");
		
		// check rule's data is as expected
		var expectedRuleData = jQuery.sap.sjax({
			url: 'data/Rule_005056912EC51EE689FF728583164199.json',
			dataType: "json"
		}).data;
			
		var ruleDataStr = JSON.stringify(flatRuleData);
		var expectedRuleDataStr = JSON.stringify(expectedRuleData);
		assert.strictEqual(ruleDataStr, expectedRuleDataStr, "Data should be as expected");
		
	});
	
	QUnit.test("convertRuleToDisplayValues method", function(assert) {

		assert.expect(6);

		var oDT = this.oDecisionTable;
		
		var ruleData = oDT._getRuleData();
		var oExpressionLanguage = sap.ui.getCore().byId(oDT.getExpressionLanguage());

		var validationResult = oExpressionLanguage.convertRuleToDisplayValues(ruleData);
		
		// check validationResult contains data
		assert.ok(jQuery.isEmptyObject(validationResult) === false, "Result has data");
		
		// check validationResult contains status "Error"
		assert.strictEqual(validationResult.output.status, "Error", "Result has status Error");
		
		// check validationResult contains details
		assert.strictEqual(validationResult.details.length, 1, "Result has details");
		
		// check there are 6 messages with correct content
		var messages = validationResult.details[0].messages;
		assert.strictEqual(messages.length, 6, "Result has 6 messages");
		
		// check there is message for error in column
		var columnErrors = 0;
		messages.forEach(function(msg) {
			columnErrors += (msg.additionalInfo.type === "column") ? 1 : 0;
		});
		assert.strictEqual(columnErrors, 1, "Result has 1 error for headers");
		
		// check there are 5 messages for error in cell
		var cellErrors = 0;
		messages.forEach(function(msg) {
			cellErrors += (msg.additionalInfo.type === "cell") ? 1 : 0;
		});
		assert.strictEqual(cellErrors, 5, "Result has 5 errors for cells");
		
	});
	
	QUnit.test("_buildMessagesStructure method", function(assert) {

		assert.expect(9);

		var oDT = this.oDecisionTable;
		
		var ruleData = oDT._getRuleData();
		var oExpressionLanguage = sap.ui.getCore().byId(oDT.getExpressionLanguage());

		var validationResult = oExpressionLanguage.convertRuleToDisplayValues(ruleData);

		var genericErrors = [];
		var messageStructure = oDT._buildMessagesStructure(validationResult, genericErrors);
		
		// check MessageStructure contains data
		assert.ok(jQuery.isEmptyObject(messageStructure) === false, "Result has data");
		
		// check there is no generic error
		assert.strictEqual(genericErrors.length, 0, "Result hasn't generic errors");
		assert.ok(messageStructure.genericError === undefined, "Result hasn't entry for generic error");
		
		// check there is entry for header error
		assert.ok(messageStructure.errorInColumnHeader, "Result has entry for header error");
		
		// check keys for each cell error entry
		var expectedMsg = {
			"RowId=1,ColId=5": "Error in expression; enter valid operand instead of '12085'\n",
			"RowId=2,ColId=1": "Error in expression; enter string instead of '='\n",
			"RowId=5,ColId=1": "Error in expression; enter string in single quotes: '5' instead of 5.\n",
			"RowId=5,ColId=4": "Error in expression; enter ''' at the end of the expression\n",
			"RowId=6,ColId=1": "Error in expression; remove 'n'\n"	
		};
		assert.strictEqual(messageStructure["RowId=1,ColId=5"], expectedMsg["RowId=1,ColId=5"], "Result has correct entry for cell <RowId=1,ColId=5>");
		assert.strictEqual(messageStructure["RowId=2,ColId=1"], expectedMsg["RowId=2,ColId=1"], "Result has correct entry for cell <RowId=2,ColId=1>");
		assert.strictEqual(messageStructure["RowId=5,ColId=1"], expectedMsg["RowId=5,ColId=1"], "Result has correct entry for cell <RowId=5,ColId=1>");
		assert.strictEqual(messageStructure["RowId=5,ColId=4"], expectedMsg["RowId=5,ColId=4"], "Result has correct entry for cell <RowId=5,ColId=4>");
		assert.strictEqual(messageStructure["RowId=6,ColId=1"], expectedMsg["RowId=6,ColId=1"], "Result has correct entry for cell <RowId=6,ColId=1>");
	});
	
	//================================================================================
	// Validation: Validate on Load, rule with errors in cells
	//================================================================================
	QUnit.module("Validation - Errors in Cells", {
		beforeEach: function() {
			
			TestUtils.startRequestRecorder({
				filePath: "data/", 
				fileName: "DT_Error_In_Cells"
			});
			
			var sRuleId = '005056A7004E1ED6879B5792D03515C6',
				sVersion = "000001",
				sVocaId = sRuleId;
			
			var controls = TestUtils.createRuleControlPack({
				uiControlType: "RuleBuilder",
				controlConfig: {
					types: [sap.rules.ui.RuleType.DecisionTable]
				},
				ruleIds: [sRuleId], 
				ruleVersions: [sVersion],
				vocaId: sVocaId
			});
			
			this.oRuleBuilder = controls.uiControls[0];
			this.oRuleBuilder.placeAt("content");

			// QUnit will wait for all data be loaded
			TestUtils.qUnitWaitForData(controls.dataSyncPromise);
		},
		afterEach: function() {
			TestUtils.stopRequestRecorder();
			this.oRuleBuilder.destroy();
		}
	});

	QUnit.test("Validate on Load", function(assert) {

		assert.expect(6);

		var oDT = this.oRuleBuilder.getAggregation("_rule");
		var dtInternalModel = oDT.getModel("dtModel");
		var validationStatus = dtInternalModel.getProperty("/validationStatus");
		
		// check validationStatus structure is not empty
		assert.ok(jQuery.isEmptyObject(validationStatus) === false, "Validation Status contains errors");

		// check there is entry for header error
		assert.ok(validationStatus.errorInColumnHeader === undefined, "Result hasn't entry for header error");
		
		// check keys for each cell error entry
		var expectedMsg = {
			"RowId=5,ColId=3": "Error in expression; enter valid operand instead of '1233'\n",
			"RowId=7,ColId=1": "Error in expression; enter string in single quotes: '124' instead of 124.\n"	
		};
		assert.strictEqual(validationStatus["RowId=5,ColId=3"], expectedMsg["RowId=5,ColId=3"], "Result has correct entry for cell <RowId=5,ColId=3>");
		assert.strictEqual(validationStatus["RowId=7,ColId=1"], expectedMsg["RowId=7,ColId=1"], "Result has correct entry for cell <RowId=7,ColId=1>");
		
		// check result hasn't generic error
		assert.ok(validationStatus.genericError === undefined, "Result hasn't entry for generic error");
		
		// check table cells binded to correct path
		var table = oDT.getAggregation("_table");
		var row = table.getRows()[4];
		var cell = row.getCells()[2];
		var bindingPath = cell.getValueStateTextPath();
		assert.strictEqual(bindingPath, "dtModel>/validationStatus/RowId=5,ColId=3", "Table-cell valueState is binded correctly");
		
	});
	
	//================================================================================
	// Validation: Validate on Load
	//================================================================================
	QUnit.module("Validation - Generic Error", {
		beforeEach: function() {
			
			TestUtils.startRequestRecorder({
				filePath: "data/", 
				fileName: "DT_Generic_Error"
			});
			
			var sRuleId = '005056912EC51ED68E8FDA8B13E9FEBF',
				sVersion = "000001",
				sVocaId = sRuleId;
			
			var controls = TestUtils.createRuleControlPack({
				uiControlType: "RuleBuilder",
				controlConfig: {
					types: [sap.rules.ui.RuleType.DecisionTable]
				},
				ruleVersions: [sVersion],
				ruleIds: [sRuleId], 
				vocaId: sVocaId
			});
			
			this.oRuleBuilder = controls.uiControls[0];
			
			this.oRuleBuilder.placeAt("content");

			// QUnit will wait for all data be loaded
			TestUtils.qUnitWaitForData(controls.dataSyncPromise);
		},
		afterEach: function() {
			TestUtils.stopRequestRecorder();
			this.oRuleBuilder.destroy();
		}
	});

	// now it fails - REAL bug of parser: header column with fixed operator
	QUnit.test("Validate on load", function(assert) {

		assert.expect(3);

		var oDT = this.oRuleBuilder.getAggregation("_rule");
		var dtInternalModel = oDT.getModel("dtModel");
		var validationStatus = dtInternalModel.getProperty("/validationStatus");
		
		// check validationStatus structure contains data
		assert.ok(jQuery.isEmptyObject(validationStatus) === false, "Validation Status contains errors");
		
		// check result has generic error
		assert.ok(validationStatus.genericError, "Result has entry for generic error");
		assert.strictEqual(validationStatus.genericError.length, 1, "Result has one generic error");
	
	});
	
	//================================================================================
	// Validation: Validate on Load, valid rule - no errors
	//================================================================================
	QUnit.module("Validation - Valid rule, no errors", {
		beforeEach: function() {
			
			TestUtils.startRequestRecorder({
				filePath: "data/", 
				fileName: "DT_Valid"
			});
			
			var sRuleId = '005056912EC51ED693E42EE1BB8CAD7A',
				sVersion = "000001",
				sVocaId = sRuleId;
			
			var controls = TestUtils.createRuleControlPack({
				uiControlType: "RuleBuilder",
				controlConfig: {
					types: [sap.rules.ui.RuleType.DecisionTable]
				},
				ruleVersions: [sVersion],
				ruleIds: [sRuleId], 
				vocaId: sVocaId
			});
			
			this.oRuleBuilder = controls.uiControls[0];
			this.oRuleBuilder.placeAt("content");

			// QUnit will wait for all data be loaded
			TestUtils.qUnitWaitForData(controls.dataSyncPromise);
		},
		afterEach: function() {
			TestUtils.stopRequestRecorder();
			this.oRuleBuilder.destroy();
		}
	});

	QUnit.test("Validate on Load", function(assert) {

		assert.expect(1);

		var oDT = this.oRuleBuilder.getAggregation("_rule");
		var dtInternalModel = oDT.getModel("dtModel");
		var validationStatus = dtInternalModel.getProperty("/validationStatus");
		
		// check validationStatus structure is empty
		assert.ok(jQuery.isEmptyObject(validationStatus), "Validation Status doesn't contains errors");
	});
	
	//================================================================================
	// Validation: Validate Two Rule Builders with one Expression Language
	//================================================================================
	QUnit.module("Validation - Expression Language is shared between two RB", {
		beforeEach: function() {
			
			TestUtils.startRequestRecorder({
				filePath: "data/", 
				fileName: "DT_Two_With_Same_EL"
			});
			
			var ruleIds = ["005056A7004E1ED6879B5792D03515C6", "005056912EC51ED693E42EE1BB8CAD7A"];
			var verions = ["000001", "000001"];
			var sVocaId = "005056A7004E1ED6879B5792D03515C6";
			
			var controls = TestUtils.createRuleControlPack({
				uiControlType: "RuleBuilder",
				controlConfig: {
					types: [sap.rules.ui.RuleType.DecisionTable]
				},
				ruleVersions: verions,
				ruleIds: ruleIds, 
				vocaId: sVocaId
			});
			
			this.uiControls = controls.uiControls;
			
			this.uiControls.forEach(function(control) {
				control.placeAt("content");
			});
			
			// QUnit will wait for all data be loaded
			TestUtils.qUnitWaitForData(controls.dataSyncPromise);
		},
		afterEach: function() {
			TestUtils.stopRequestRecorder();
			this.uiControls.forEach(function(control) {
				control.destroy();
			});
		}
	});

	QUnit.test("Validate on Load", function(assert) {

		assert.expect(2);

		var badDT = this.uiControls[0].getAggregation("_rule");
		var goodDT = this.uiControls[1].getAggregation("_rule");
		
		// perform checks for DT with errors
		var badValidationStatus = badDT.getModel("dtModel").getProperty("/validationStatus");
		
		// check validationStatus structure is not empty
		assert.ok(jQuery.isEmptyObject(badValidationStatus) === false, "Validation Status contains errors");
		
		// perform checks for DT with errors
		var goodValidationStatus = goodDT.getModel("dtModel").getProperty("/validationStatus");
		
		// check validationStatus structure is empty
		assert.ok(jQuery.isEmptyObject(goodValidationStatus), "Validation Status doesn't contains errors");

	});

});
