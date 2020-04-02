sap.ui.define("STTA_SO_ND.ext.controller.ListReportExtension", [	
], function() {
	"use strict";

	return {	
		onCopy: function(){
			var oModel = this.getView().getModel();
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oTransactionController = this.extensionAPI.getTransactionController();
			var aContexts = this.extensionAPI.getSelectedContexts();
			var oContextObject = aContexts[0].getObject();
			var oContextData = {
				BusinessPartnerID: oContextObject.BusinessPartnerID,
				LifecycleStatus: oContextObject.LifecycleStatus,
				CurrencyCode: oContextObject.CurrencyCode,
				GrossAmount: oContextObject.GrossAmount
			};
			var oCreateContext = oTransactionController.createEntry(oContextData);                        
			oNavigationController.navigateInternal(oCreateContext);              
		}
	};
});
