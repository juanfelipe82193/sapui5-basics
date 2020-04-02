sap.ui.define("ManageSalesOrderWithSegButtons.ext.controller.ListReportExtension", [	
], function () {
	"use strict";

	return {
		onEnableWithExt: function () {
			this.extensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Setenabledstatus", this.extensionAPI.getSelectedContexts());
		},
		onDisableWithExt: function () {
			this.extensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Setdisabledstatus", this.extensionAPI.getSelectedContexts());
		}
	};
});