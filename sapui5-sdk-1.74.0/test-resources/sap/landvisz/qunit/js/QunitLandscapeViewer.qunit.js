/*global QUnit */

sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/xml/XMLModel",
	"sap/landvisz/library",
	"sap/landvisz/ConnectionEntity",
	"sap/landvisz/Connector",
	"sap/landvisz/LandscapeEntity",
	"sap/landvisz/LandscapeViewer",
	"sap/landvisz/internal/ActionBar",
	"sap/landvisz/internal/DataContainer",
	"sap/landvisz/internal/LinearRowField",
	"require"
], function(
	createAndAppendDiv,
	XMLModel,
	landviszLibrary,
	ConnectionEntity,
	Connector,
	LandscapeEntity,
	LandscapeViewer,
	ActionBar,
	DataContainer,
	LinearRowField,
	require
) {

	createAndAppendDiv("content");

	var ActionType = landviszLibrary.ActionType;
	var ConnectionType = landviszLibrary.ConnectionType;
	var DependencyType = landviszLibrary.DependencyType;
	var DependencyVisibility = landviszLibrary.DependencyVisibility;
	var LandscapeObject = landviszLibrary.LandscapeObject;
	var ModelingStatus = landviszLibrary.ModelingStatus;
	var TechnicalSystemType = landviszLibrary.TechnicalSystemType;
	var EntityCSSSize = landviszLibrary.EntityCSSSize;
	var ViewType = landviszLibrary.ViewType;

	var oModel = null;

	var subActions = [
				  { text :"PMD1",tooltip:"pmd1", subAction:[
		 									 {text :"PMD11",tooltip:"pmd11"},{text :"PMD12",tooltip:"pmd12"}]
				  },

					{ text :"PMD2",tooltip:"pmd2", subAction:[

														{text :"PMD21",tooltip:"pmd21"},{text :"PMD22",tooltip:"pmd22"}]
					},
					{ text :"PMD3",tooltip:"pmd3"},
					{ text :"PMD4",tooltip:"pmd4", subAction:[
												{text :"PMD41",tooltip:"pmd41"}]
					},
				];




	var oViewer = new LandscapeViewer("viewer",{
		navigationPath : "Product Maintenance Dependency",
		viewType : ViewType.DEPENDENCY_VIEW,
		defaultDependencyView : DependencyType.BOX_VIEW,
		networkDependencyLabel : "Network View",
		boxDependencyLabel : "Box View",
		showDependencyNavigator : true,
		visibleDependency : DependencyVisibility.BOTH,
		boxDependencyLevels : ["Systems","Shared Systems"]
	});


	oViewer.setViewType(ViewType.DEPENDENCY_VIEW);
	oViewer.setHasParent(false);


	var oLandEntity = new LandscapeEntity({

		systemName : "{@name}",
		systemId : "{@id}",
		tooltip : "{@tooltip}",
		type : LandscapeObject.TechnicalSystem,
		qualifierType : "{@type_name}",
		id : "aminId",
		qualifierText : "{@type_name}",
		systemStatus: ModelingStatus.ERROR,
		renderingSize : EntityCSSSize.Medium,
		stateIconTooltip: "{update_tooltip}",
		stateIconSrc:{
			path:"@update_type",
			formatter: function(fValue) {
				if(fValue == "update") {
					return "res/img/status/24x24/update.png";
				} else if(fValue == "new") {
					return "res/img/status/24x24/new.png";
				}
				return "";
			}
		}
		//containers: "{/headers}"

	 });
//	oLandEntity.attachSelect(function(oControlEvent) {
//		oViewer.appendNavigationPath("Some path");
//	});

	var oModel = new XMLModel();
	oModel.loadData(require.toUrl("../res/PMD.xml"), null, false);
	//oModel.setXML(xmlModel);
	oViewer.setModel(oModel);
	oViewer.bindAggregation("systems","/lsp:entities/lsp:entity",oLandEntity);

	var oActionBar;
	var oActionBar1;
	var systems = oViewer.getSystems();

	for(var i = 0; i<systems.length;i++ ) {

		var oDataContainer = new DataContainer({ header : "{@name}",selected : true });
		var oRowField = new LinearRowField({ label:"{@label}",value:"{@value}",iconType:"{@type}",linkSource:"{@ps_id}",iconTitle:"{@type}",iconTitle:"{@left_tooltip}", tooltip:"{@tooltip}"});
		oDataContainer.bindAggregation("properties", {
			path: "lsp:entity",
			template: oRowField,
			templateShareable: false
		});
		systems[i].bindAggregation("dataContainers","lsp:tabs/lsp:entity",oDataContainer);
		oActionBar = new ActionBar({actionLabel: "Update Options"});
		systems[i].addAggregation("actionBar",oActionBar,false);

		oActionBar1 = new ActionBar({actionLabel: "Dependency"});
		oActionBar1.setActionType(ActionType.MENU);
		oActionBar1.setMenuData(subActions);


		oActionBar1.attachSelect(function(oControlEvent) {
			oControlEvent.oSource.setRenderingSize(EntityCSSSize.Large);
			oControlEvent.oSource.setActionTitle("Called");
		});
		systems[i].addAggregation("actionBar",oActionBar1,false);

	}


	var oConnectionEntity = new ConnectionEntity({

		connectionId:"{@id}",
		type : {
			path : "@type",
			formatter : function(fValue) {
				if (fValue == "ps") {
					return ConnectionType.ProductSystem;
				} else if (fValue == "ts")
					return ConnectionType.TechnicalSystem;
				else if (fValue == "component")
					return ConnectionType.MobileSolution;
				else if (fValue == "systems")
					return ConnectionType.MobileSolution;
				else if (fValue == "MOB")
					return ConnectionType.MobileSolution;
				return "";
			}
		},
		linkId:"{@id}",id : "connection",
	});
	oViewer.bindAggregation("connectionEntities","/lsp:relation/lsp:relationentity",oConnectionEntity);


	var connectionEntities = oViewer.getConnectionEntities();
	for(var i = 0; i<connectionEntities.length;i++ ) {
		var oRowFieldConnection = new LinearRowField({ label:"{@name}",value:"{@value}",iconType:"{@type}",iconTitle:"{@left_tooltip}",tooltip:"{@tooltip}"});
		connectionEntities[i].bindAggregation("connectionData", {
			path: "lsp:data/lsp:entity",
			template: oRowFieldConnection,
			templateShareable: false
		});
	}

	var oConnector= new Connector({
		source:"{@from}",target:"{@to}"
	});
	oViewer.bindAggregation("connectors","/lsp:relation/lsp:entity",oConnector);
	oViewer.attachClose(function(oControlEvent) {
		//oControlEvent.oSource.setRenderingSize(sap.landvisz.EntityCSSSize.Medium);
		alert("close event called");
	});

	//oViewer.addAggregation("systems",oLandEntity, false);

	oViewer.placeAt("content");

	// Tests Starts

	if(oViewer.getDefaultDependencyView() == DependencyType.NETWORK_VIEW) {

		QUnit.module("InitialTestForNetworkView");

		var oLandViewer = sap.ui.getCore().byId("viewer");

		QUnit.test("LandscapeViewerCreationOk", function(assert) {
			assert.expect(2);
			sap.ui.getCore().applyChanges();
			assert.equal(false, (jQuery(document.getElementById("viewer")) === undefined), "Checking if the Landscape Viewer Control is created and is not undefined.");
			assert.equal(false, (jQuery(document.getElementById("viewer")) === null), "Checking if the Landscape Viewer Control is created and is not null.");

		});

		QUnit.module("View Type");

		QUnit.test("LandscapeViewerTypeOk", function(assert) {
			sap.ui.getCore().applyChanges();
			assert.equal(false, (jQuery(document.getElementById("viewer")) === undefined), "Checking if the Landscape Viewer Control is created and is not undefined.");
			assert.equal(true, (oViewer.getViewType() === ViewType.DEPENDENCY_VIEW), "Dependency View exists");
			assert.equal(false, (oViewer.getViewType() == ViewType.SELECTION_VIEW), "Selection View does not exist");

		});

		QUnit.module("ToolBar Test");
		QUnit.test("ToolBarCreationOk", function(assert) {
			var oDomRef = document.getElementById("viewer-viewHeaderContainer");
			assert.ok(oDomRef, "toolbar exists in the page");
		});

		QUnit.module("Title Test");
		QUnit.test("ToolBarTitleCreationOk", function(assert) {
			var oDomRef = document.getElementById("viewer-viewTitle");
			assert.ok(oDomRef, "Title exists");
		});

		QUnit.module("Dependency Button Test");
		QUnit.test("DependencyButtonCreationOk", function(assert) {

			var oDomRef = document.getElementById("viewer-viewLables");
			assert.ok(oDomRef, "Network View and Box View Labels exist in the page");

			var oDomRef = document.getElementById("viewer-viewNetworkBtn");
			assert.ok(oDomRef, "Network View button exists");

			var oDomRef = document.getElementById("viewer-netwrokViewLable");
			assert.ok(oDomRef, "Network View Label exists");

			var oDomRef = document.getElementById("viewer-viewNetworkBtn-icon");
			assert.ok(oDomRef, "Network View button image exists");

			var oDomRef = document.getElementById("viewer-viewBoxBtn");
			assert.ok(oDomRef, "Box View button exists");

			var oDomRef = document.getElementById("viewer-boxViewLable");
			assert.ok(oDomRef, "Box View Label exists");

			var oDomRef = document.getElementById("viewer-viewBoxBtn-icon");
			assert.ok(oDomRef, "Box View button image exists");

		});

		QUnit.module("Close Button Test");
		QUnit.test("CloseButtonCreationOk", function(assert) {

			var oDomRef = document.getElementById("viewer-closeBtn");
			assert.ok(oDomRef, "Close Button exists");
		});


	} else if(oViewer.getDefaultDependencyView() == DependencyType.BOX_VIEW) {
	  	QUnit.module("InitialTestForBoxView");

		var oLandViewer = sap.ui.getCore().byId("viewer");

		QUnit.test("LandscapeViewerCreationOk", function(assert) {
			assert.expect(2);
			sap.ui.getCore().applyChanges();
			assert.equal(false, (jQuery(document.getElementById("viewer")) === undefined), "Checking if the Landscape Viewer Control is created and is not undefined.");
			assert.equal(false, (jQuery(document.getElementById("viewer")) === null), "Checking if the Landscape Viewer Control is created and is not null.");

		});

		QUnit.module("View Type");

		QUnit.test("LandscapeViewerTypeOk", function(assert) {
			sap.ui.getCore().applyChanges();
			assert.equal(false, (jQuery(document.getElementById("viewer")) === undefined), "Checking if the Landscape Viewer Control is created and is not undefined.");
			assert.equal(true, (oViewer.getViewType() === ViewType.DEPENDENCY_VIEW), "Dependency View exists");
			assert.equal(false, (oViewer.getViewType() == ViewType.SELECTION_VIEW), "Selection View does not exist");

		});

		QUnit.module("ToolBar Test");
		QUnit.test("ToolBarCreationOk", function(assert) {
			var oDomRef = document.getElementById("viewer-viewHeaderContainer");
			assert.ok(oDomRef, "toolbar exists in the page");
		});

		QUnit.module("Title Test");
		QUnit.test("ToolBarTitleCreationOk", function(assert) {
			var oDomRef = document.getElementById("viewer-viewHeaderContainer");
			assert.ok(oDomRef, "Title exists");
		});

		QUnit.module("Dependency Button Test");
		QUnit.test("DependencyButtonCreationOk", function(assert) {

			var oDomRef = document.getElementById("viewer-viewLables");
			assert.ok(oDomRef, "Network View and Box View Labels exist in the page");

			var oDomRef = document.getElementById("viewer-viewNetworkBtn");
			assert.ok(oDomRef, "Network View button exists");

			var oDomRef = document.getElementById("viewer-netwrokViewLable");
			assert.ok(oDomRef, "Network View Label exists");

			var oDomRef = document.getElementById("viewer-viewNetworkBtn-icon");
			assert.ok(oDomRef, "Network View button image exists");

			var oDomRef = document.getElementById("viewer-viewBoxBtn");
			assert.ok(oDomRef, "Box View button exists");

			var oDomRef = document.getElementById("viewer-boxViewLable");
			assert.ok(oDomRef, "Box View Label exists");

			var oDomRef = document.getElementById("viewer-viewBoxBtn-icon");
			assert.ok(oDomRef, "Box View button image exists");

		});

		QUnit.module("Close Button Test");
		QUnit.test("CloseButtonCreationOk", function(assert) {

			var oDomRef = document.getElementById("viewer-closeBtn");
			assert.ok(oDomRef, "Close Button exists");
		});

		QUnit.module("Box View Container Test");
		QUnit.test("BoxViewContainerCreationOk", function(assert) {

			var oDomRef = document.getElementById("viewer-viewContainer");
			assert.ok(oDomRef, "Box View Container exists");
		});

		QUnit.module("ConnectionEntityTest");
		QUnit.test("ConnectionEntityCreationOk", function(assert) {

			var oDomRef = document.getElementById("connection-viewer-0connectionRow");
			assert.ok(oDomRef, "Connection Entity 1 exists");

			var oDomRef = document.getElementById("connection-viewer-0connectionRow");
			assert.ok(oDomRef, "Connection Entity 2 exists");
		});


		QUnit.module("BoxViewLabelsTest");
		QUnit.test("BoxViewLabelsCreationOk", function(assert) {

			var oDomRef = document.getElementById("viewer-boxViewLabel0");
			assert.ok(oDomRef, "Level 1 label exists");

			var oDomRef = document.getElementById("viewer-boxViewLabel1");
			assert.ok(oDomRef, "Level 2 label exists");
		});

		QUnit.module("SystemsTest");
		QUnit.test("SystemsCreationOk", function(assert) {

			var oDomRef = document.getElementById("aminId-viewer-0");
			assert.ok(oDomRef, "Shared system exists");

			var oDomRef = document.getElementById("aminId-viewer-1");
			assert.ok(oDomRef, "System 2 exists");

//			var oDomRef = jQuery.sap.domById("aminId-viewer-2");
//			assert.ok(oDomRef, "System 3 exists");
		});


	}

});