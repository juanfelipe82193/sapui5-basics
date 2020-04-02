sap.ui.require(['jquery.sap.global', 'sap/rules/ui/ExpressionAdvanced', 'sap/rules/ui/services/ExpressionLanguage',
		"sap/rules/ui/oldast/lib/AstYamlConverter"
	],
	function(jQuery, ExpressionAdvanced, ExpressionLanguage, AstYamlConverter) {
		'use strict';
		var oVocaAst = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/vocabulary/ast.txt',
				dataType: "json"
			}).data;
		})();

		var oRuleAst = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/Rule/AstRules.json',
				dataType: "json"
			}).data;
		})();

		var formRuleData = function(expression) {
			var oRuleId = oRuleAst.Id; // Hardcoded Rule ID
			var oVersion = oRuleAst.Version;

			var oRuleData = oRuleAst;

			// Add dummy tags
			if (!oRuleData.DecisionTable) {
				oRuleData.DecisionTable = {};
			}
			oRuleData.Type = "DT";

			oRuleData.DecisionTable.metadata = {};
			// HardCoding values to DT because rule body validator and tags expects these tags
			oRuleData.DecisionTable.RuleID = oRuleId;
			oRuleData.DecisionTable.version = oVersion;
			oRuleData.DecisionTable.HitPolicy = "FM";

			// Add dummy tags
			oRuleData.DecisionTable.DecisionTableColumns = {};
			oRuleData.DecisionTable.DecisionTableColumns.results = [];
			oRuleData.DecisionTable.DecisionTableColumns.results.push({
				"metadata": {},
				"RuleId": oRuleId,
				"Id": oRuleId,
				"Version": oVersion,
				"Sequence": 1,
				"Type": "CONDITION",
				"Condition": {
					"metadata": {},
					"RuleId": oRuleId,
					"Id": 1,
					"Version": oVersion,
					"Expression": expression,
					"Description": null,
					"ValueOnly": false,
					"FixedOperator": null
				},
				"Result": null
			});

			oRuleData.DecisionTable.DecisionTableRows = {};
			oRuleData.DecisionTable.DecisionTableRows.results = [];

			oRuleData.DecisionTable.DecisionTableColumnsCondition = {};
			oRuleData.DecisionTable.DecisionTableColumnsCondition.results = [];

			oRuleData.DecisionTable.DecisionTableColumnsResult = {};
			oRuleData.DecisionTable.DecisionTableColumnsResult.results = [];

			return oRuleData;
		};

		//================================================================================
		// Carousel Properties
		//================================================================================
		QUnit.module("AST test suite", {
			setup: function() {
					this.oVocaAst = oVocaAst;
					this.formRuleData = formRuleData;
					this._astUtils = AstYamlConverter;
					this.oParser = new ExpressionLanguage();
					this.oParser.setData(this.oVocaAst);
					if (this.oExpressionEditor) {
						this.oExpressionEditor.destroy();
					}
					this.oExpressionEditor = new ExpressionAdvanced({
						expressionLanguage: this.oParser
					});
					this.oExpressionEditor.placeAt("content");
				}
				//tear
		});

		//================================================================================
		// Ast Tests for Arthimetic operations
		//================================================================================
		QUnit.test("AST - Arthimetic operations", function() {
			var expression;
			try {
				// 1. add operation
				expression = "StateTax of the Tax + CentralTax of the Tax is equal to 3";
				this.oExpressionEditor.setValue(expression);
				var result = this.oExpressionEditor.validate();
				var expectedString = "Success";
				var actualString = result.status;
				equal(actualString, expectedString,
					"Add operation - StateTax of the Tax + CentralTax of the Tax is equal to 3 expression validation should be Successfull");
				var oRuleData = this.formRuleData(expression);
				result = this.oParser.convertRuleToCodeValues(oRuleData);
				var parserResults = result.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults;
				this._astUtils.Id = 0;
				var astOutput = parserResults.converted.ASTOutput;

				var astTransformed = this._astUtils.parseConditionStatement(astOutput);
				var rootNode = astTransformed.Root ? astTransformed.Token : false;
				ok((rootNode.Value === "isEqual" && rootNode.Type == "F"),
					"Add operation -Root node value of expression StateTax of the Tax + CentralTax of the Tax is equal to 3 expression should be isEqual and type should be function"
				);
				var children = astTransformed.Children;
				ok(children.length == 2,
					"Add operation -StateTax of the Tax + CentralTax of the Tax is equal to 3 expression should have two childrens");

				var sequence = astTransformed.Children[0].SequenceNumber;
				var addNode = astTransformed.Children[0].Object;
				// Left child with sequence 1 should have token 'add' and it should be root node with two childrens
				ok((sequence === 1) && (addNode.Children.length === 2) && addNode.Token.Value === "add",
					"Add operation -StateTax of the Tax + CentralTax of the Tax expression First childnode is Add and it should have two childrens");

				// TODO: Fix the UUID generation
				//expectedString = "bf8543040f75454a892d013b4ca923c2.0a2fe50f353148d78e0ec538f32f7aa4";
				//ok(addNode.Children[0].Object.Token.Value.includes("0a2fe50f353148d78e0ec538f32f7aa4"), "Add -Expected Left child value of Add node should contain attributeId");

				// 2. subtract operation
				expression = "StateTax of the Tax - CentralTax of the Tax is equal to 3";

				this.oExpressionEditor.setValue(expression);
				result = this.oExpressionEditor.validate();
				expectedString = "Success";
				actualString = result.status;
				equal(actualString, expectedString,
					"Subtract operation - StateTax of the Tax - CentralTax of the Tax is equal to 3 expression validation should be Successfull");
				oRuleData = this.formRuleData(expression);
				result = this.oParser.convertRuleToCodeValues(oRuleData);
				parserResults = result.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults;
				this._astUtils.Id = 0;
				astOutput = parserResults.converted.ASTOutput;

				astTransformed = this._astUtils.parseConditionStatement(astOutput);
				rootNode = astTransformed.Root ? astTransformed.Token : false;
				ok((rootNode.Value === "isEqual" && rootNode.Type == "F"),
					"Subtract operation--Root node value of expression StateTax of the Tax - CentralTax of the Tax is equal to 3 expression should be isEqual and type should be function"
				);
				children = astTransformed.Children;
				ok(children.length == 2,
					"Subtract ---StateTax of the Tax - CentralTax of the Tax is equal to 3 expression should have two childrens");

				sequence = astTransformed.Children[0].SequenceNumber;
				var subtractNode = astTransformed.Children[0].Object;
				// Left child with sequence 1 should have token 'add' and it should be root node with two childrens
				ok((sequence === 1) && (subtractNode.Children.length === 2) && subtractNode.Token.Value === "subtract",
					"Subtract operation--StateTax of the Tax - CentralTax of the Tax expression First childnode is subtract and it should have two childrens"
				);

				// TODO: Fix the UUID generation
				//expectedString = "bf8543040f75454a892d013b4ca923c2.0a2fe50f353148d78e0ec538f32f7aa4";
				//ok(subtractNode.Children[0].Object.Token.Value.includes("0a2fe50f353148d78e0ec538f32f7aa4"), "Add -Expected Left child value of Add node should contain attributeId");

				// 3. multiply operation
				expression = "StateTax of the Tax * CentralTax of the Tax is equal to 3";

				this.oExpressionEditor.setValue(expression);
				result = this.oExpressionEditor.validate();
				expectedString = "Success";
				actualString = result.status;
				equal(actualString, expectedString,
					"Multiply operation - StateTax of the Tax * CentralTax of the Tax is equal to 3 expression validation should be Successfull");
				oRuleData = this.formRuleData(expression);
				result = this.oParser.convertRuleToCodeValues(oRuleData);
				parserResults = result.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults;
				this._astUtils.Id = 0;
				astOutput = parserResults.converted.ASTOutput;

				astTransformed = this._astUtils.parseConditionStatement(astOutput);
				rootNode = astTransformed.Root ? astTransformed.Token : false;
				ok((rootNode.Value === "isEqual" && rootNode.Type == "F"),
					"Multiply operation--Root node value of expression StateTax of the Tax * CentralTax of the Tax is equal to 3 expression should be isEqual and type should be function"
				);
				children = astTransformed.Children;
				ok(children.length == 2,
					"Multiply ---StateTax of the Tax * CentralTax of the Tax is equal to 3 expression should have two childrens");

				sequence = astTransformed.Children[0].SequenceNumber;
				var multiplyNode = astTransformed.Children[0].Object;
				// Left child with sequence 1 should have token 'add' and it should be root node with two childrens
				ok((sequence === 1) && (multiplyNode.Children.length === 2) && multiplyNode.Token.Value === "multiply",
					"Multiply operation--StateTax of the Tax * CentralTax of the Tax expression First childnode is Multiply and it should have two childrens"
				);

				// TODO: Fix the UUID generation
				//expectedString = "bf8543040f75454a892d013b4ca923c2.0a2fe50f353148d78e0ec538f32f7aa4";
				//ok(multiplyNode.Children[0].Object.Token.Value.includes("0a2fe50f353148d78e0ec538f32f7aa4"), "Add -Expected Left child value of Add node should contain attributeId");

				// 4. divide operation
				expression = "StateTax of the Tax / CentralTax of the Tax is equal to 3";

				this.oExpressionEditor.setValue(expression);
				result = this.oExpressionEditor.validate();
				expectedString = "Success";
				actualString = result.status;
				equal(actualString, expectedString,
					"Divide operation - StateTax of the Tax / CentralTax of the Tax is equal to 3 expression validation should be Successfull");
				oRuleData = this.formRuleData(expression);
				result = this.oParser.convertRuleToCodeValues(oRuleData);
				parserResults = result.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults;
				this._astUtils.Id = 0;
				astOutput = parserResults.converted.ASTOutput;

				astTransformed = this._astUtils.parseConditionStatement(astOutput);
				rootNode = astTransformed.Root ? astTransformed.Token : false;
				ok((rootNode.Value === "isEqual" && rootNode.Type == "F"),
					"Divide operation--Root node value of expression StateTax of the Tax / CentralTax of the Tax is equal to 3 expression should be isEqual and type should be function"
				);
				children = astTransformed.Children;
				ok(children.length == 2,
					"Divide ---StateTax of the Tax / CentralTax of the Tax is equal to 3 expression should have two childrens");

				sequence = astTransformed.Children[0].SequenceNumber;
				var divideNode = astTransformed.Children[0].Object;
				// Left child with sequence 1 should have token 'add' and it should be root node with two childrens
				ok((sequence === 1) && (divideNode.Children.length === 2) && divideNode.Token.Value === "divide",
					"Divide operation--StateTax of the Tax / CentralTax of the Tax expression First childnode is divide and it should have two childrens"
				);

				// TODO: Fix the UUID generation
				//expectedString = "bf8543040f75454a892d013b4ca923c2.0a2fe50f353148d78e0ec538f32f7aa4";
				//ok(divideNode.Children[0].Object.Token.Value.includes("0a2fe50f353148d78e0ec538f32f7aa4"), "Add -Expected Left child value of Add node should contain attributeId");

			} catch (e) {
				ok(false, "Exception while converting ast for expression" + expression);
			}

		});

	});
