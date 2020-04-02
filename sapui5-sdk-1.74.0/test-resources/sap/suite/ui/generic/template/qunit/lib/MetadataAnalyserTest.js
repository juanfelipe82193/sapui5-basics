/**
 * tests for the sap.suite.ui.generic.template.lib.MetadataAnalyser
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/MetadataAnalyser"
], function(sinon, MetadataAnalyser) {
	"use strict";

	//Main EntitySet
	var oMainEntitySet = {
			entityType: "oMainEntityType",
			type:"oMainEntityType",
			entitySet:"Main Entity Set",
	}
	var oMainEntityType = {
			property:["property1","property2"],
			navigationProperty:[{
				name: "NavigationEntity1"
			},{
				name: "ParametricEntity1"
			}]
	}
	
	// Entity Set Containing Parameter
	var oParametricEntitySet = {
		entityType: "oParametricEntityType",
		type: "oParametricEntityType",
		entitySet:"Entity With Parameters"
	}
	
	var oParametricEntityType = {
			key:{
				propertyRef : [{
						name:"param1"
					}, {
					name: "param2"}]
			},
			navigationProperty:[{
				name: "MainEntitySet"
			}],
			"sap:semantics": "parameters"
	}

	// Navigation Entity Set.
	var oNavigationEntitySet = {
			entityType: "RandomEntityType",
			type: "RandomEntityType",
			entitySet:"ParametricEntity1"
		}
		
	var oNavigationEntityType = {
			property:["Nproperty1","Nproperty2","Nproperty3","Nproperty4"],
			navigationProperty:[{
				name: "RandomEntitySet"
			}],
		
	}

	var oMetaModel = {
			getODataEntitySet: function(sEntitySet) {
				switch(sEntitySet) {
					case "MainEntitySet":
						return oMainEntitySet;
					case "ParametricEntity1":
						return oParametricEntitySet
					case "NavigationEntity1":
						return oNavigationEntitySet
				}
			},
			getODataEntityType: function(sEntityType) {
				switch(sEntityType) {
					case "oMainEntityType":
						return oMainEntityType;
					case "oParametricEntityType":
						return oParametricEntityType;
					case "RandomEntityType":
						return oNavigationEntityType;
				}
			},
			getODataAssociationEnd: function(oEntityType, sNavigationName) {
				return this.getODataEntitySet(sNavigationName);
			},
			getODataAssociationSetEnd: function(oEntityType, sNavigationName) {
				return this.getODataEntitySet(sNavigationName);
			}
	}

	var oMetadataAnalyser;
	var oController = {
		getOwnerComponent: function() {
			return {
				getAppComponent: function(){
					return {
						getModel: function() {
							return {
								getMetaModel: function() {
									return oMetaModel;
								}
							}
						}
					}
				}
			}
		}
	}
	var oSandbox;


	function fnGeneralSetup(){
		oSandbox = sinon.sandbox.create();
		oMetadataAnalyser = new MetadataAnalyser(oController);
	}

	function fnGeneralTeardown(){
			oSandbox.restore();
	}

	module("Test for retrieving parameter by EntitySet name", {
		setup: fnGeneralSetup,
		teardown: fnGeneralTeardown
	});
	
	QUnit.test("Test if parameter is returned is correct", function(assert){
		var oResult = oMetadataAnalyser.getParametersByEntitySet("MainEntitySet")
		assert.strictEqual(oResult.entitySetName, "Entity With Parameters","Entity Set name is correct");
		assert.strictEqual(oResult.navPropertyName, "MainEntitySet","Navigation Property contains parameters");
		assert.strictEqual(oResult.parameters.length, 2, "Parameters retrieved correctly");
	});
	
	module("Test to get property from EntitySet name", {
		setup: fnGeneralSetup,
		teardown: fnGeneralTeardown
	});
	
	QUnit.test("Test if property retrieved from EntitySet is correct", function(assert){
		var aProperty  = oMetadataAnalyser.getPropertyOfEntitySet("NavigationEntity1");
		assert.strictEqual(aProperty.length, 4, "All properties retreived.")
	})
	
	
});