sap.ui.define("SOMULTIENTITY.ext.controller.ListReport", [
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/m/ComboBox",
	"sap/ui/model/Filter"
], function (SmartFilterBar, ComboBox, Filter) {
	"use strict";
	return {
		onInit: function () {
			var oSmartTable = this._getSmartTable();
		},
		onBeforeRebindTableExtension: function (oEvent) {
			//debugger;
			// usually the value of the custom field should have an
			// effect on the selected data in the table. So this is
			// the place to add a binding parameter depending on the
			// value in the custom field.
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.parameters = oBindingParams.parameters || {};

			var oSmartFilterBar = this.byId("listReportFilter");
			if (oSmartFilterBar instanceof SmartFilterBar) {
				var oCustomControl = oSmartFilterBar.getControlByKey("CustomGrossAmountFilter");
				if (oCustomControl instanceof ComboBox) {
					var vCategory = oCustomControl.getSelectedKey();
					switch (vCategory) {
						case "0":
							oBindingParams.filters.push(new Filter("GrossAmount", "LT", "10000"));
							break;
						case "1":
							oBindingParams.filters.push(new Filter("GrossAmount", "GE", "10000"));
							break;
						default:
							break;
					}
				}
			}
		},
		_getSmartTable: function () {
			return this.getView().byId("listReport");
		},
		onListNavigationExtension: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oObject = oBindingContext.getObject();
			var sNavigationProperty;
			switch (oObject.BusinessPartnerID) {
				case "100000000":
					sNavigationProperty = "to_BillingStatus";
					break;
			}

			if (sNavigationProperty) {
				var oExtensionAPI = this.extensionAPI;
				var fnNavigate = function () {
					return new Promise(function (fnResolve, fnReject) {
						var oModel = oBindingContext.getModel();
						var oTarget;
						oModel.createBindingContext(sNavigationProperty, oBindingContext, {}, function (oTarget) {
							var oNavigationController = oExtensionAPI.getNavigationController();
							oNavigationController.navigateInternal(oTarget);
							fnResolve();
						});
					});
				};
				oExtensionAPI.securedExecution(fnNavigate);
				return true;
			}
			return false;
		}
	};
});