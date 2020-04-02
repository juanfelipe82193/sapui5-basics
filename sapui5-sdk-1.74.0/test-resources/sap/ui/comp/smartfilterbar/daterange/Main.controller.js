sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageToast"
], function(
	Controller,
	ODataModel,
	MessageToast
) {
	"use strict";

	return Controller.extend("DateRangeSample.Main", {
		onInit: function() {
			var oModel, oView;

			oModel = new ODataModel("sapuicompsmarttable", true);
			oView = this.getView();
			oView.setModel(oModel);
			this.oData = null;

			this.getView().byId('smartFilterBar').attachPendingChange(function(oEvent) {
				if (oEvent.getParameter("pendingValue") === false) {
					MessageToast.show("PendingValue is false");
				}
			});

		},

		serializeFilterData: function() {
			this.oData = this.getView().byId('smartFilterBar').fetchVariant(true);
			//this.getView().byId("outputArea").setValue(JSON.stringify(this.oData, null, '  '));
			var oFilterBarVariant = JSON.parse(this.oData.filterBarVariant);
			this.getView().byId("outputArea").setValue(JSON.stringify(oFilterBarVariant, null, '  '));
		},

		deserializeFilterData: function() {
			if (this.oData) {
				var oSmartFilterbar = this.getView().byId('smartFilterBar');
				oSmartFilterbar.applyVariant(this.oData, true);

				MessageToast.show("isPending() = " + oSmartFilterbar.isPending());
			}
		},

		serializeDataSuiteFormat: function() {
			this.oDSData = this.getView().byId('smartFilterBar').getDataSuiteFormat();
			this.getView().byId("outputArea").setValue(JSON.stringify(JSON.parse(this.oDSData), null, '  '));
		},

		deserializeDataSuiteFormat: function() {
			if (this.oDSData) {
				var oSmartFilterbar = this.getView().byId('smartFilterBar');
				oSmartFilterbar.setDataSuiteFormat(this.oDSData);

				MessageToast.show("isPending() = " + oSmartFilterbar.isPending());
			}
		},

		toggleTimeHandling: function() {
			var oSmartFilterbar = this.getView().byId('smartFilterBar');
			var oConditionType = oSmartFilterbar.getConditionTypeByKey("BLDAT");
			oConditionType.setIgnoreTime(!oConditionType.getIgnoreTime());
		},

		toggleLiveMode: function() {
			var oSmartFilterbar = this.getView().byId('smartFilterBar');
			oSmartFilterbar.setLiveMode(!oSmartFilterbar.getLiveMode());
		},

		destroyFilterbar: function() {
			var oSmartFilterbar = this.getView().byId('smartFilterBar');
			oSmartFilterbar.destroy();
			oSmartFilterbar = null;
		}

	});
});