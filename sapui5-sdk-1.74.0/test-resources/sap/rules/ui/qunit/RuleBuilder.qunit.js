sap.ui.require(['jquery.sap.global',
		'sap/rules/ui/RuleBuilder',
		'sap/rules/ui/services/ExpressionLanguage',
		'sap/ui/core/util/MockServer',
		'sap/ui/model/odata/v2/ODataModel'
	],
	function(jQuery, RuleBuilder, ExpressionLanguage, MockServer, ODataModel) {
		'use strict';

		//================================================================================
		// Prepare Test Data
		//================================================================================
		var oVocaFlight = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../localService/data/static/vocabulary/FlightVoca.json',
				dataType: "json"
			}).data;
		})();

		var oExpressionLanguage = new sap.rules.ui.services.ExpressionLanguage();
		oExpressionLanguage.setData(oVocaFlight);

		//================================================================================
		// Test Module
		//================================================================================
		QUnit.module("RuleBuilder", {
			beforeEach: function(assert) {
				var done = assert.async();
				var sUrl = "/sap/opu/odata/SAP/RULE_SRV/";
				this.oMockServer = new sap.ui.core.util.MockServer({
					rootUri: sUrl
				});
				this.oMockServer.simulate("../localService/data/static/rule/metadata.xml","../localService/data/static/rule");
				this.oMockServer.start();

				var oModel = new sap.ui.model.odata.v2.ODataModel({
					serviceUrl: "/sap/opu/odata/SAP/RULE_SRV/",
					defaultBindingMode: sap.ui.model.BindingMode.TwoWay
				});
				
				var sRuleId = "005056912EC51EE68784F49CA61EF8EC",
					sVersion = "000001";
				var sRulePath = "/Rules(Id=\'" + sRuleId + "\', Version=\'" + sVersion + "\')";
				
				oModel.read(sRulePath, {
					urlParameters: {
						"$expand": "DecisionTable/DecisionTableColumns/Condition," +
							"DecisionTable/DecisionTableColumns/Result," +
							"DecisionTable/DecisionTableRows/Cells"
					},
					success: function(data) {
						done();
						//me.deferred.resolve();
					}
				});
				
				this.oRuleBuilder = new sap.rules.ui.RuleBuilder({
					expressionLanguage: oExpressionLanguage,
					types: [sap.rules.ui.RuleType.DecisionTable]
				});
				this.oRuleBuilder.setModel(oModel);
				this.oRuleBuilder.placeAt("content");
			},

			afterEach: function() {
				this.oRuleBuilder.destroy();
				this.oMockServer.stop();
			}
		});
		
		//================================================================================
		// Test properties
		//================================================================================
		
		QUnit.skip("Test property - model name", function() {
			var oRuleBuilder = this.oRuleBuilder;

			// test modelName
			var sExpectedModelName = "myModelName";
			oRuleBuilder.setModelName(sExpectedModelName);
			var sActualModelName = oRuleBuilder.getModelName();
			equal(sActualModelName, sExpectedModelName, "Test modelName - in Rule builder");
			equal(oRuleBuilder.getAggregation("_rule").getModelName(), sExpectedModelName, "Test model name + binding to _rule aggrigation");
		});

		
		QUnit.test("Test property - bindingContextPath", function() {
			var oRuleBuilder = this.oRuleBuilder;
			
			// test bindingContextPath
			var sRuleId = "005056912EC51EE68784F49CA61EF8EC",
				sVersion = "000001";
			var sRulePath = "/" + oRuleBuilder.getModel().createKey("Rules", {
				Id: sRuleId,
				Version: sVersion
			});
			//*************************************************
			var sExpectedBindingContextPath = sRulePath; //"abcd"
			oRuleBuilder.setBindingContextPath(sExpectedBindingContextPath);
			var sActualBindingContextPath = oRuleBuilder.getBindingContextPath();
			equal(sActualBindingContextPath, sExpectedBindingContextPath, "Test bindingContextPath");
			equal(oRuleBuilder.getAggregation("_rule").getBindingContextPath(), sExpectedBindingContextPath, "Test bindingContextPath - binding to _rule aggrigation");
		});
		
		QUnit.test("Test property - editable", function() {
			var oRuleBuilder = this.oRuleBuilder;

			// test editable - default value + binding to _rule aggrigation
			var sExpectedEditable = true;
			var sActualEditable = oRuleBuilder.getEditable();
			equal(sActualEditable, sExpectedEditable, "Test editable - default value is true");
			//test editable - binding to displayed control (e.g. DecisionTable)
			equal(oRuleBuilder.getAggregation("_rule").getEditable(), true, "Test editable - default value true + binding to _rule aggrigation");

			// test editable - false + binding to _rule aggrigation
			sExpectedEditable = false;
			oRuleBuilder.setEditable(sExpectedEditable);
			sActualEditable = oRuleBuilder.getEditable();
			equal(sActualEditable, sExpectedEditable, "Test editable - false");
			//test editable - binding to displayed control (e.g. DecisionTable)
			equal(oRuleBuilder.getAggregation("_rule").getEditable(), false, "Test editable - false + binding to _rule aggrigation");
			
			// test editable - true + binding to _rule aggrigation
			sExpectedEditable = true;
			oRuleBuilder.setEditable(sExpectedEditable);
			sActualEditable = oRuleBuilder.getEditable();
			equal(sActualEditable, sExpectedEditable, "Test editable - true");
			//test editable - binding to displayed control (e.g. DecisionTable)
			equal(oRuleBuilder.getAggregation("_rule").getEditable(), true, "Test editable - true + binding to _rule aggrigation");
		});

		QUnit.test("Test property - 'types'", function(assert) {
			var oRuleBuilder = this.oRuleBuilder;

			// test types - one value
			var aExpectedTypes = [sap.rules.ui.RuleType.DecisionTable];
			oRuleBuilder.setTypes(aExpectedTypes);
			var aActualTypes = oRuleBuilder.getTypes();
			deepEqual(aActualTypes, aExpectedTypes, "Test types - basic");
			
			// test types - 3 values with 2 duplicates
			// var aActualTypes = [sap.rules.ui.RuleType.DecisionTable, sap.rules.ui.RuleType.TextRule, sap.rules.ui.RuleType.DecisionTable]
			// var aExpectedTypes = [sap.rules.ui.RuleType.DecisionTable, sap.rules.ui.RuleType.TextRule]
			// oRuleBuilder.setTypes(aActualTypes);
			// var aActualReturnTypes = oRuleBuilder.getTypes();
			// deepEqual(aActualReturnTypes, aExpectedTypes, "Test types - with non unique values");

			// [N] test types - invalide values
			aActualTypes = ["aaa"];
			assert.throws(
				function() {
					oRuleBuilder.setTypes(aActualTypes);
				},
				"[N] Test types - with invalid value"
			);
		});

		QUnit.test("Test Association - 'expressionLanguage'", function() {
			var oRuleBuilder = this.oRuleBuilder;

			// test expressionLanguage was passed to DT
			var oRBExprLangId = oRuleBuilder.getExpressionLanguage();
			var oDTExprLangId = oRuleBuilder.getAggregation("_rule").getExpressionLanguage();
			equal(oRBExprLangId, oDTExprLangId, " test expressionLanguage was passed to DT (equal object ids)");
			//test expressionLanguage was changed in RB
			var oExpressionLanguageNew = new sap.rules.ui.services.ExpressionLanguage();
			oExpressionLanguageNew.setData(oVocaFlight);
			oRuleBuilder.setExpressionLanguage(oExpressionLanguageNew);
			var oRBExprLangNewId = oRuleBuilder.getExpressionLanguage();
			notEqual(oRBExprLangId, oRBExprLangNewId, "test expressionLanguage was changed in RB (not equal object ids)");
			//test RB changed expressionLanguage was passed to DT
			var oDTExprLangNewId = oRuleBuilder.getAggregation("_rule").getExpressionLanguage();
			equal(oRBExprLangNewId, oDTExprLangNewId, " test changed expressionLanguage was passed to DT (equal object ids)");
		});
		
		//================================================================================
		// Test DT configuration
		//================================================================================
		QUnit.test("Test DT configuration update", function(assert ) {
			
			var oRuleBuilder = this.oRuleBuilder;
			var oDTConfig = new sap.rules.ui.DecisionTableConfiguration();
			
			var sRBDecTableConfigId, sDTConfigId;
			
			//test default configuration object exists
			sRBDecTableConfigId = oRuleBuilder.getDecisionTableConfiguration();
			assert.ok(sRBDecTableConfigId, "check default configuration exists");
			
			//test update of configuration object
			oRuleBuilder.setDecisionTableConfiguration(oDTConfig);
			sRBDecTableConfigId = oRuleBuilder.getDecisionTableConfiguration().getId();
			sDTConfigId = oDTConfig.getId();
			assert.equal(sRBDecTableConfigId, sDTConfigId, "test changed DecisionTableConfiguration was passed to RB (equal object ids)");
			
			//test enable senttings value in DT
			assert.ok(!oRuleBuilder.getAggregation("_rule").getEnableSettings(), "test DecisionTable - enableSettings value is false");
			
			//test update of enable setting to false
			oDTConfig.setEnableSettings(false);
			assert.notOk(oRuleBuilder.getAggregation("_rule").getEnableSettings(), "update DecisionTableConfiguration enableSettings to false and check it was changed also in DT");
			
			//test hitPolicies value in DT
			assert.deepEqual(
				oRuleBuilder.getAggregation("_rule").getHitPolicies(), 
				[sap.rules.ui.RuleHitPolicy.FirstMatch, sap.rules.ui.RuleHitPolicy.AllMatch], 
				"test DecisionTable - hitPolicies values contain all hitPolicies options (default)"
			);

			//test update of hitPolicies
			oDTConfig.setHitPolicies([sap.rules.ui.RuleHitPolicy.FirstMatch]);
			assert.deepEqual(
				oRuleBuilder.getAggregation("_rule").getHitPolicies(), 
				[sap.rules.ui.RuleHitPolicy.FirstMatch], 
				"update DecisionTableConfiguration hitPolicies to [FirstMatch] only and test it was changed in DecisionTable"
			);

			//test cellFormat value in DT - OUT of scope
		});
	});