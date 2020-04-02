/*global QUnit */

sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/json/JSONModel",
	"sap/landvisz/library",
	"sap/landvisz/LandscapeEntity",
	"sap/landvisz/internal/ActionBar",
	"sap/landvisz/internal/DataContainer",
	"sap/landvisz/internal/LinearRowField"
], function(createAndAppendDiv, JSONModel, landviszLibrary, LandscapeEntity, ActionBar, DataContainer, LinearRowField) {

	createAndAppendDiv("content");

	var LandscapeObject = landviszLibrary.LandscapeObject;
	var TechnicalSystemType = landviszLibrary.TechnicalSystemType;
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

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
			description : "Am in Description",

			myHeaders: [

						 { header :"OverView", selected: true, properties:[

		 									  new LinearRowField({ label :"Operating System",value:"Windows Server 2003"}),
		 									  new LinearRowField({ label :"Database",value:"IBM DB2"})
		 	]},

		 { header :"Product",selected: false, properties:  [new LinearRowField({ label :"SAP Netweaver",iconType:"p",iconTitle:"Product"})
		 ]},
		 { header :"ProductVersion",selected: false,properties:  [new LinearRowField({ value :"SAP Netweaver 7.0",iconType:"pv",iconTitle:"ProductVersion"})
		 ]}

		],
	  actions: [{action: "Relations"},{ action:"copy"},{ action: "paste"}] ,
	};




	var oLandEntity = new LandscapeEntity({

		systemName : "{/name}",
		tooltip : "{/tooltip}",
		type : LandscapeObject.TechnicalSystem,
		qualifierText : "{/qualifierText}",
		qualifierTooltip : "{/qualifierTooltip}",
		qualifierType : TechnicalSystemType.Abap,
		id : "aminId",
		renderingSize : EntityCSSSize.Regular,
		visible : true,
		defaultState : "{/defaultState}",
		description : "{/description}",

	});

	var oModel = new JSONModel();
	oModel.setData(myModel);
	oLandEntity.setModel(oModel);

	var oDataContainer = new DataContainer({ header : "{header}" });
	var oRowField = new LinearRowField({ label:"{label}",value:"{value}",iconTitle:"{iconTitle}",iconType:"{iconType}"});
	oDataContainer.bindAggregation("properties", {
		path: "properties",
		template: oRowField,
		templateShareable: false
	});
	oLandEntity.bindAggregation("dataContainers", {
		path: "/myHeaders",
		template: oDataContainer,
		templateShareable: false
	});
	var oActionBar =  new ActionBar({actionLabel: "{action}"});
	oLandEntity.bindAggregation("actionBar","/actions",oActionBar);

	oLandEntity.placeAt("content");

	// Tests Starts

	QUnit.module("CustomActionsCreation");
	QUnit.test("CustomActionsCreationOk", function(assert) {
		var oDomRef = document.getElementById(oLandEntity.getId()+"showAllEntityAction-CLVEntityActionImg");
		assert.ok(oDomRef, "Explode View exists");
		var oDomRef = document.getElementById(oLandEntity.getId()+"maxEntityAction-CLVEntityActionImg");
		assert.ok(oDomRef, "Maximize Button exists");
//		var oDomRef = jQuery.sap.domById(oLandEntity.getId()+"RestoreEntityAction");
//		assert.ok(oDomRef, "Restore icon exists");
	});

// 	oLandEntity.setRenderingSize(sap.landvisz.EntityCSSSize.Large);
//
//	QUnit.test("CustomActionsCreationOk", function(assert) {
//		var oDomRef = jQuery.sap.domById(oLandEntity.getId()+"RestoreEntityAction");
//		assert.ok(oDomRef, "Restore icon exists");
//
//		var oDomRef = jQuery.sap.domById(oLandEntity.getId()+"RestoreEntityAction");
//		assert.ok(oDomRef, "Restore icon exists");
//
//	});

});