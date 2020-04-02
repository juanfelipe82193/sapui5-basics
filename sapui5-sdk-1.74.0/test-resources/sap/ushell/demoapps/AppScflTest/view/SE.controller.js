jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("AppScflTest.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("AppScflTest.view.SE", {

	oModel : null,

	onInit : function() {
		jQuery.sap.includeStyleSheet("style.css");
		AppScflTest.util.Conversions.oResourceBundle = this.oApplicationFacade.getResourceBundle();

		this.oModel = new sap.ui.model.json.JSONModel();
		this.oModel.setData(
			{	"POLists" : [ {
					"Status": this.oApplicationFacade.getResourceBundle().getText("XFLD_Status_Open"),
					"CreatedAt": "20131018",
					"Value": "119.00",
					"Currency": "USD",
					"NumberOfItems" : 5,
					"OrderedDate" : "20131115",
					"SentOn": "20131107"
			 	} ]
			} );
		this.getView().setModel(this.oModel);
		this.getView().bindElement("/POLists/0");
		this.oHeaderFooterOptions = {
				sI18NDetailTitle : "XTIT_TrackPurchaseOrder",
				onBack : jQuery.proxy(this.goBack, this)
			};
		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
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