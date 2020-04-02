// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * View for displaying the User Profiling entires such as Usageamalytice ans Personalized Search.
 * The View is launched when the UserProfiling option is chosen in the USerSettings UI.
 * Content is added to this View by adding an entry to the profilingEntries in shell.controller.
 */
sap.ui.define([
    "sap/m/VBox"
], function (VBox) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.UserProfiling", {
        createContent: function (/*oController*/) {
            this.profilingContent = new VBox().addStyleClass("sapUshellUserSettingDetailContent");
            return this.profilingContent;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.UserProfiling";
        }
    });
});
