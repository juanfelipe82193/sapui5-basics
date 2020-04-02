/*


 ******  ******* ******  ******  *******  *****     *    ******* ******* ******  *** 
 *     * *       *     * *     * *       *     *   * *      *    *       *     * *** 
 *     * *       *     * *     * *       *        *   *     *    *       *     * *** 
 *     * *****   ******  ******  *****   *       *     *    *    *****   *     *  *  
 *     * *       *       *   *   *       *       *******    *    *       *     *     
 *     * *       *       *    *  *       *     * *     *    *    *       *     * *** 
 ******  ******* *       *     * *******  *****  *     *    *    ******* ******  *** 

     Update the AddPicture under demokit/samples
 */


sap.ui.controller("sap.ca.ui.sample.views.control.AddPicture", {

    onInit : function() {

        // Required if you want to display some messages.
        jQuery.sap.require("sap.ca.ui.message.message");
        // The following class is just a set of picture encoded in base64 for testing purpose only.
        // Remove it in a real application.
        jQuery.sap.require("sap.ca.ui.sample.images.base64");

        var page = this.getView().byId("page");
        util.UiFactory.fillPageHeader(page, this.getView(), util.Title.ADD_PICTURE, "sap.ca.ui.AddPicture");

        var model = new sap.ui.model.json.JSONModel({Pictures:[
            {
                "Name" : "Computer",
                "Source" : IMAGE_COMPUTER
            },
            {
                "Name" : "Light bulb",
                "Source": IMAGE_LIGHT_BULB
            },
            {
                "Name" : "Invoices",
                "Source": IMAGE_INVOICES
            },
            {
                "Name" : "Spiral",
                "Source": IMAGE_SPIRAL
            },
            {
                "Name" : "Building",
                "Source": IMAGE_BUILDING
            },
            {
                "Name" : "Screenshot",
                "Source": "./images/IMG_0093.PNG"
            }
        ]});

        this.getView().setModel(model);
    },

    onShow : function(oEvent) {

        var pictureItem = oEvent.mParameters.pictureItem;

        var extraInfo = "";
        if (pictureItem.isSourceDataUri()) {
            extraInfo = " MimeType is '"+pictureItem.getMimeType()+"'";
            var base64 = pictureItem.getBase64Encoding();
        }
        else {
            extraInfo = " URL is '"+pictureItem.getSource()+"'";
        }

        sap.ca.ui.message.showMessageToast(
            "Picture Item clicked : " + pictureItem.getName() + extraInfo
        );
    },

    onUploadFailed : function(oEvent) {

        var errorStatus = oEvent.mParameters.reason;
        var errorData = oEvent.mParameters.data;

        // don't directly use the status - it is not localised - this is just a sample
        sap.ca.ui.message.showMessageToast(
            errorStatus
        );
    },

    onFileNotSupported : function(oEvent){
        var errorMessage = oEvent.mParameters.fileNames + "\n Please upload image";

        sap.ca.ui.message.showMessageToast(
            errorMessage
        );
    }
});