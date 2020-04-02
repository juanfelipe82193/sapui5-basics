sap.ui.define("ManageSalesOrderWithTableTabs.ext.controller.ListReportExtension", [
	"sap/m/ComboBox",
	"sap/ui/model/Filter",
	"sap/ui/comp/smartfilterbar/SmartFilterBar"
], function(ComboBox, Filter, SmartFilterBar) {
	"use strict";

	return {
		modifyStartupExtension: function(oStartupObject) {
			oStartupObject.selectedQuickVariantSelectionKey = "1";
			oStartupObject.selectionVariant.addSelectOption("GrossAmount","I","LT","15000");
		},	
		onBeforeRebindTableExtension: function(oEvent) {
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
						case "0" :
							oBindingParams.filters.push(new Filter("GrossAmount", "LT", "10000"));
							break;
						case "1" :
							oBindingParams.filters.push(new Filter("GrossAmount", "GE", "10000"));
							break;
						default :
							break;
					}
				}
			}
		}
	};
});
