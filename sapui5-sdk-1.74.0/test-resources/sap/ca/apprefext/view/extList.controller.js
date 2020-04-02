//handleTaskItemPress
jQuery.sap.require("i2d.qm.qualityissue.confirm.apprefExt.util.Formatter");

sap.ui.controller("i2d.qm.qualityissue.confirm.apprefExt.view.extList", {

    /**
     * @override
     *
     * Called by the UI5 runtime to init this controller
     *
     */
    onInit: function () {
        // save original _getCreateObject as super and overwrite it locally
        this.fnSuper_openBusinessCard = i2d.qm.qualityissue.confirm.appref.view.S3.prototype.openBusinessCard;
    },

    openBusinessCard: function (oEvent) {
        jQuery.sap.require("sap.m.MessageToast");
        var i18nModel = this.getView().getModel("i18n");
        sap.m.MessageToast.show(i18nModel.getProperty("INFO_OPENING_CARD"));
        this.fnSuper_openBusinessCard(oEvent);
    },

    handleTaskItemPress : function(e){
    	//Navigating to a new view.
    	this.oRouter.navTo("taskDetail", {
    		contextPath : e.getSource().getBindingContext().sPath.substr(1),
    	});

    },

    doConfirm : function(e){
    	jQuery.sap.require("sap.ca.ui.dialog.factory");
    	var resourceBundle = this.oApplicationFacade.getResourceBundle();

    	// provide your callback function, so that you can get informed if the end user confirms or cancels the dialog
    	var fnClose = function(oResult) {
    	    if (oResult) {
    	        if (oResult.sNote) {
    	        	//DO SOMETHING ON CLOSE. THIS IS A DUMMY FUNCTION
    	        }
    	    }
    	};

    	//open the confirmation dialog
    	/*The resource bundle is not enhanced with the extension i18n properties.
    	 * Hence, since this text is from the extension application, use the view's model instead.
    	 * NOTE : the model's name has to be known.*/
    	var i18nModel = this.getView().getModel("i18n");
    	sap.ca.ui.dialog.confirmation.open({
    	    question : resourceBundle.getText("CONFIRM_QUESTION"),
    	    showNote : true,
    	    title : resourceBundle.getText("SEND"),
    	    confirmButtonLabel : resourceBundle.getText("SEND")
    	}, fnClose);
    },

    onDataReceived: function(oDataFromS3){ // oSomeData will be passed in
        if (oDataFromS3 && oDataFromS3.oData.Pictures.length > 3) {
              oDataFromS3.oData.Pictures[4]=oDataFromS3.oData.Pictures[3];
        }
     } // no need to return anything as in this example the original object is modified
});
