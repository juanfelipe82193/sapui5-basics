// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
(function () {
    "use strict";
    /*global jQuery, sap, window*/
    jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
    jQuery.sap.require("sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator");

    sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.ca.scfld.stableids.app.view.S4", {

        onInit: function () {
            var view = this.getView();
            this.oRouter.attachRouteMatched(function (oEvent) {
                if (oEvent.getParameter("name") === "subDetail") {
                    var context = new sap.ui.model.Context(view.getModel(), '/'
                        + oEvent.getParameter("arguments").contextPath);
                    view.setBindingContext(context);
                }
            }, this);
            this.oHeaderFooterOptions = sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator
                .createHeaderFooterOptions("fullscreen") || {};
            this.setHeaderFooterOptions(this.oHeaderFooterOptions);
        },

        navBack: function () {
            // this.nav.back();
            window.history.back();
        },

        isMainScreen: function () {
            var bResult = true,
                mParams = jQuery.sap.getUriParameters().mParams;
            if (mParams["fullscreen.isMainScreen"] !== undefined) {
                bResult = mParams["fullscreen.isMainScreen"][0] != "false";
            }
            return bResult;
        }
    });
}());