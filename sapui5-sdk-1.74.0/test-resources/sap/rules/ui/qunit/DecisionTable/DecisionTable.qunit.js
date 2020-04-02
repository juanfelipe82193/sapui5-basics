sap.ui.require([ 
	'jquery.sap.global', 
	'sap/rules/ui/DecisionTable',
	'test/sap/rules/ui/TestUtils'
],
	function(jQuery, DecisionTable, TestUtils) {
		'use strict';
		//================================================================================  
		// Carousel Properties
		//================================================================================
		QUnit.module("Decision Table", {
		beforeEach: function() {
			
			TestUtils.setServiceURLs("/rules-service/rule_srv/","/rules-service/vocabulary_srv/");
			TestUtils.startRequestRecorder({
				filePath: "data/", 
				fileName: "DecisionTableQunit",
				mode: "play"
			});
			
			var sRuleId = '005056912EC51EE68784F49CA61EF8EC',
				version = "000001",
				sVocaId = sRuleId;
			
			var controls = TestUtils.createRuleControlPack({
				uiControlType: "DecisionTable",
				ruleIds: [sRuleId], 
				ruleVersions: [version],
				vocaId: sVocaId,
				loadRuleData: false
			});
			
			
			this.oRule = undefined;
			var that = this;
			controls.dataSyncPromise.then( function(oRule, oVoca) {
				that.oRule = oRule;
			});
			
			this.DecisionTable = controls.uiControls[0];
			//this.DecisionTable.setBindingContextPath("/Rules(Id='005056912EC51EE68784F49CA61EF8EC',Version='000001')");
			this.DecisionTable.placeAt("content");

			// QUnit will wait for all data be loaded
			TestUtils.qUnitWaitForData(controls.dataSyncPromise);
		},
		afterEach: function() {
			TestUtils.stopRequestRecorder();
			//this.oDecisionTable.destroy();
		}
		});

		//================================================================================
		// Test Column Binding
		//================================================================================
		QUnit.test("Test Column Binding", function(assert) {
	
			/********* 1st test **************/
			var dt = this.DecisionTable;
			assert.expect(13);
			
				// Column binding validations
				var columns = dt.getAggregation("_table").getAggregation("columns");
				equal(columns.length, 4, "validate that there are 4 columns");
				
				var ifText = columns[0].getAggregation("multiLabels")[0].getProperty("text");
				equal(ifText, "If", "validate that the first column has 'if' text");
				var firstColumn = columns[0].getAggregation("multiLabels")[1].getProperty("text");
				equal(firstColumn, "Airline of the FDT_TEST_FLIGHT ", "validate the 1st column");
				var secondColumn = columns[1].getAggregation("multiLabels")[1].getProperty("text");
				equal(secondColumn, "Plane Type of the FDT_TEST_FLIGHT is equal to '747' is equal to", "validate the 2nd column");
				var thenText = columns[2].getAggregation("multiLabels")[0].getProperty("text");
				equal(thenText, "Then", "validate that the first result column has 'Then' text");
				var forthColumn = columns[2].getAggregation("multiLabels")[1].getProperty("text");
				equal(forthColumn, "CERIER", "validate that the first result column has 'Result: ' text");
				var fifthColumn = columns[3].getAggregation("multiLabels")[1].getProperty("text");
				equal(fifthColumn, "FLIGHT_NUMBER", "validate the 3rd column");
				
				// Cell binding validations
				var cellsFirstRow = dt.getAggregation("_table").getAggregation("rows")[0].getAggregation("cells");
				equal(cellsFirstRow.length, 4, "validate that there are 4 cells in a row");
				
				var firstCell = cellsFirstRow[0].getAggregation("_displayedControl").getProperty("value");
				equal(firstCell, "is equal to 'abc'", "validate 1st cell row 1");
				var secondCell = cellsFirstRow[1].getAggregation("_displayedControl").getProperty("value");
				equal(secondCell, "true", "validate 2nd cell row 1");
				var forthCell = cellsFirstRow[2].getAggregation("_displayedControl").getProperty("value");
				equal(forthCell, "Airline of the FDT_TEST_FLIGHT", "validate the 3rd cell row 1");
				var fifthCell = cellsFirstRow[3].getAggregation("_displayedControl").getProperty("value");
				equal(fifthCell, "'1'", "validate the 4th cell row 1");
				
				var oRule = {"Id":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","ProjectId":"005056A7004E1ED686D3C39A2E1EE368","Name":"ARI_DT_4","Description":"","ValidFrom":"2016-09-01T10:46:22.000Z","ValidTo":null,"Status":"I","CreatedOn":"2016-05-17T12:05:16.000Z","CreatedBy":"LULUA","ChangedOn":"2016-09-01T10:46:22.000Z","ChangedBy":"KORENO","RuleFormat":"ADVANCED","Type":"DT","ResultDataObjectId":"005056A7004E1ED686D3E465777E839E","ResultDataObjectName":"RESULTSTRUCTURE","IsDraft":false,"DecisionTable":{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","HitPolicy":"FM","DecisionTableColumnsCondition":{},"DecisionTableColumnsResult":{},"DecisionTableColumns":{"results":[{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":1,"Type":"CONDITION","Condition":{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":1,"Expression":"CARRID of the FDT_TEST_FLIGHT","ValueOnly":false,"FixedOperator":"","Description":"CARRID of the FDT_TEST_FLIGHT","parserResults":{"status":"Success","converted":{"Expression":"CARRID of the FDT_TEST_FLIGHT"}}},"Result":null},{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":2,"Type":"CONDITION","Condition":{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":2,"Expression":"PLANETYPE of the FDT_TEST_FLIGHT is equal to '747'","ValueOnly":false,"FixedOperator":"is equal to","Description":"PLANETYPE of the FDT_TEST_FLIGHT is equal to '747'","parserResults":{"status":"Success","converted":{"Expression":"PLANETYPE of the FDT_TEST_FLIGHT is equal to '747'"}}},"Result":null},{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":3,"Type":"RESULT","Condition":null,"Result":{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","Id":3,"DataObjectAttributeName":"CERIER","DataObjectAttributeId":"005056A7004E1ED686D3E776D22283A1","BusinessDataType":"String"}},{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":4,"Type":"RESULT","Condition":null,"Result":{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","Id":4,"DataObjectAttributeName":"FLIGHT_NUMBER","DataObjectAttributeId":"005056A7004E1ED686D3E96E1C7303A3","BusinessDataType":"String"}}]},"DecisionTableRows":{"results":[{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":1,"Cells":{"results":[{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":1,"ColId":1,"Content":"is equal to 'abc'","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"is equal to 'abc'"}}},{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":1,"ColId":2,"Content":"true","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"true"}}},{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":1,"ColId":3,"Content":"CARRID of the FDT_TEST_FLIGHT","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"CARRID of the FDT_TEST_FLIGHT"}}},{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":1,"ColId":4,"Content":"'1'","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"'1'"}}}]}},{"Version":"000001","RuleId":"005056912EC51EE68784F49CA61EF8EC","Id":2,"Cells":{"results":[{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":2,"ColId":1,"Content":"is equal to 'xyz'","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"is equal to 'xyz'"}}},{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":2,"ColId":2,"Content":"false","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"false"}}},{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":2,"ColId":3,"Content":"concatenate(CARRID of the FDT_TEST_FLIGHT, ' 2')","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"concatenate(CARRID of the FDT_TEST_FLIGHT, ' 2')"}}},{"RuleId":"005056912EC51EE68784F49CA61EF8EC","Version":"000001","RowId":2,"ColId":4,"Content":"'2'","ChangedOn":"2016-09-01T10:46:22.000Z","parserResults":{"status":"Success","converted":{"Content":"'2'"}}}]}}]}}};
				var expectedResult = "{\"DecisionTableColumnConditions(Version='000001',RuleId='005056912EC51EE68784F49CA61EF8EC',Id=1)\":{\"Version\":\"000001\",\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Id\":1,\"Expression\":\"CARRID of the FDT_TEST_FLIGHT\",\"ValueOnly\":false,\"FixedOperator\":\"\",\"Description\":\"CARRID of the FDT_TEST_FLIGHT\"},\"DecisionTableColumnConditions(Version='000001',RuleId='005056912EC51EE68784F49CA61EF8EC',Id=2)\":{\"Version\":\"000001\",\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Id\":2,\"Expression\":\"PLANETYPE of the FDT_TEST_FLIGHT is equal to '747'\",\"ValueOnly\":false,\"FixedOperator\":\"is equal to\",\"Description\":\"PLANETYPE of the FDT_TEST_FLIGHT is equal to '747'\"},\"DecisionTableColumnResults(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',Id=3)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"Id\":3,\"DataObjectAttributeName\":\"CERIER\",\"DataObjectAttributeId\":\"005056A7004E1ED686D3E776D22283A1\",\"BusinessDataType\":\"String\"},\"DecisionTableColumnResults(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',Id=4)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"Id\":4,\"DataObjectAttributeName\":\"FLIGHT_NUMBER\",\"DataObjectAttributeId\":\"005056A7004E1ED686D3E96E1C7303A3\",\"BusinessDataType\":\"String\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=1,ColId=1)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":1,\"ColId\":1,\"Content\":\"is equal to 'abc'\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=1,ColId=2)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":1,\"ColId\":2,\"Content\":\"true\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=1,ColId=3)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":1,\"ColId\":3,\"Content\":\"CARRID of the FDT_TEST_FLIGHT\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=1,ColId=4)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":1,\"ColId\":4,\"Content\":\"'1'\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=2,ColId=1)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":2,\"ColId\":1,\"Content\":\"is equal to 'xyz'\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=2,ColId=2)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":2,\"ColId\":2,\"Content\":\"false\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=2,ColId=3)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":2,\"ColId\":3,\"Content\":\"concatenate(CARRID of the FDT_TEST_FLIGHT, ' 2')\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"},\"DecisionTableRowCells(RuleId='005056912EC51EE68784F49CA61EF8EC',Version='000001',RowId=2,ColId=4)\":{\"RuleId\":\"005056912EC51EE68784F49CA61EF8EC\",\"Version\":\"000001\",\"RowId\":2,\"ColId\":4,\"Content\":\"'2'\",\"ChangedOn\":\"2016-09-01T10:46:22.000Z\"}}";
				var actualResult = dt._flatRule(oRule);
				equal(JSON.stringify(actualResult), expectedResult, "validate flat data");
		});
	});