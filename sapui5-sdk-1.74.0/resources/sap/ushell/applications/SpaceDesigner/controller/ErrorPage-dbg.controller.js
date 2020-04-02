// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.SpaceDesigner.controller.ErrorPage", {
        /**
         * Called when the user has pressed the Maintain Pages link.
         *
         * @private
         */
        onLinkPress: function () {
            this.getRouter().navTo("overview", null, null, true);
        }
    });
});
