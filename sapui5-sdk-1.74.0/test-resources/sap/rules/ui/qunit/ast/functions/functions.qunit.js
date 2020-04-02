sap.ui.require(['jquery.sap.global',
		'sap/rules/ui/ast/builder/FunctionBuilder',
		'sap/rules/ui/ast/provider/FunctionProvider',

	],
	function (jQuery, FunctionBuilder, FunctionProvider) {
		'use strict';
		var operatorAndFunctionsData = (function getFunctionData() {
			return jQuery.sap.sjax({
				url: '../../data/ast/operators_functions_metadata.json',
				dataType: "json"
			}).data;
		})();

		QUnit.test("Get All Functions", function (assert) {

			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctions();
            var array = ["AVG", "SUM", "COUNT", "COUNTDISTINCT", "DISTINCT", "MAX", "MIN", "FILTER", "TOP", "BOTTOM", "SELECT", "SORTASC",
                "SORTDESC", "POWER", "CONCAT", "ROUND", "TODAY", "YESTERDAY", "TOMORROW", "ISINNEXT", "ISNOTINNEXT",
                "ISINLAST", "ISNOTINLAST", "SIN", "COS", "ISWITHIN", "ISNOTWITHIN", "UPDATE", "ADDSECONDS", "ADDMINUTES", "ADDHOURS", "ADDDAYS",
                "ADDWEEKS", "ADDMONTHS", "ADDQUARTERS", "ADDYEARS", "SUBTRACTSECONDS", "SUBTRACTMINUTES", "SUBTRACTHOURS", "SUBTRACTDAYS",
                "SUBTRACTWEEKS", "SUBTRACTMONTHS", "SUBTRACTQUARTERS", "SUBTRACTYEARS", "SECONDSBETWEEN", "MINUTESBETWEEN", "HOURSBETWEEN",
                "DAYSBETWEEN", "WEEKSBETWEEN", "MONTHSBETWEEN", "QUARTERSBETWEEN", "YEARSBETWEEN", "SECOND", "MINUTE", "HOUR", "DAYOFWEEK",
                "DAYOFMONTH", "DAYOFYEAR", "MONTH", "YEAR"
            ];
            assert.equal(functionSuggestions.length, 60, "60 Functions Should be Displayed");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for String");
			}
		});

		QUnit.test("Functions for AVG", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("AVG");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'AVG' ");
			assert.equal(functionSuggestions.getName(), "AVG", "Functions " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("average");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'average' ");
			assert.equal(functionSuggestions.getName(), "AVG", "Functions " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for SUM", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("SUM");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'SUM' ");
			assert.equal(functionSuggestions.getName(), "SUM", "Functions " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("sum");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'sum' ");
			assert.equal(functionSuggestions.getName(), "SUM", "Functions " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for COUNT", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("COUNT");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'COUNT' ");
			assert.equal(functionSuggestions.getName(), "COUNT", "Functions " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("count");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'count' ");
			assert.equal(functionSuggestions.getName(), "COUNT", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for COUNTDISTINCT", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("COUNTDISTINCT");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'COUNTDISTINCT' ");
			assert.equal(functionSuggestions.getName(), "COUNTDISTINCT", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("count distinct");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'count distinct' ");
			assert.equal(functionSuggestions.getName(), "COUNTDISTINCT", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for DISTINCT", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("DISTINCT");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'DISTINCT' ");
			assert.equal(functionSuggestions.getName(), "DISTINCT", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("distinct");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'distinct' ");
			assert.equal(functionSuggestions.getName(), "DISTINCT", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for MAX", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("MAX");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'MAX' ");
			assert.equal(functionSuggestions.getName(), "MAX", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("maximum");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'maximum' ");
			assert.equal(functionSuggestions.getName(), "MAX", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for MIN", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("MIN");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'MIN' ");
			assert.equal(functionSuggestions.getName(), "MIN", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("minimum");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'minimum' ");
			assert.equal(functionSuggestions.getName(), "MIN", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for FILTER", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("FILTER");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'FILTER' ");
			assert.equal(functionSuggestions.getName(), "FILTER", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("where");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'where' ");
			assert.equal(functionSuggestions.getName(), "FILTER", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for TOP", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("TOP");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'TOP' ");
			assert.equal(functionSuggestions.getName(), "TOP", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("top");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'top' ");
			assert.equal(functionSuggestions.getName(), "TOP", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for BOTTOM", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("BOTTOM");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'BOTTOM' ");
			assert.equal(functionSuggestions.getName(), "BOTTOM", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("bottom");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'bottom' ");
			assert.equal(functionSuggestions.getName(), "BOTTOM", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for SELECT", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("SELECT");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'SELECT' ");
			assert.equal(functionSuggestions.getName(), "SELECT", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("select");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'select' ");
			assert.equal(functionSuggestions.getName(), "SELECT", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for SORTASC", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("SORTASC");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'SORTASC' ");
			assert.equal(functionSuggestions.getName(), "SORTASC", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("sort ascending");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'sort ascending' ");
			assert.equal(functionSuggestions.getName(), "SORTASC", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		QUnit.test("Functions for SORTDESC", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getFunctionByName("SORTDESC");
			assert.equal(functionSuggestions != null, true, "Results not null for Name : 'SORTDESC' ");
			assert.equal(functionSuggestions.getName(), "SORTDESC", "Function " + functionSuggestions.getName() +
				" Should be displayed");

			functionSuggestions = FunctionProvider.getInstance().getFunctionByLabel("sort descending");
			assert.equal(functionSuggestions != null, true, "Results not null for Label : 'sort descending' ");
			assert.equal(functionSuggestions.getName(), "SORTDESC", "Function " + functionSuggestions.getName() +
				" Should be displayed");
		});

		//Get All Functions by Category
		//Aggreagate

		QUnit.test("Get All Aggregate Functions", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByCategory("aggregate");
			var array = ["AVG", "SUM", "COUNT", "COUNTDISTINCT", "DISTINCT", "MAX", "MIN", "FILTER"];
			assert.equal(functionSuggestions.length, 8, "8 functions Should be Displayed for aggregate");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Aggreagate");
			}
		});

		//selection

		QUnit.test("Get All selection Functions", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByCategory("selection");
			var array = ["TOP", "BOTTOM", "SELECT", "SORTASC",
				"SORTDESC"
			];
			assert.equal(functionSuggestions.length, 5, "5 functions Should be Displayed for selection");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for selection");
			}
		});

		//Get Function By Business DataType

		QUnit.test("Get All Functions for String", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByBusinessDataType("S");
			var array = ["CONCAT", "MAX", "MIN", "ROUND"];
			assert.equal(functionSuggestions.length, 4, "4 functions Should be Displayed for String");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for String");
			}
		});

		QUnit.test("Get All Functions for Number", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByBusinessDataType("N");
            var array = ["AVG", "SUM", "COUNTDISTINCT", "MAX", "MIN", "SIN", "COS", "ROUND", "POWER", "COUNT", "DISTINCT", "SECONDSBETWEEN",
                "MINUTESBETWEEN", "HOURSBETWEEN", "DAYSBETWEEN", "WEEKSBETWEEN", "MONTHSBETWEEN", "QUARTERSBETWEEN", "YEARSBETWEEN", "SECOND",
                "MINUTE", "HOUR", "DAYOFWEEK", "DAYOFMONTH", "DAYOFYEAR", "MONTH", "YEAR",
            ];
            assert.equal(functionSuggestions.length, 27, "27 functions Should be Displayed for Number");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Number");
			}
		});

		QUnit.test("Get All Functions for Amount", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByBusinessDataType("A");
			var array = ["AVG", "SUM", "MAX", "MIN", "ROUND"];
			assert.equal(functionSuggestions.length, 5, "5 functions Should be Displayed for Amount");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Amount");
			}
		});

		QUnit.test("Get All Functions for Quantity", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByBusinessDataType("Q");
			var array = ["AVG", "SUM", "MAX", "MIN", "ROUND"];
			assert.equal(functionSuggestions.length, 5, "5 functions Should be Displayed for Quantity");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Quantity");
			}
		});

		QUnit.test("Get All Functions for Date", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByBusinessDataType("D");
            var array = ["MAX", "MIN", "TODAY", "TOMORROW", "YESTERDAY", "ADDSECONDS", "ADDMINUTES", "ADDHOURS", "ADDDAYS",
                "ADDWEEKS", "ADDMONTHS", "ADDQUARTERS", "ADDYEARS", "SUBTRACTSECONDS", "SUBTRACTMINUTES", "SUBTRACTHOURS", "SUBTRACTDAYS",
                "SUBTRACTWEEKS", "SUBTRACTMONTHS", "SUBTRACTQUARTERS", "SUBTRACTYEARS"
            ];
            assert.equal(functionSuggestions.length, 21, "21 functions Should be Displayed for Date");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Date");
			}
		});

		QUnit.test("Get All Functions for Time", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByBusinessDataType("T");
            var array = ["MAX", "MIN", "ADDSECONDS", "ADDMINUTES", "ADDHOURS", "ADDDAYS", "ADDWEEKS", "ADDMONTHS", "ADDQUARTERS", "ADDYEARS",
                "SUBTRACTSECONDS", "SUBTRACTMINUTES", "SUBTRACTHOURS", "SUBTRACTDAYS", "SUBTRACTWEEKS", "SUBTRACTMONTHS", "SUBTRACTQUARTERS",
                "SUBTRACTYEARS"
            ];
            assert.equal(functionSuggestions.length, 18, "18 functions Should be Displayed for Time");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Time");
			}
		});

		QUnit.test("Get All Functions for Boolean", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByBusinessDataType("B");
			var array = ["ISINNEXT", "ISNOTINNEXT", "ISINLAST", "ISNOTINLAST", "ISWITHIN", "ISNOTWITHIN"];
			assert.equal(functionSuggestions.length, 6, "6 functions Should be Displayed for Boolean");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Boolean");
			}
		});

		//Get All Functions by DataObjectType

		QUnit.test("Get All Functions for Table", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByDataObjectType("T");
			var array = ["AVG", "SUM", "COUNT", "DISTINCT", "MAX", "MIN", "FILTER", "TOP", "BOTTOM", "SELECT", "SORTASC",
				"SORTDESC", "POWER", "CONCAT", "ROUND", "TODAY", "YESTERDAY", "TOMORROW", "ISINNEXT", "ISNOTINNEXT",
				"ISINLAST", "ISNOTINLAST", "SIN", "COS"
			];
			assert.equal(functionSuggestions.length, 12, "12 functions Should be Displayed for Table");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Table");
			}
		});

		QUnit.test("Get All Functions for Element", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsByDataObjectType("E");
            var array = ["AVG", "SUM", "COUNT", "COUNTDISTINCT", "MAX", "MIN", "POWER", "CONCAT", "ROUND", "TODAY", "YESTERDAY", "TOMORROW",
                "ISINNEXT", "ISNOTINNEXT", "ISINLAST", "ISNOTINLAST", "SIN", "COS", "ISWITHIN", "ISNOTWITHIN", "ADDSECONDS", "ADDMINUTES",
                "ADDHOURS", "ADDDAYS", "ADDWEEKS", "ADDMONTHS", "ADDQUARTERS", "ADDYEARS", "SUBTRACTSECONDS", "SUBTRACTMINUTES", "SUBTRACTHOURS",
                "SUBTRACTDAYS", "SUBTRACTWEEKS", "SUBTRACTMONTHS", "SUBTRACTQUARTERS", "SUBTRACTYEARS", "SECONDSBETWEEN", "MINUTESBETWEEN",
                "HOURSBETWEEN", "DAYSBETWEEN", "WEEKSBETWEEN", "MONTHSBETWEEN", "QUARTERSBETWEEN", "YEARSBETWEEN", "SECOND", "MINUTE", "HOUR",
                "DAYOFWEEK", "DAYOFMONTH", "DAYOFYEAR", "MONTH", "YEAR"
            ];
            assert.equal(functionSuggestions.length, 52, "52 functions Should be Displayed for Element");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Element");
			}
		});

		//Get Function By Business DataType and DataObjectType

		QUnit.test("Get All Functions for Element,String", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsGivenDataObjectAndBusinessDataType("E", "S");
			var array = ["CONCAT", "MAX", "MIN", "ROUND"];
			assert.equal(functionSuggestions.length, 4, "4 functions Should be Displayed for Number");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for String");
			}
		});

		QUnit.test("Get All Functions for Element,Number", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsGivenDataObjectAndBusinessDataType("E", "N");
            var array = ["AVG", "SUM", "COUNTDISTINCT", "MAX", "MIN", "ROUND", "POWER", "SIN", "COS", "COUNT", "SECONDSBETWEEN", "MINUTESBETWEEN",
                "HOURSBETWEEN", "DAYSBETWEEN", "WEEKSBETWEEN", "MONTHSBETWEEN", "QUARTERSBETWEEN", "YEARSBETWEEN", "SECOND", "MINUTE", "HOUR",
                "DAYOFWEEK", "DAYOFMONTH", "DAYOFYEAR", "MONTH", "YEAR"
            ];
            assert.equal(functionSuggestions.length, 26, "26 functions Should be Displayed for Number");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Number");
			}
		});

		QUnit.test("Get All Functions for Element,Amount", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsGivenDataObjectAndBusinessDataType("E", "A");
			var array = ["AVG", "SUM", "MAX", "MIN", "ROUND"];
			assert.equal(functionSuggestions.length, 5, "5 functions Should be Displayed for Amount");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Amount");
			}
		});

		QUnit.test("Get All Functions for Element,Quantity", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsGivenDataObjectAndBusinessDataType("E", "Q");
			var array = ["AVG", "SUM", "MAX", "MIN", "ROUND"];
			assert.equal(functionSuggestions.length, 5, "5 functions Should be Displayed for Quantity");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Quantity");
			}
		});

		QUnit.test("Get All Functions for Element,Date", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsGivenDataObjectAndBusinessDataType("E", "D");
            var array = ["MAX", "MIN", "TODAY", "YESTERDAY", "TOMORROW", "ADDSECONDS", "ADDMINUTES", "ADDHOURS", "ADDDAYS", "ADDWEEKS",
                "ADDMONTHS", "ADDQUARTERS", "ADDYEARS", "SUBTRACTSECONDS", "SUBTRACTMINUTES", "SUBTRACTHOURS", "SUBTRACTDAYS", "SUBTRACTWEEKS",
                "SUBTRACTMONTHS", "SUBTRACTQUARTERS", "SUBTRACTYEARS"
            ];
            assert.equal(functionSuggestions.length, 21, "21 functions Should be Displayed for Date");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Date");
			}
		});

		QUnit.test("Get All Functions for Element,Time", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsGivenDataObjectAndBusinessDataType("E", "T");
            var array = ["MAX", "MIN", "ADDSECONDS", "ADDMINUTES", "ADDHOURS", "ADDDAYS", "ADDWEEKS",
                "ADDMONTHS", "ADDQUARTERS", "ADDYEARS", "SUBTRACTSECONDS", "SUBTRACTMINUTES", "SUBTRACTHOURS", "SUBTRACTDAYS", "SUBTRACTWEEKS",
                "SUBTRACTMONTHS", "SUBTRACTQUARTERS", "SUBTRACTYEARS"
            ];
            assert.equal(functionSuggestions.length, 18, "18 functions Should be Displayed for Time");
			for (var iterator = 0; iterator < functionSuggestions.length; iterator++) {
				assert.equal(array.includes(functionSuggestions[iterator].getName()), true, "Function " + functionSuggestions[iterator].getName() +
					" Should be displayed  for Time");
			}
		});

		QUnit.test("Get All Functions for Element,Boolean", function (assert) {
			FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
			var functionSuggestions = FunctionProvider.getInstance().getAllFunctionsGivenDataObjectAndBusinessDataType("E", "B");
			assert.equal(functionSuggestions.length, 6, "6 functions Should be Displayed for Boolean");
		});

	});