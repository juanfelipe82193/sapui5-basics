/*global QUnit */

sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/json/JSONModel",
	"sap/landvisz/library",
	"sap/landvisz/LandscapeEntity",
	"sap/landvisz/internal/ActionBar",
	"sap/landvisz/internal/DataContainer",
	"sap/landvisz/internal/LinearRowField"
], function(
	createAndAppendDiv,
	JSONModel,
	landviszLibrary,
	LandscapeEntity,
	ActionBar,
	DataContainer,
	LinearRowField
) {

	createAndAppendDiv("content");

	var LandscapeObject = landviszLibrary.LandscapeObject;
	var TechnicalSystemType = landviszLibrary.TechnicalSystemType;
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	var oData = {
			nodes:{

			node1: {
				name: "SAP Erp6.0",
				selected: false,
				type:"pv",
				node: {
					name: "instances",
					selected: false,
					type:"pi",
					node1: {
						name: "central",
						selected: false,
						type:"pi",
					},
					node2: {
						name: "ecc",
						selected: false,
						type:"pi",
					}
				},

			},
			node2:{
				name: "SAP NW7.0",
				selected: false,
				type:"pv",
				node: {
					name: "central",
					selected: false,
					type:"pi",
				}
			}
		}
	};


	var treeField  = new sap.landvisz.internal.TreeField();
	treeField.setTreeModel(oData);
	treeField.setBindingName("nodes");
	var myModel = {
			name : "AWX",
			tooltip : "Am a Overall tooltip",
			type : "TechnicalSystem",
			qualifierText : "ABAP",
			qualifierTooltip : "ABAP Server System",
			qualifierType : "Abap",
			id : "aminId",
			renderingSize : "Regular",
			defaultState : "NotSelected",
			description : "Technical System AWX of SAP Netweaver 7.0",

			myHeaders: [

						 { header :"OverView",properties:[

		 									  new LinearRowField({ label :"Operating System",value:"Windows Server 2003"}),
		 									  new LinearRowField({ label :"Database",value:"IBM DB2"})
		 	]},

		 { header :"Product",properties:  [new LinearRowField({ label :"SAP Netweaver",iconType:"p",iconTitle:"Product"})
		 ]},
		 { header :"ProductVersion",properties:  [new LinearRowField({ value :"SAP Netweaver 7.0",iconType:"pv",iconTitle:"ProductVersion"})
		 ]},

		 { header :"ProductInstances",properties: treeField}

	],

	};

	var oLandEntity = new LandscapeEntity({

		systemName : "{/name}",
		tooltip : "{/tooltip}",
		type : LandscapeObject.TechnicalSystem,
		qualifierText : "{/qualifierText}",
		qualifierTooltip : "{/qualifierTooltip}",
		qualifierType : TechnicalSystemType.Java,
		id : "aminId",
		renderingSize : EntityCSSSize.Medium,
		visible : true,
		defaultState : "{/defaultState}",
		description : "{/description}",
//		containers: "{/myHeaders}",
//		select:function(oControlEvent) {
//			alert("select");
//		}

	});
	oLandEntity.attachStatusSelect(function(oControlEvent) {
		alert("I am the handler of entity selection");
	});
	var oModel = new JSONModel();
	oModel.setData(myModel);
	oLandEntity.setModel(oModel);


	oLandEntity.placeAt("content");

	// Tests Starts

	QUnit.module("TreeRendererCreation");
	QUnit.test("TreeRendererCreationOk", function(assert) {
		/*var oDomRef = jQuery.sap.domById("CLVEntityActions");
		assert.ok(oDomRef, "CLVEntityActions exist in the page");
		//var oDomRef = jQuery.sap.domById("sapUiHLayoutChildWrapper");
		var oDomRef = jQuery.sap.domById("__bar0-aminId-0");
		//var oDomRef = jQuery.sap.domById("sapLandviszAction");
		assert.ok(oDomRef, "Action 1 exists");*/
		var oDomRef = treeField.getTreeModel();
		if(oDomRef)
			assert.ok(oDomRef, "Tree Field exists");
		assert.equal(treeField.getTreeModel().nodes.node1.name , "SAP Erp6.0", "SAP Erp6.0 exists");
		assert.equal(treeField.getTreeModel().nodes.node1.type , "pv", "Type is Product Version");
		assert.equal(treeField.getTreeModel().nodes.node1.node.name , "instances", "Instances exists");
		assert.equal(treeField.getTreeModel().nodes.node1.node.type , "pi", "Type is Product Instance");
		assert.equal(treeField.getTreeModel().nodes.node1.node.node1.name , "central", "Name as Central exists");
		assert.equal(treeField.getTreeModel().nodes.node1.node.node1.type , "pi", "Type is Product Instance");
		assert.equal(treeField.getTreeModel().nodes.node1.node.node2.name , "ecc", "Name as Ecc exists");
		assert.equal(treeField.getTreeModel().nodes.node1.node.node1.type , "pi", "Type is Product Instance");
		assert.equal(treeField.getTreeModel().nodes.node2.name , "SAP NW7.0", "SAP NW7.0 exists");
		assert.equal(treeField.getTreeModel().nodes.node2.type , "pv", "Type is Product Version");
		assert.equal(treeField.getTreeModel().nodes.node2.node.name , "central", "central exists");
		assert.equal(treeField.getTreeModel().nodes.node2.node.type , "pi", "Type is Product Instance");



	});

});
