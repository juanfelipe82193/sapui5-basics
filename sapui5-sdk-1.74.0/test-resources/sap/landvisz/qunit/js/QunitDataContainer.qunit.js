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
		name : "J01",
		//tooltip : "Am a Overall tooltip",
		type : "TechnicalSystem",
		qualifierText : "ABAP",
		qualifierTooltip : "ABAP Server System",
		qualifierType : "Abap",
		id : "aminId",
		renderingSize : "Regular",
		defaultState : "NotSelected",
		description : "Am in Description",

	myHeaders: [ { header :"OverView", selected : false, properties:[{ label :"OS",value:"Windows"},
			 									  { label :"DB",value:"DB2"}
			 	]},

			 { header :"Product", selected : false, properties:  [{ label :"SAP ERP", value:"",iconType:"p",iconTitle:"Product"}]
			 },
			 { header :"Product Version", selected: true,properties:  [{ label :"SAP ERP 6.0",value:"",iconType:"pv",iconTitle:"ProductVersion"}]
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

	//Tests Starts

	QUnit.module("DataContainerCreation");
	QUnit.test("DataContainerCreationOk", function(assert) {
		var oDomRef = document.getElementById("aminId-CLVEntityVLayoutProperties");
		assert.ok(oDomRef, "Data Container Row Field exists");
		//check which Navigation item is selected
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
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].header , "Product Version", "ProductVersion is selected");
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].properties[0].label, "SAP ERP 6.0", "Value is SAP ERP 6.0");
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].properties[0].iconType, "pv", "Icon Type is Product Version");
			assert.equal(oLandEntity.getModel().getData().myHeaders[2].properties[0].iconTitle, "ProductVersion", "icon Title is ProductVersion");

		}

	});

});