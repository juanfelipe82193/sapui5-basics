sap.ui.require(['jquery.sap.global',
		'sap/rules/ui/ast/builder/OperatorBuilder',
		'sap/rules/ui/ast/provider/OperatorProvider',
	],
	function (jQuery, OperatorBuilder, OperatorProvider) {
		'use strict';
		var operatorAndFunctionsData = (function getOperatorData() {
			return jQuery.sap.sjax({
				url: '../../data/ast/operators_functions_metadata.json',
				dataType: "json"
			}).data;
		})();

		QUnit.test("Operators for String", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("S");
			var array = ["+", "=", "!=", ">", "<", ">=", "<=", "MATCHES", "NOTMATCHES", "EXISTSIN", "NOTEXISTSIN", "CONTAINS",
				"NOTCONTAINS", "IN", "NOTIN", "STARTSWITH", "NOTSTARTSWITH", "ENDSWITH", "NOTENDSWITH", "NOT"
			];
			assert.equal(operatorSuggestions.length, 20, "20 Operators Should be Displayed for String");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for String");
			}
		});

		QUnit.test("Operators for Number", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("N");
			var array = ["+", "-", "*", "/", "=", "!=", ">", "<", ">=", "<=", "EXISTSIN", "NOTEXISTSIN", "IN", "NOTIN", "NOT"];
			assert.equal(operatorSuggestions.length, 15, "15 Operators Should be Displayed for Number");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for Number");
			}
		});

		QUnit.test("Operators for Boolean", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("B");
			var array = ["=", "!=", "EXISTSIN", "NOTEXISTSIN", "IN", "NOTIN", "NOT", "AND", "OR"];
			assert.equal(operatorSuggestions.length, 9, "9 Operators Should be Displayed for Boolean");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for Boolean");
			}
		});

		QUnit.test("Operators for Date", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("D");
			var array = ["+", "-", "=", "!=", ">", "<", ">=", "<=", "EXISTSIN", "NOTEXISTSIN", "IN", "NOTIN", "NOT", "AND", "OR"];
			assert.equal(operatorSuggestions.length, 15, "15 Operators Should be Displayed for Date");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for Date");
			}
		});

		QUnit.test("Operators for Quantity", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("Q");
			var array = ["+", "-", "*", "/", "=", "!=", ">", "<", ">=", "<=", "EXISTSIN", "NOTEXISTSIN", "IN", "NOTIN", "NOT"];
			assert.equal(operatorSuggestions.length, 15, "15 Operators Should be Displayed for Quantity");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for Quantity");
			}
		});

		QUnit.test("Operators for TimeStamp", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("T");
			var array = ["+", "-", "=", "!=", ">", "<", ">=", "<=", "EXISTSIN", "NOTEXISTSIN", "IN", "NOTIN", "NOT", "AND", "OR"];
			assert.equal(operatorSuggestions.length, 15, "15 Operators Should be Displayed for TimeStamp");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for TimeStamp");
			}
		});

		QUnit.test("Operators for Amount", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("A");
			var array = ["+", "-", "*", "/", "=", "!=", ">", "<", ">=", "<=", "EXISTSIN", "NOTEXISTSIN", "IN", "NOTIN", "NOT"];
			assert.equal(operatorSuggestions.length, 15, "15 Operators Should be Displayed for Amount");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for Amount");
			}
		});

		QUnit.test("Operators for GeoSpatial", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByBusinessDataType("G");
			var array = ["=", "!=", "IN", "NOTIN"];
			assert.equal(operatorSuggestions.length, 4, "4 Operators Should be Displayed for GeoSpatial");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for GeoSpatial");
			}
		});

		//Arithmetic Operators

		QUnit.test("Operators for +", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("+");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '+' ");
			assert.equal(operatorSuggestions.getName(), "+", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("add");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'add' ");
			assert.equal(operatorSuggestions.getName(), "+", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});
		QUnit.test("Operators for -", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("-");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '-' ");
			assert.equal(operatorSuggestions.getName(), "-", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("subtract");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'subtract' ");
			assert.equal(operatorSuggestions.getName(), "-", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});
		QUnit.test("Operators for *", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("*");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '*' ");
			assert.equal(operatorSuggestions.getName(), "*", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("multiply");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'multiply' ");
			assert.equal(operatorSuggestions.getName(), "*", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for /", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("/");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '/' ");
			assert.equal(operatorSuggestions.getName(), "/", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("divide");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'divide' ");
			assert.equal(operatorSuggestions.getName(), "/", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		//Comparision Operators

		QUnit.test("Operators for =", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("=");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '=' ");
			assert.equal(operatorSuggestions.getName(), "=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("is equal");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'is equal' ");
			assert.equal(operatorSuggestions.getName(), "=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});
		QUnit.test("Operators for !=", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("!=");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '!=' ");
			assert.equal(operatorSuggestions.getName(), "!=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("is not equal");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'is not equal' ");
			assert.equal(operatorSuggestions.getName(), "!=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for >", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName(">");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '>' ");
			assert.equal(operatorSuggestions.getName(), ">", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("is greater than");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'is greater than' ");
			assert.equal(operatorSuggestions.getName(), ">", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

		});

		QUnit.test("Operators for <", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("<");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '<' ");
			assert.equal(operatorSuggestions.getName(), "<", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("is less");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'is less' ");
			assert.equal(operatorSuggestions.getName(), "<", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

		});

		QUnit.test("Operators for <=", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("<=");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '<=' ");
			assert.equal(operatorSuggestions.getName(), "<=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("is equal or less than");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'is equal or less than' ");
			assert.equal(operatorSuggestions.getName(), "<=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for >=", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName(">=");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : '>=' ");
			assert.equal(operatorSuggestions.getName(), ">=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("is equal or greater than");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'is equal or greater than' ");
			assert.equal(operatorSuggestions.getName(), ">=", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

		});

		//Range Operators

		QUnit.test("Operators for IN", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("IN");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'IN' ");
			assert.equal(operatorSuggestions.getName(), "IN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("in");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'in' ");
			assert.equal(operatorSuggestions.getName(), "IN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for NOTIN", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("NOTIN");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'NOTIN' ");
			assert.equal(operatorSuggestions.getName(), "NOTIN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("not in");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'not in' ");
			assert.equal(operatorSuggestions.getName(), "NOTIN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		//Array Operators

		QUnit.test("Operators for EXISTSIN", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("EXISTSIN");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'EXISTSIN' ");
			assert.equal(operatorSuggestions.getName(), "EXISTSIN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("exists in");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'exists in' ");
			assert.equal(operatorSuggestions.getName(), "EXISTSIN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for NOTEXISTSIN", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("NOTEXISTSIN");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'NOTEXISTSIN' ");
			assert.equal(operatorSuggestions.getName(), "NOTEXISTSIN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("does not exists in");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'does not exists in' ");
			assert.equal(operatorSuggestions.getName(), "NOTEXISTSIN", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		//Functiona; Operators

		QUnit.test("Operators for MATCHES", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("MATCHES");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'MATCHES' ");
			assert.equal(operatorSuggestions.getName(), "MATCHES", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("matches");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'matches' ");
			assert.equal(operatorSuggestions.getName(), "MATCHES", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for NOTMATCHES", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("NOTMATCHES");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'NOTMATCHES' ");
			assert.equal(operatorSuggestions.getName(), "NOTMATCHES", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("does not matches");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'does not matches' ");
			assert.equal(operatorSuggestions.getName(), "NOTMATCHES", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for CONTAINS", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("CONTAINS");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'CONTAINS' ");
			assert.equal(operatorSuggestions.getName(), "CONTAINS", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("contains string");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'contains string' ");
			assert.equal(operatorSuggestions.getName(), "CONTAINS", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for NOTCONTAINS", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("NOTCONTAINS");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'NOTCONTAINS' ");
			assert.equal(operatorSuggestions.getName(), "NOTCONTAINS", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("does not contains string");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'does not contains string' ");
			assert.equal(operatorSuggestions.getName(), "NOTCONTAINS", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for STARTSWITH", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("STARTSWITH");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'STARTSWITH' ");
			assert.equal(operatorSuggestions.getName(), "STARTSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("starts with");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'starts with' ");
			assert.equal(operatorSuggestions.getName(), "STARTSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for NOTSTARTSWITH", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("NOTSTARTSWITH");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'NOTSTARTSWITH' ");
			assert.equal(operatorSuggestions.getName(), "NOTSTARTSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("does not starts with");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'does not starts with' ");
			assert.equal(operatorSuggestions.getName(), "NOTSTARTSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for ENDSWITH", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("ENDSWITH");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'ENDSWITH' ");
			assert.equal(operatorSuggestions.getName(), "ENDSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("ends with");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'ends with' ");
			assert.equal(operatorSuggestions.getName(), "ENDSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for NOTENDSWITH", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("NOTENDSWITH");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'NOTENDSWITH' ");
			assert.equal(operatorSuggestions.getName(), "NOTENDSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("does not ends with");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'does not ends with' ");
			assert.equal(operatorSuggestions.getName(), "NOTENDSWITH", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		//Logical Operators

		QUnit.test("Operators for NOT", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("NOT");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'NOT' ");
			assert.equal(operatorSuggestions.getName(), "NOT", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("not");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'not' ");
			assert.equal(operatorSuggestions.getName(), "NOT", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for AND", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("AND");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'AND' ");
			assert.equal(operatorSuggestions.getName(), "AND", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("and");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'and' ");
			assert.equal(operatorSuggestions.getName(), "AND", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Operators for OR", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getOperatorByName("OR");
			assert.equal(operatorSuggestions != null, true, "Results not null for Name : 'OR' ");
			assert.equal(operatorSuggestions.getName(), "OR", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");

			operatorSuggestions = OperatorProvider.getInstance().getOperatorByLabel("or");
			assert.equal(operatorSuggestions != null, true, "Results not null for Label : 'or' ");
			assert.equal(operatorSuggestions.getName(), "OR", "Operator " + operatorSuggestions.getName() +
				" Should be displayed");
		});

		//Get All Operators

		QUnit.test("Get All Operators", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperators();
			var array = ["+", "-", "*", "/", "=", "!=", ">", "<", ">=", "<=", "MATCHES", "NOTMATCHES", "EXISTSIN", "NOTEXISTSIN", "CONTAINS",
				"NOTCONTAINS", "IN", "NOTIN", "STARTSWITH", "NOTSTARTSWITH", "ENDSWITH", "NOTENDSWITH", "NOT", "AND", "OR"
			];
			assert.equal(operatorSuggestions.length, 25, "25 Operators Should be Displayed for String");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for String");
			}
		});

		//Get All Operators By Category
		//Arithmetic

		QUnit.test("Get All Aritmetic Operators", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByCategory("arithmetic");
			var array = ["+", "-", "*", "/"];
			assert.equal(operatorSuggestions.length, 4, "4 Operators Should be Displayed for arithmetic");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for aritmetic");
			}
		});

		//Logical

		QUnit.test("Get All Logical Operators", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByCategory("logical");
			var array = ["AND", "OR", "NOT"];
			assert.equal(operatorSuggestions.length, 3, "3 Operators Should be Displayed for logical");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for logical");
			}
		});

		//Array

		QUnit.test("Get All array Operators", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByCategory("array");
			var array = ["EXISTSIN", "NOTEXISTSIN"];
			assert.equal(operatorSuggestions.length, 2, "2 Operators Should be Displayed for array");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for array");
			}
		});

		//Range
		QUnit.test("Get All range Operators", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByCategory("range");
			var array = ["IN", "NOTIN"];
			assert.equal(operatorSuggestions.length, 2, "2 Operators Should be Displayed for range");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for range");
			}
		});

		//Comparision

		QUnit.test("Get All Comparision Operators", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByCategory("comparison");
			var array = ["=", "!=", ">", "<", ">=", "<="];
			assert.equal(operatorSuggestions.length, 6, "6 Operators Should be Displayed for comparison");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for comparison");
			}
		});

		//Functional Operators

		QUnit.test("Get All Functional Operators", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByCategory("functional");
			var array = ["MATCHES", "NOTMATCHES", "CONTAINS",
				"NOTCONTAINS", "STARTSWITH", "NOTSTARTSWITH", "ENDSWITH", "NOTENDSWITH"
			];
			assert.equal(operatorSuggestions.length, 8, "8 Operators Should be Displayed for functional");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for functional");
			}
		});

		//Get Operators by DataObjectType

		QUnit.test("Get Operators by DataObjectType", function (assert) {
			OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
			var operatorSuggestions = OperatorProvider.getInstance().getAllOperatorsByDataObjectType("E");
			var array = ["+", "-", "*", "/", "=", "!=", ">", "<", ">=", "<=", "MATCHES", "NOTMATCHES", "EXISTSIN", "NOTEXISTSIN", "CONTAINS",
				"NOTCONTAINS", "IN", "NOTIN", "STARTSWITH", "NOTSTARTSWITH", "ENDSWITH", "NOTENDSWITH", "NOT", "AND", "OR"
			];
			assert.equal(operatorSuggestions.length, 25, "25 Operators Should be Displayed for String");
			for (var iterator = 0; iterator < operatorSuggestions.length; iterator++) {
				assert.equal(array.includes(operatorSuggestions[iterator].getName()), true, "Operator " + operatorSuggestions[iterator].getName() +
					" Should be displayed  for String");
			}
		});
	});