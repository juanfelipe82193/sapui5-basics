jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.controller("sap.ca.ui.sample.views.control.PictureViewer", {

    onInit : function() {
        var page = this.getView().byId("page");
        util.UiFactory.fillPageHeader(page, this.getView(), util.Title.PICTURE_VIEWER, "sap.ca.ui.PictureViewer");
    },

    onPictureDeleted : function(oEvent) {

        // get index of deleted picture
        var pictureIndex = oEvent.mParameters.index;

        sap.ca.ui.message.showMessageToast(
            "Delete clicked : index = " + pictureIndex
        );
    }
});