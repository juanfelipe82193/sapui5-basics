jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("AppScflTest.util.Dialog");

sap.ca.scfld.md.controller.BaseDetailController.extend("AppScflTest.view.S5", {

	// global view parameters
	sOrigin : "",
	sYear : "",
	sDocId : "",
	sDocType : "",

	onInit : function() {
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "GoodsReceipt") {
				this.sOrigin = oEvent.getParameter("arguments").origin;
				this.sYear = oEvent.getParameter("arguments").year;
				this.sDocId = oEvent.getParameter("arguments").docid;
				var oParams = oEvent.getParameter("arguments")["?params"];
				this.sDocType = (oParams && oParams.doctype) ? oParams.doctype : this.oApplicationFacade.getResourceBundle().getText("XTIT_GoodsReceipt") ;
				var oObjectHeader = this.byId("GoodsReceiptObjectHeader");
				if (oObjectHeader)
					oObjectHeader.setTitle(this.sDocType);
				this.oHeaderFooterOptions = {
					sI18NDetailTitle : this.sDocType,
					onBack : jQuery.proxy(this.goBack, this)
				};
				this.setHeaderFooterOptions(this.oHeaderFooterOptions);
				// workaround for different syntactical requirements of UI5 mock server and Gateway server
				if (this.oApplicationFacade.isMock())
					this.getView().bindElement("/GoodsReceiptHeaders(SAP__Origin='" + this.sOrigin + "',GoodsReceiptNumber='" + this.sDocId + "',Year='" + this.sYear + "')?$expand=GoodsReceiptItems");
				else
					this.getView().bindElement("/GoodsReceiptHeaders(SAP__Origin='" + this.sOrigin + "',GoodsReceiptNumber='" + this.sDocId + "',Year=" + this.sYear + ")?$expand=GoodsReceiptItems");
			}
		}, this);
	},

	showSupplierBusinessCard : function(oEvent) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("XFLD_SupplierInfo");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());
		AppScflTest.util.Dialog.showSupplierBusinessCard(sTitle, sSupplierId, oEvent.getSource(), this.sOrigin, this.oApplicationFacade );
	},

	showEmployeeBusinessCard : function(oEvent) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("XFLD_Contact");
		var sEmployeeId = this.oApplicationFacade.getODataModel().getProperty("CreatedByID", this.getView().getBindingContext());
		AppScflTest.util.Dialog.showEmployeeBusinessCard(sTitle, sEmployeeId, oEvent.getSource(), this.sOrigin, this.oApplicationFacade );
	},

	goBack : function(oEvent) {
		var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call to identify deep link situation
		if (sDir && sDir !== "Unknown") {
			window.history.go(-1);
		} else {
			this.oRouter.navTo("master", {}, true);
		}
	}

});