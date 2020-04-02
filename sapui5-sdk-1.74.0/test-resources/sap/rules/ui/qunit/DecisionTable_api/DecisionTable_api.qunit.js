sap.ui.require(['jquery.sap.global',
		'sap/rules/ui/DecisionTable',
		'sap/rules/ui/services/ExpressionLanguage',
		'sap/ui/core/util/MockServer',
		'sap/ui/model/odata/v2/ODataModel',
		'test/sap/rules/ui/TestUtils'
	],
	function(jQuery, DecisionTable, ExpressionLanguage, MockServer, ODataModel, TestUtils) {
		'use strict';
    
    var oVocaGaming = (function getTestData(){
					return jQuery.sap.sjax({
						url: '../data/parser/vocabulary/gaming.txt',
						dataType: "json"
					}).data;
				})();

		QUnit.module("Check properties setters", {
            beforeEach: function() {
			
                TestUtils.startRequestRecorder({
                    filePath: "data/", 
                    fileName: "DT_API",
                    mode: "play"
                });

                var sRuleId = '005056912EC51EE6A0973114B7E0AF15',
                    version = "000001",
                    sVocaId = sRuleId;

                var controls = TestUtils.createRuleControlPack({
                    uiControlType: "DecisionTable",
                    ruleIds: [sRuleId], 
                    ruleVersions: [version],
                    vocaId: sVocaId,
                    loadRuleData: false
                });

                this.mDecisionTable = controls.uiControls[0];
                this.mDecisionTable.placeAt("content");

                // QUnit will wait for all data be loaded 
                TestUtils.qUnitWaitForData(controls.dataSyncPromise);
            },
		  afterEach: function() {
                TestUtils.stopRequestRecorder();
                this.mDecisionTable.destroy();
            }
		});

	
		QUnit.test("test set Enable-Settings", function(assert) {

			 var expectedEnableSettings = false;

			 this.mDecisionTable.setEnableSettings(expectedEnableSettings);

			 var oToolbar = this.mDecisionTable.getAggregation("_toolbar");

			 var toolbarContetArray = oToolbar.getContent();

			 var oSettingsButton = toolbarContetArray[6];

			 var actualEnableSettings = oSettingsButton.getEnabled();

			 equal(actualEnableSettings, expectedEnableSettings, "Test Enable-Settings configuration");
		 });

		QUnit.test("test set Editable ", function(assert) {

             var expectedEditable = false;

			 this.mDecisionTable.setEditable(expectedEditable);

			 var oToolbar = this.mDecisionTable.getAggregation("_toolbar");

			 var actualEnabled = oToolbar.getEnabled();

			 //check toolbar
			 equal(actualEnabled, expectedEditable, "Test Editable API - check toolbar");

		 });

		QUnit.test("replace Expression Language", function(assert) {

			 var dtExpressionLanguage = sap.ui.getCore().byId(this.mDecisionTable.getExpressionLanguage());

             dtExpressionLanguage.setData(oVocaGaming);

             var dtsExpressionLanguage = sap.ui.getCore().byId(this.mDecisionTable.getExpressionLanguage());

             var actualResult = dtsExpressionLanguage.validateExpression("age of the player > 10", sap.rules.ui.ExpressionType.Boolean, false, false);

			actualResult = JSON.stringify(actualResult);

             var expectedResult = JSON.stringify({"status":"Success", "actualReturnType":"Boolean"});


             equal(actualResult, expectedResult, "Replace Expression Language");
		 });


		QUnit.test("Test Link to Settings string", function() {

			var oTable = this.mDecisionTable.getAggregation("_table");

			var blankContent = oTable.getNoData();

			var blankContentInternalControls = blankContent.getItems();


			//Check "Start building the table in" exists
			var oLabelContent = blankContentInternalControls[0];

			var text = oLabelContent.getText();

			var actualResult = text;

			var expectedResult = "Start building the table in";

			equal(actualResult, expectedResult, "Check that string 'Start building the table in' is displayed");

			//Check "Settings" link exists
			var oLinkToSettings = blankContentInternalControls[2];

			text = oLinkToSettings.getText();

			actualResult = text;

			expectedResult = " Settings";

			equal(actualResult, expectedResult, "Check that link to the settings is display");
		});

		QUnit.test("Test Add/Delete are disable", function() {

			var expectedEnableSettings = false;

			this.mDecisionTable.setEnableSettings(expectedEnableSettings);

			var oToolbar = this.mDecisionTable.getAggregation("_toolbar");

			var toolbarContentArray = oToolbar.getContent();

			var oAddButton = toolbarContentArray[4];

			var actualEnableSettings = oAddButton.getEnabled();

			equal(actualEnableSettings, expectedEnableSettings, "Test that Add button is disabled");

			var oLinkButton = toolbarContentArray[2];

			var actualEnableSettings = oLinkButton.getEnabled();

			equal(actualEnableSettings, expectedEnableSettings, "Test that Delete link is disabled");
		});
		
		QUnit.test("Test ExpressionLanguageVersion for old rule", function() {

			var dt = this.mDecisionTable;
			var model = dt.getModel();
			var sExpressionLanguageVersion = model.getProperty(dt.getBindingContextPath() + '/ExpressionLanguageVersion');
			// var type = dt._decisionTableCellFormatter;
			// var version = type.sExpressionLanguageVersion;
			if (!sExpressionLanguageVersion){
				sExpressionLanguageVersion = "1.0.0";
			}
			
			equal("1.0.0", sExpressionLanguageVersion, "verify that ExpressionLanguageVersion on oData is correct");
		});

		QUnit.skip("Test ExpressionLanguageVersion for new rule", function() {

			var dt = this.mDecisionTable;
			var model = dt.getModel();
			var sExpressionLanguageVersion = model.getProperty(dt.getBindingContextPath() + '/ExpressionLanguageVersion');

			
			equal("1.0.1", sExpressionLanguageVersion, "verify that ExpressionLanguageVersion on oData is correct");
		});		
	});