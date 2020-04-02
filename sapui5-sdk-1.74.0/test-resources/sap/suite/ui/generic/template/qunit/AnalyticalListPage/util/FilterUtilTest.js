/*
*Tests for the sap.suite.ui.generic.template.AnalyticalListPage.util.FilterUtil
*/
sap.ui.define(
	[ "sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil" ], function (FilterUtil) {
		"use strict";

		var textArrangementTypes = [sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionAndId,
					sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionOnly, 
					sap.ui.comp.smartfilterbar.DisplayBehaviour.idAndDescription,
					sap.ui.comp.smartfilterbar.DisplayBehaviour.idOnly, 
					undefined];
		var sDimDesc = "Flights";
		var sDimId = "400020";

		/**
		* Test cases to be passed into createTitle().
		*/
		QUnit.test("Test createTitle for various inputs", function( assert ) {
			assert.equal(FilterUtil.createTitle("ID", "ID"), "ID");
			
			assert.equal(FilterUtil.createTitle("TITLE", "ID"), "TITLE (ID)");
			
			assert.equal(FilterUtil.createTitle("June", "June"), "June");
			
			assert.equal(FilterUtil.createTitle("TITLE: 75%", ""), "TITLE");
			
			assert.equal(FilterUtil.createTitle("TITLE: 75%", "ID"), "TITLE (ID)");
			
			assert.equal(FilterUtil.createTitle("TITLE", ""), "TITLE");
		});

		QUnit.test("Test executeFunction for various inputs", function( assert ) {

			var oObject ={
				propertyA: {
					propertyAA: {
						propertyAAA: {
							propertyAAAA: "propertyAAAA"
						},
						propertyAAB: {
							functionAABA: function( arg1, arg2, arg3){
								return arg1 + arg2 + arg3;
							},
							functionAABB : function(){
								return "functionAABB";
							}
						}
					}
				}
			};

			assert.equal(FilterUtil.executeFunction(oObject, ""), undefined);

			assert.equal(FilterUtil.executeFunction(oObject, "propertyA.propertyAA"), undefined);

			assert.equal(FilterUtil.executeFunction(oObject, "propertyA.propertyAA.propertyAAA"), undefined);

			assert.equal(FilterUtil.executeFunction(oObject, "propertyA.propertyAA.propertyAAA",["x","y","z"]), undefined);

			assert.equal(FilterUtil.executeFunction(oObject, "propertyA.propertyAA.propertyAAB",["x","y","z"]), undefined);

			assert.equal(FilterUtil.executeFunction(oObject, "propertyA.propertyAA.propertyAAB.functionAABA",["x","y","z"]), "xyz");

			assert.equal(FilterUtil.executeFunction(oObject, "propertyA.propertyAA.propertyAAB.functionAABB",["x","y","z"]), "functionAABB");

			assert.equal(FilterUtil.executeFunction(oObject, "propertyA.propertyAA.propertyAAB.functionAABA",[1,2,4]), 7);
		});

		/**
		 * Test cases to be passed into createTitleFromCode().
		 */
		QUnit.test("Test createTitleFromCode for various inputs", function(assert) {

			var oRange = {
				operation: "EQ",
				value1: 7,
				value2: undefined,
				exclude: undefined
			};

			assert.equal(FilterUtil.createTitleFromCode(oRange), "=7");
			oRange.exclude = true;
			assert.equal(FilterUtil.createTitleFromCode(oRange), "!(=7)");
			oRange.operation = "GE";
			oRange.exclude = false;
			assert.equal(FilterUtil.createTitleFromCode(oRange), ">=7");
			oRange.operation = "LE";
			assert.equal(FilterUtil.createTitleFromCode(oRange), "<=7");
			oRange.operation = "LT";
			assert.equal(FilterUtil.createTitleFromCode(oRange), "<7");
			oRange.operation = "StartsWith";
			assert.equal(FilterUtil.createTitleFromCode(oRange), "7*");
			oRange.operation = "EndsWith";
			assert.equal(FilterUtil.createTitleFromCode(oRange), "*7");
			oRange.operation = "Contains";
			oRange.value1 = 10000;
			assert.equal(FilterUtil.createTitleFromCode(oRange), "*10000*");
			oRange.operation = "BT";
			oRange.value2 = "20000";
			assert.equal(FilterUtil.createTitleFromCode(oRange), "10000...20000");
			oRange.operation = "GT";
			oRange.value2 = undefined;
			assert.equal(FilterUtil.createTitleFromCode(oRange), ">10000");
			oRange.operation = undefined;
			assert.equal(FilterUtil.createTitleFromCode(oRange), undefined);
			oRange.value1 = undefined;
			assert.equal(FilterUtil.createTitleFromCode(oRange), undefined);
		});

		QUnit.test("Test getTextArrangement - When Description and Id both present", function(assert) {
			var outputLables = [];
			for(var i = 0 ; i < textArrangementTypes.length ; i++){
				outputLables.push(FilterUtil.getTextArrangement(sDimDesc, sDimId, textArrangementTypes[i]));
			}
			assert.equal(outputLables[0],"Flights (400020)", "Text First Success");
			assert.equal(outputLables[1],"Flights", "Text Only Success");
			assert.equal(outputLables[2],"400020 (Flights)", "Text Last Success");
			assert.equal(outputLables[3],"400020", "Text Separate Success");
			assert.equal(outputLables[4],"Flights (400020)", "No Annotation Success");

		});

		QUnit.test("Test getTextArrangement - When Only Description is present", function(assert) {
			var sDimId = undefined;
			var outputLables = [];
			for(var i = 0 ; i < textArrangementTypes.length ; i++){
				outputLables.push(FilterUtil.getTextArrangement(sDimDesc, sDimId, textArrangementTypes[i]));
			}
			assert.equal(outputLables[0],"Flights", "Text First Success");
			assert.equal(outputLables[1],"Flights", "Text Only Success");
			assert.equal(outputLables[2],"Flights", "Text Last Success");
			assert.equal(outputLables[3],"", "Text Separate Success");
			assert.equal(outputLables[4],"Flights", "No Annotation Success");

		});

		QUnit.test("Test getTextArrangement - When Only Id is present", function(assert) {
			var sDimDesc = undefined;
			var outputLables = [];
			for(var i = 0 ; i < textArrangementTypes.length ; i++){
				outputLables.push(FilterUtil.getTextArrangement(sDimDesc, sDimId, textArrangementTypes[i]));
			}
			assert.equal(outputLables[0],"400020", "Text First Success");
			assert.equal(outputLables[1],"", "Text Only Success");
			assert.equal(outputLables[2],"400020", "Text Last Success");
			assert.equal(outputLables[3],"400020", "Text Separate Success");
			assert.equal(outputLables[4],"400020", "No Annotation Success");

		});

		QUnit.test("Test getTextArrangement - When Other in Donut Chart", function(assert) {
			var sDimDesc = "Other";
			var sDimId = "__IS_OTHER__";
			var outputLables = [];
			for(var i = 0 ; i < textArrangementTypes.length ; i++){
				outputLables.push(FilterUtil.getTextArrangement(sDimDesc, sDimId, textArrangementTypes[i]));
			}
			assert.equal(outputLables[0],"Other", "Text First Success");
			assert.equal(outputLables[1],"Other", "Text Only Success");
			assert.equal(outputLables[2],"Other", "Text Last Success");
			assert.equal(outputLables[3],"Other", "Text Separate Success");
			assert.equal(outputLables[4],"Other", "No Annotation Success");

		});

		QUnit.test("Is Property Hidden", function(assert) {
			var entityProperty;
			assert.equal(FilterUtil.isPropertyHidden(entityProperty), false);
			entityProperty = {};
			assert.equal(FilterUtil.isPropertyHidden(entityProperty), false);
			entityProperty["com.sap.vocabularies.UI.v1.Hidden"] = { "Bool" : "true"};
			assert.equal(FilterUtil.isPropertyHidden(entityProperty), true);
			entityProperty["com.sap.vocabularies.UI.v1.Hidden"] = { "Bool" : "false"};
			assert.equal(FilterUtil.isPropertyHidden(entityProperty), false);
		});
	}
);