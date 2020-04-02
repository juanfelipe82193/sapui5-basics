// Required if you want to display some messages.
jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.controller("sap.ca.ui.sample.PictureViewer.PictureViewer", {



    onPictureDeleted: function (oEvent) {

        // get index of deleted picture
        var pictureIndex = oEvent.mParameters.index;

        sap.ca.ui.message.showMessageToast(
                "Delete clicked : index = " + pictureIndex
        );
    }
});