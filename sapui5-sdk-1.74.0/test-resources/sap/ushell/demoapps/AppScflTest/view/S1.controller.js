jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("AppScflTest.util.Conversions");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("AppScflTest.view.S1", {

	oModel : null,

	onInit : function() {
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
		var oRouter = this.oRouter;
		this.oHeaderFooterOptions = {
			sI18NFullscreenTitle : "XTIT_TrackPurchaseOrder",
			oPositiveAction : {
				sI18nBtnTxt : "START_TEXT",
				onBtnPressed : function() {
					oRouter.navTo("master", {}, false);
				}
			},
            aAdditionalSettingButtons : [{
                id: "scfldTestButton",
                sI18nBtnTxt :"App Settings",
                onBtnPressed : function (){
                    alert('app settings clicked');
                }
            }]
        };
		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},

});