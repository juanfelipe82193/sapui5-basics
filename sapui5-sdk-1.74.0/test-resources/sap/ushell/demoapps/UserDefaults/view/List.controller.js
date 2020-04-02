// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    sap.ui.controller("sap.ushell.demo.UserDefaults.view.List", {
        oApplication: null,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf view.List
         */
        onInit: function () {
            var page = this.oView.getContent()[0], srvc = sap.ushell.services.AppConfiguration, oActionSheet, oActionsButton;
            if (srvc) {
                page.setShowFooter(true);
                oActionSheet = new sap.m.ActionSheet({ placement: sap.m.PlacementType.Top });
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton());
                oActionsButton = new sap.m.Button({
                    press: function () {
                        oActionSheet.openBy(this);
                    },
                    icon: "sap-icon://action"
                });

                page.setFooter(new sap.m.Bar({
                    contentRight: oActionsButton
                }));
            }
        },

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * handles changing of the view
         */
        onViewSelectionChange: function (oEvent) {
            var oItemParam = oEvent.getParameter("listItem");
            var oItem = (oItemParam) ? oItemParam : oEvt.getSource();

            if (/editor/.test(oItem.getId())) {
                this.getRouter().navTo("toEditor");
                return;
            }
            if (/usedParams/.test(oItem.getId())) {
                this.getRouter().navTo("toUsedParams");
                return;
            }
            if (/showEvents/.test(oItem.getId())) {
                this.getRouter().navTo("toShowEvents");
                return;
            }
        },
    });
}());
