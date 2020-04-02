sap.ui.require([
	"sap/ui/comp/smartvariants/SmartVariantManagement",
	"sap/ui/comp/smarttable/SmartTable",
	"sap/ui/comp/smartchart/SmartChart",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/table/Table",
	"sap/m/library",
	"sap/m/Bar",
	"sap/m/Panel",
	"sap/m/Title",
	"sap/m/Toolbar",
	"sap/m/ToolbarSpacer",
	"sap/m/ToolbarSeparator"

], function (
		SmartVariantManagement,
		SmartTable,
		SmartChart,
		FilterBar,
		Table,
		mLibrary,
		Bar,
		Panel,
		Title,
		Toolbar,
		ToolbarSpacer,
		ToolbarSeparator
	) {
	"use strict";

	var oPanel = new Panel({
		headerText: "Bar in table",
		expandable: true,
		expanded: false
	});

	var oBar = new Bar({
		contentLeft:[
					new Title({ text: "Title" })
					],
		contentMiddle:[
					new SmartVariantManagement()
					],
		design: mLibrary.BarDesign.Header
	});
	var oTable = new Table({ extension: oBar });
	oTable.addStyleClass("sapUiSizeCompact");
	oTable.setVisibleRowCount(1);
	oPanel.addContent(oTable);


	var oBar2 = new Bar({
		contentLeft:[
					new Title({ text: "Title" })
					],
		contentMiddle:[
					new SmartVariantManagement()
					],
		design: mLibrary.BarDesign.Header
	});
	oTable = new Table({ extension: oBar2 });
	oTable.addStyleClass("sapUiSizeCozy");
	oTable.setVisibleRowCount(1);
	oPanel.addContent(oTable);


	var oBar3 = new Bar({
		contentLeft:[
					new Title({ text: "Title" })
					],
		contentMiddle:[
					new SmartVariantManagement()
					],
		design: mLibrary.BarDesign.Header
	});
	oTable = new Table({ extension: oBar3 });
	oTable.setVisibleRowCount(1);
	oPanel.addContent(oTable);

	oPanel.placeAt("content");

	//-----------------------------------------------------------

	oPanel = new Panel({
		headerText: "SmartTable",
		expandable: true,
		expanded: false
	});

	var oST = new SmartTable({ persistencyKey: "X" });
	oST.getTable().setVisibleRowCount(1);
	oST._createVariantManagementControl();
	oST._createToolbarContent();
	oPanel.addContent(oST);

	oST = new SmartTable({ persistencyKey: "X" });
	oST.getTable().setVisibleRowCount(1);
	oST._createVariantManagementControl();
	oST._createToolbarContent();
	oST.addStyleClass("sapUiSizeCozy");
	oPanel.addContent(oST);

	oST = new SmartTable({ persistencyKey: "X" });
	oST.getTable().setVisibleRowCount(1);
	oST._createVariantManagementControl();
	oST._createToolbarContent();
	oST.addStyleClass("sapUiSizeCompact");
	oPanel.addContent(oST);

	oPanel.placeAt("content");

	//-----------------------------------------------------------
	oPanel = new Panel({
		headerText: "SmartChart",
		expandable: true,
		expanded: false
	});

	var oSC = new SmartChart({ persistencyKey: "X" });
	oSC._createVariantManagementControl();
	oSC._oChart = {
		attachRenderComplete: function () { },
		attachDeselectData: function () { },
		attachSelectData: function () { },
		getChartType: function () { }
	};
	oSC._createToolbar();
	oSC._createToolbarContent();
	oPanel.addContent(oSC);

	oSC = new SmartChart({ persistencyKey: "X" });
	oSC._createVariantManagementControl();
	oSC._oChart = {
		attachRenderComplete: function () { },
		attachDeselectData: function () { },
		attachSelectData: function () { },
		getChartType: function () { }
	};
	oSC._createToolbar();
	oSC._createToolbarContent();
	oSC.addStyleClass("sapUiSizeCozy");
	oPanel.addContent(oSC);

	oSC = new SmartChart({ persistencyKey: "X" });
	oSC._createVariantManagementControl();
	oSC._oChart = {
		attachRenderComplete: function () { },
		attachDeselectData: function () { },
		attachSelectData: function () { },
		getChartType: function () { }
	};
	oSC._createToolbar();
	oSC._createToolbarContent();
	oSC.addStyleClass("sapUiSizeCompact");
	oPanel.addContent(oSC);

	oPanel.placeAt("content");

	//-----------------------------------------------------------
	oPanel = new Panel({
		headerText: "In Toolbar",
		expandable: true,
		expanded: false
	});

	var oTB = new Toolbar({
		content: new SmartVariantManagement()
	});
	oPanel.addContent(oTB);

	oTB = new Toolbar({
		content: new SmartVariantManagement()
	});
	oTB.addStyleClass("sapUiSizeCozy");
	oPanel.addContent(oTB);

	oTB = new Toolbar({
		content: new SmartVariantManagement()
	});
	oTB.addStyleClass("sapUiSizeCompact");
	oPanel.addContent(oTB);

	oPanel.placeAt("content");

	//-----------------------------------------------------------
	oPanel = new Panel({
		headerText: "In FilterBar",
		expandable: true,
		expanded: false
	});

	var oFB = new FilterBar({ persistencyKey: "X" });
	oPanel.addContent(oFB);

	oFB = new FilterBar({ persistencyKey: "X" });
	oFB.addStyleClass("sapUiSizeCozy");
	oPanel.addContent(oFB);

	oFB = new FilterBar({ persistencyKey: "X" });
	oFB.addStyleClass("sapUiSizeCompact");
	oPanel.addContent(oFB);

	oPanel.placeAt("content");
});