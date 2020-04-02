sap.ui.controller("sap.ushell.sample.AddBookmarkButton.AddBookmarkSample", {
    onInit : function () {

        jQuery.sap.require("sap.ushell.services.Container");
        jQuery.sap.require("sap.ushell.services.AppConfiguration");
        jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config", 0).groups =  [
            {
                id: "group_1",
                title: "Sample Group",
                isPreset: true,
                isVisible: true,
                isGroupLocked: false,
                tiles: []
            }];

        if(sap.ushell.Container){
            delete sap.ushell.Container;
        }

        // tell SAPUI5 that this boot task is done once the container has loaded
        sap.ushell.bootstrap("local");
    },

    onAfterRendering : function () {
        "use strict";
        var oView = this.getView();
        var oButton = oView.getContent()[0];
        oButton._handleOkButtonPress = function () {
            jQuery.sap.require("sap.m.MessageToast");
            this.oDialog.close();
            sap.m.MessageToast.show(sap.ushell.resources.i18n.getText('tile_created_msg'), { duration: 3000 });
        };
        oButton.setEnabled = function (bValue) {
            this.setProperty("enabled", bValue);
        };
        oButton.setEnabled(true);
    }
});