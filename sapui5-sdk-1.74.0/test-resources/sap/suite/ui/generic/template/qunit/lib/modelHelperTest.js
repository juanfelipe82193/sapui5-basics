/**
 * tests for the sap.suite.ui.generic.template.lib.modelHelper
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/modelHelper", "sap/suite/ui/generic/template/lib/testableHelper"
                ], function(sinon, modelHelper, testableHelper) {
	"use strict";

	// simple model for testing: 3 EntityTypes A, B, C, with navigationProperties toA, toB, toC from everyone to every other one, and each of them with a property name
	var oEntityTypeA = {name: "A"}, oEntityTypeB = {name: "B", X: {Path: "Y"}}, oEntityTypeC = {name: "C"};
	// methods used from ODataMetaModel
	var oMetaModel = {
			getODataProperty: function(oEntityType, sProperty){
				return oEntityType[sProperty];
			},
			getODataAssociationEnd: function(oEntityType, sNavigationProperty){
				return {
					type: (sNavigationProperty === "toA" ? "oEntityTypeA" : (sNavigationProperty === "toB" ? "oEntityTypeB" : (sNavigationProperty === "toC" ? "oEntityTypeC" : "")))
				};
			},
			getODataEntityType: function(sEntityType){
				return (sEntityType === "oEntityTypeA" ? oEntityTypeA : (sEntityType === "oEntityTypeB" ? oEntityTypeB : (sEntityType === "oEntityTypeC" ? oEntityTypeC : null )));
			}
	};

	module("Tests getting an ODataProperty from an EntityType", {
//		setup: fnGeneralSetup,
//		teardown: fnGeneralTeardown
	});

	QUnit.test("Without navigation", function(assert) {
		assert.equal(modelHelper.getODataProperty(oMetaModel, oEntityTypeA, "name"), oEntityTypeA.name, "correct Property returned");
	});

	QUnit.test("With simple navigation", function(assert) {
		assert.equal(modelHelper.getODataProperty(oMetaModel, oEntityTypeA, "toB/name"), oEntityTypeB.name, "correct Property returned");
	});

	QUnit.test("With two step navigation", function(assert) {
		assert.equal(modelHelper.getODataProperty(oMetaModel, oEntityTypeA, "toB/toC/name"), oEntityTypeC.name, "correct Property returned");
	});

	QUnit.test("With simple navigation including indirection in the result", function(assert) {
		var oExpectedResult = {Path: "toB/Y" };
		assert.deepEqual(modelHelper.getODataProperty(oMetaModel, oEntityTypeA, "toB/X"), oExpectedResult, "correct Property returned");
	});

	QUnit.test("Without navigation returning result object", function(assert) {
		var oExpectedResult = {Path: "Y" };
		assert.deepEqual(modelHelper.getODataProperty(oMetaModel, oEntityTypeB, "X"), oExpectedResult, "correct Property returned");
	});

	QUnit.test("Two calls with the same simple navigation", function(assert) {
		assert.equal(modelHelper.getODataProperty(oMetaModel, oEntityTypeA, "toB/name"), oEntityTypeB.name, "correct property returned");
		assert.equal(modelHelper.getODataProperty(oMetaModel, oEntityTypeA, "toB/name"), oEntityTypeB.name, "correct property returned for second call");
	});


	var oTestStub;
	module("Test adding indirection", {
		setup: function(){
			testableHelper.startTest();
			oTestStub = testableHelper.getStaticStub();
		},
		teardown: function(){
			testableHelper.endTest();
		}
	});

	QUnit.test("Add indirection - simple object", function(assert) {
		var sNavProp = "navigation", oEntity = {
				dummy: "value1",
				Path: "value2",
				CollectionPath: { String: "value3" },
				PropertyPath: "value4"
		}, oExpected = {
				dummy: "value1",
				Path: "navigation/value2",
				CollectionPath: { String: "navigation/value3" },
				PropertyPath: "navigation/value4"
		};
		assert.deepEqual(oTestStub.modelHelper_addIndirection(oEntity, sNavProp), oExpected, "indirection is added to simple paths");
	});

	QUnit.test("Don't add indirection for absolute paths", function(assert) {
		var sNavProp = "navigation", oEntity = {
				dummy: "value1",
				Path: "/value2",
				CollectionPath: { String: "/value3" },
				PropertyPath: "/value4"
		}, oExpected = {
				dummy: "value1",
				Path: "/value2",
				CollectionPath: { String: "/value3" },
				PropertyPath: "/value4"
		};
		assert.deepEqual(oTestStub.modelHelper_addIndirection(oEntity, sNavProp), oExpected, "indirection is not added to absolute paths");
	});

	QUnit.test("Add indirection - deep object", function(assert) {
		var sNavProp = "navigation", oEntity = { SubObject: {
				dummy: "value1",
				Path: "value2",
				CollectionPath: { String: "value3" },
				PropertyPath: "value4"
		}}, oExpected = { SubObject: {
				dummy: "value1",
				Path: "navigation/value2",
				CollectionPath: { String: "navigation/value3" },
				PropertyPath: "navigation/value4"
		}};
		assert.deepEqual(oTestStub.modelHelper_addIndirection(oEntity, sNavProp), oExpected, "indirection is added to simple paths");
	});

});
