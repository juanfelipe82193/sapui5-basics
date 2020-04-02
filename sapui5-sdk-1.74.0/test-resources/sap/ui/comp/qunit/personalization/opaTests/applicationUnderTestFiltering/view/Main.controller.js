sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel'
], function(
	Controller,
	ODataModel
) {
	"use strict";

	return Controller.extend("view.Main", {

		onInit: function() {
			var oModel = new ODataModel("applicationUnderTestFiltering");
			this.getView().setModel(oModel);
		},

		enableCETable: function() {
			//Table code editors
			var oCodeEditorTableController = this.getView().byId("dataTableController");
			var oCodeEditorTable = this.getView().byId("dataTable");

			//Table + controller
			var oTable = this.getView().byId("IDSmartTable");
			var oPersoControllerTable = this.getView().byId("IDSmartTable")._oPersController;

			oPersoControllerTable.attachEvent("afterP13nModelDataChange", function(){
				var oFilterDataTableController = oPersoControllerTable._getControlData().filter.filterItems;
				oCodeEditorTableController.setValue(JSON.stringify(oFilterDataTableController, null, '  '));
			});

			oTable.attachEvent("beforeRebindTable", function(mParams){
				var oFilterDataTable = mParams.getParameter("bindingParams").filters;
				oCodeEditorTable.setValue(JSON.stringify(oFilterDataTable,null,'  '));
			});
		},

		enableCEChart: function() {
			//Chart code editors
			var oCodeEditorChartController = this.getView().byId("dataChartController");
			var oCodeEditorChart = this.getView().byId("dataChart");

			//Chart + controller
			var oChart = this.getView().byId("IDSmartChart");
			var oPersoControllerChart = this.getView().byId("IDSmartChart")._oPersController;

			oPersoControllerChart.attachEvent("afterP13nModelDataChange", function(){
				var oFilterDataChartController = oPersoControllerChart._getControlData().filter.filterItems;
				oCodeEditorChartController.setValue(JSON.stringify(oFilterDataChartController, null, '  '));
			});

			oChart.attachEvent("beforeRebindChart", function(mParams){
				var oFilterDataChart = mParams.getParameter("bindingParams").filters;
				oCodeEditorChart.setValue(JSON.stringify(oFilterDataChart,null,'  '));
			}, this);
		}
	});
});
