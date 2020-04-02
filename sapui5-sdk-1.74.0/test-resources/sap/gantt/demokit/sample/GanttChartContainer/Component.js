sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
	"./localService/mockserver"
], function (UIComponent, JSONModel, ODataModel, ResourceModel, mockserver) {
	"use strict";

	return UIComponent.extend("sap.gantt.sample.GanttChartContainer.Component", {
		metadata: {
			rootView: {
				"id": "RootView",
				"viewName": "sap.gantt.sample.GanttChartContainer.GanttChartContainer",
				"type": "XML",
				"async": true
			},

			dependencies: {
				libs: [
					"sap.gantt",
					"sap.ui.table",
					"sap.m"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"i18n/i18n.properties",
						"localService/mockserver.js",
						"localService/metadata.xml",
						"localService/mockdata/Calendars.json",
						"localService/mockdata/Requirements.json",
						"localService/mockdata/Resources.json",
						"localService/mockdata/UtilizationItems.json",
						"localService/mockdata/Utilizations.json",
						"model/formatter.js",
						"view/AxisTimeStrategy.fragment.xml",
						"view/DetailPopover.fragment.xml",
						"view/FreightOrder.fragment.xml",
						"view/FreightOrderAndFreightUnit.fragment.xml",
						"view/FreightUnit.fragment.xml",
						"view/OrderCreate.fragment.xml",
						"view/Requirement.fragment.xml",
						"view/SharedTableColumn.fragment.xml",
						"view/Truck.fragment.xml",
						"Component.js",
						"GanttChartContainer.controller.js",
						"GanttChartContainer.view.xml",
						"UtilizationGroup.js"
					]
				}
			}
		},
		init : function (){
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			var sODataServiceUrl = "sap.gantt.GanttChartContainer/";

			// init our mock server
			this._oMockServer = mockserver.init(sODataServiceUrl);

			// set model on component
			this.setModel(
				new ODataModel(sODataServiceUrl, {
					json : true,
					useBatch : true
				}), "data"
			);

			this.setModel(
				new ResourceModel({
					bundleName: "sap.gantt.sample.GanttChartContainer.i18n.i18n"
				}), "i18n"
			);

			var oCalJSONModel = new JSONModel();
			oCalJSONModel.loadData(jQuery.sap.getModulePath("sap.gantt.sample.GanttChartContainer.localService.mockdata", "/Calendars.json"));
			this.setModel(oCalJSONModel, "calc");
		},
		exit: function () {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		}
	});
});
