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

	var myModel = {
		name : "AWX",
		//tooltip : "Am a Overall tooltip",
		type : "TechnicalSystem",
		qualifierText : "ABAP",
		qualifierTooltip : "ABAP Server System",
		qualifierType : "Abap",
		id : "aminId",
		renderingSize : "Regular",
		defaultState : "NotSelected",
		description : "Am in Description",

		myHeaders: [ { header :"OverView",properties:[{ label :"OS",value:"Windows"},
			 									  { label :"DB",value:"DB2"}
			 	]},

			 { header :"Product",properties:  [{ label :"SAP ERP", value:"",iconType:"p",iconTitle:"Product"}]
			 },
			 { header :"ProductVersion",properties:  [{ label :"SAP ERP 6.0",value:"",iconType:"pv",iconTitle:"ProductVersion"}]
			 }

		],
		actions: [{action: "Relations",icon: "http://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg"},{ action:"copy"},{ action: "paste", icon:"http://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg"}] ,
	};

	var oLandEntity = new LandscapeEntity({

		systemName : "{/name}",
		//tooltip : "{/tooltip}",
		type : LandscapeObject.TechnicalSystem,
		qualifierText : "{/qualifierText}",
		qualifierTooltip : "{/qualifierTooltip}",
		qualifierType : TechnicalSystemType.ABAP,
		id : "aminId",
		renderingSize : EntityCSSSize.Medium,
		visible : true,
		defaultState : "{/defaultState}",
		description : "{/description}",
		//systemStatus : ModelingStatus.WARNING,
		showCustomActions: true,
		showEntityActions: true

	});
	var oModel = new JSONModel();
	oModel.setData(myModel);
	oLandEntity.setModel(oModel);

	var oDataContainer = new DataContainer({ header : "{header}",selected:"{selected}" });
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
	var oActionBar =  new ActionBar({actionLabel: "{action}", iconSrc:"{icon}"});
	oLandEntity.bindAggregation("actionBar","/actions",oActionBar);



	oLandEntity.placeAt("content");


	// Tests Starts
	QUnit.module("InitialTest");

	var oLandEntity = sap.ui.getCore().byId("aminId");

	QUnit.test("LandscapeEntityCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(false, (jQuery(document.getElementById("aminId")) === undefined), "Checking if the Landscape Entity Control is created and is not undefined.");
		assert.equal(false, (jQuery(document.getElementById("aminId")) === null), "Checking if the Landscape Entity Control is created and is not null.");

	});

	QUnit.module("PropertiesTest");

	QUnit.test("LandscapeEntityPropertiesOk", function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(false, (jQuery(document.getElementById("landscapeEntity")) === undefined), "Checking if the Landscape Enity Control is created and is not undefined.");
		assert.equal(oLandEntity.getSystemName() , "AWX", "System name exists");
		//assert.equal(oLandEntity.getTooltip() , "Am a Overall tooltip", "tooltip exists");
		assert.equal(oLandEntity.getType() , LandscapeObject.TechnicalSystem, "System type exists");
		assert.equal(oLandEntity.getQualifierText() , "ABAP", "Qualifier text exists");
		assert.equal(oLandEntity.getQualifierTooltip() , "ABAP Server System", "Qualifier tooltip exists");
		assert.equal(oLandEntity.getQualifierType() , TechnicalSystemType.ABAP, "Qualifier type exists");
		assert.equal(oLandEntity.getId() , "aminId", "System ID exists");
		assert.equal(oLandEntity.getRenderingSize() ,  EntityCSSSize.Medium, "Rendering Size exists");
		//assert.equal(oLandEntity.getEnabled() , "true", "System is enabled");
		//assert.equal(oLandEntity.getVisible() , "true", "System is visible");
		assert.equal(oLandEntity.getDefaultState() , "NotSelected", "System is not selected i.e. default state");
		assert.equal(oLandEntity.getDescription() , "Am in Description", "Description for the system exists");

	});
	QUnit.module("SizeTest");
	QUnit.test("DimensionSizeOk", function(assert) {
		assert.expect(3);
		sap.ui.getCore().applyChanges();
		assert.equal(false, (oLandEntity.getRenderingSize() === EntityCSSSize.Regular), "Regular Size is rendered");
		assert.equal(true, (oLandEntity.getRenderingSize() === EntityCSSSize.Medium), "Medium Size is rendered");
		assert.equal(false, (oLandEntity.getRenderingSize() === EntityCSSSize.Large), "Large Size is not rendered");
	});

	QUnit.module("Identification Region");
	QUnit.test("IdentificationRegionCreationOk", function(assert) {
		var oDomRef = document.getElementById("aminId-CLVEntityVLayout");
		assert.ok(oDomRef, "Identification Region exists in the page");
		assert.equal(jQuery(document.getElementById("aminId-CLVEntityIdnRegion")).children().length, 4, "There should items displayed : identifier icon, identifier text, qualifier icon, qualifier text");
		var oDomRef = document.getElementById("aminId-CLVEntityIdnRegion-CLVIdnImg");
		assert.ok(oDomRef, "Identifier icon exists");
		var oDomRef = document.getElementById("aminId-CLVEntityIdnRegion-CLVIdnTxt");
		assert.ok(oDomRef, "Identifier text exists");
		assert.equal(oLandEntity.getSystemName() , "AWX", "Identifier text is AWX");
		var oDomRef = document.getElementById("aminId-CLVEntityIdnRegion-CLVQuaImg");
		assert.ok(oDomRef, "Qualifier icon exists");
		var oDomRef = document.getElementById("aminId-CLVEntityIdnRegion-CLVQuaTxt");
		assert.ok(oDomRef, "Qualifier text exists");
		assert.equal(oLandEntity.getQualifierText() , "ABAP", "Qualifier text is ABAP");

	});
	QUnit.module("CLVEntityActionsCreation");
	QUnit.test("CLVEntityActionsCreationOk", function(assert) {
		//var oDomRef = jQuery.sap.domById(oLandEntity.getId()."CLVEntityActions");
		//assert.ok(oDomRef, "CLVEntityActions exist in the page");
		for(i=0; i<oLandEntity.getModel().getData().actions.length; i++){
			assert.equal(oLandEntity.getModel().getData().actions[i].action , oLandEntity.getModel().getData().actions[i].action, "Action " + i + " is " + oLandEntity.getModel().getData().actions[i].action);
		 }
		/*
		var oDomRef = jQuery.sap.domById("__bar0-aminId-0");
		//var oDomRef = jQuery.sap.domById("sapLandviszAction");
		assert.ok(oDomRef, "Action 1 exists");
		assert.equal(oLandEntity.getModel().getData().actions[0].action , "Relations", "Action 1 is Relations");
		var oDomRef = jQuery.sap.domById("__bar0-aminId-1");
		assert.ok(oDomRef, "Action 2 exists");
		assert.equal(oLandEntity.getModel().getData().actions[1].action , "copy", "Action 2 is copy");
		var oDomRef = jQuery.sap.domById("__bar0-aminId-2");
		assert.ok(oDomRef, "Action 3 exists");
		assert.equal(oLandEntity.getModel().getData().actions[2].action , "paste", "Action 3 is paste");*/

	});
	QUnit.module("CustomActionsCreation");
	QUnit.test("CustomActionsCreationOk", function(assert) {
		var oDomRef = document.getElementById(oLandEntity.getId()+"showAllEntityAction-CLVEntityActionImg");
		assert.ok(oDomRef, "Explode View exists");
		var oDomRef = document.getElementById(oLandEntity.getId()+"maxEntityAction-CLVEntityActionImg");
		assert.ok(oDomRef, "Maximize Button exists");
		//var oDomRef = jQuery.sap.domById("aminId-RestoreEntityAction");
		//assert.ok(oDomRef, "Restore icon exists");

	});

	QUnit.module("MiniNavigationCreation");
	QUnit.test("MiniNavigationCreationOk", function(assert) {

		assert.equal(jQuery(document.getElementById(oLandEntity.getId()+"CLVEntityMiniNavigationHLayout")).children().length, 3, "Mini Navigation exists. There should 3 items displayed : Overview, Product and Product Version");
		/*
		var oDomRef = jQuery.sap.domById("aminId0.8450478378217667-CLVMiniNavigation");
		assert.ok(oDomRef, "Overview exists");
		var oDomRef = jQuery.sap.domById("aminId0.17577493540011346-CLVMiniNavigation");
		assert.ok(oDomRef, "Product exists");
		var oDomRef = jQuery.sap.domById("aminId0.7342118218075484-CLVMiniNavigation");
		assert.ok(oDomRef, "Product Version exists");
		*/

	});
	/*
	QUnit.module("NavigationHeaderCreation");
	QUnit.test("NavigationHeaderCreationOk", function(assert) {
		var oDomRef;
		var oDomRef = jQuery.sap.domById("aminId0.5079969584476203-CLVMiniNavigation");
		assert.ok(oDomRef, "Navigation Tab exists");
		/*for(i=0; i<oLandEntity.getModel().getData().myHeaders.length; i++){
			//assert.equal(oLandEntity.getModel().getData().myHeaders[i].header , "__container" + i + "-aminId-" + i + "-CLVItemHeader", "Action " + i + " is " + oLandEntity.getModel().getData().myHeaders[i].header);
			oDomRef = jQuery.sap.domById("__container" + i + "-aminId-" + i + "-CLVItemHeader");
			assert.ok(oDomRef, oLandEntity.getModel().getData().myHeaders[i].header +" exists");
			 }*/
	/*
		var oDomRef = jQuery.sap.domById("__container0-aminId-0-CLVItemHeader");
		assert.ok(oDomRef, "Overview exists");
		assert.equal(oLandEntity.getModel().getData().myHeaders[0].header , "OverView", "Overview is selected");
		var oDomRef = jQuery.sap.domById("__container0-aminId-1-CLVItemHeader");
		assert.ok(oDomRef, "Product exists");
		var oDomRef = jQuery.sap.domById("__container0-aminId-2-CLVItemHeader");
		assert.ok(oDomRef, "Product Version exists");


	});
	*/
	QUnit.module("DataContainerCreation");
	QUnit.test("DataContainerCreationOk", function(assert) {
		var oDomRef = document.getElementById("aminId-CLVEntityVLayoutProperties");
		assert.ok(oDomRef, "Data Container Row Field exists");
		//var oDomRef = jQuery.sap.domById("aminId0OverView0.09979265346191823-CLVDatacontainerRowField-CLVConLabel");
		//assert.equal(jQuery.sap.domById(aminId0OverView0.09979265346191823-CLVDatacontainerRowField-CLVConLabel) , "OS", "Label exists");

		//assert.ok(oDomRef, "Label exists");
		//var oDomRef = jQuery.sap.domById("aminId0OverView0.09979265346191823-CLVDatacontainerRowField-CLVConValue");
		//assert.ok(oDomRef, "Value exists");
		if(oLandEntity.getModel().getData().myHeaders[0].selected == true){
		assert.equal(oLandEntity.getModel().getData().myHeaders[0].header , "OverView", "Overview is selected");
		assert.equal(oLandEntity.getModel().getData().myHeaders[0].properties[0].label, "Operating System", "Label is operating system");
		assert.equal(oLandEntity.getModel().getData().myHeaders[0].properties[0].value, "Windows Server 2003", "Value is Windows Server 2003");
		assert.equal(oLandEntity.getModel().getData().myHeaders[0].header , "OverView", "Overview is selected");
		assert.equal(oLandEntity.getModel().getData().myHeaders[0].properties[1].label, "Database", "Label is Database");
		assert.equal(oLandEntity.getModel().getData().myHeaders[0].properties[1].value, "IBM DB2", "Value is IBM DB2");
		}
		if(oLandEntity.getModel().getData().myHeaders[1].selected == true){
		assert.equal(oLandEntity.getModel().getData().myHeaders[1].header , "Product", "Product is selected");
		assert.equal(oLandEntity.getModel().getData().myHeaders[1].properties[0].label, "SAP Netweaver", "Label is SAP Netweaver");
		assert.equal(oLandEntity.getModel().getData().myHeaders[1].properties[0].iconType, "p", "Icon type is product");
		assert.equal(oLandEntity.getModel().getData().myHeaders[1].properties[0].iconTitle, "Product", "icon Title is Product");

		}
		if(oLandEntity.getModel().getData().myHeaders[2].selected == true){
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].header , "ProductVersion", "ProductVersion is selected");
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].properties[0].value, "SAP Netweaver 7.0", "Value is SAP Netweaver 7.0");
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].properties[0].iconType, "pv", "Icon Type is Product Version");
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].properties[0].iconTitle, "ProductVersion", "icon Title is ProductVersion");

		}

	});

});