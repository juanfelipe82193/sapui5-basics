// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
(function () {
    "use strict";
    /*global jQuery, sap*/
    jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
    jQuery.sap.require("sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator");

    sap.ca.scfld.md.controller.BaseDetailController.extend("sap.ca.scfld.stableids.app.view.S3", {

        onInit : function () {
            var view = this.getView();

            this.oRouter.attachRouteMatched(function (oEvent) {
                if (oEvent.getParameter("name") === "detail") {
                    var context = new sap.ui.model.Context(view.getModel(),
                        '/' + oEvent.getParameter("arguments").contextPath);
                    view.setBindingContext(context);
                }
            }, this);

            this.oHeaderFooterOptions = sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator
                .createHeaderFooterOptions("detail") || {};

            this.setHeaderFooterOptions(this.oHeaderFooterOptions);
        },

        isMainScreen : function () {
            return true;
        },
        navToSubview : function () {
            this.oRouter.navTo("subDetail", {
                contextPath : this.getView().getBindingContext().getPath().substr(1)
            });
        },
        navToEmpty : function () {
            this.oRouter.navTo("noData", {viewTitle: "CUSTOM_TITLE",
                languageKey: "NO_ITEMS_AVAILABLE"});
        },
        refreshList: function () {
            this.oConnectionManager.getModel().refresh();
        }
    });
}());