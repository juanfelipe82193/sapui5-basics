// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global sap, jQuery, alert*/
sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (oMessageToast, oController) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.Side", {
        onInit: function () {
            // myComponent = this.getMyComponent();
            // if (myComponent.getComponentData().startupParameters) {
            //     jQuery.sap.log.debug("startup parameters of appnavsample are " + JSON.stringify(myComponent.getComponentData().startupParameters));
            // }
            // page = this.oView.getContent()[0];
            // srvc = sap.ushell.services.AppConfiguration;

            // if (srvc) {
            //     page.setShowFooter(true);
            //     oAppSettingsButton = new sap.m.Button({
            //         text: "App Settings",
            //         press: function() {
            //             alert('app settings button clicked');
            //         }
            //     });
            //     that = this;
            //     srvc.addApplicationSettingsButtons([oAppSettingsButton]);
            //     this.oActionSheet = new sap.m.ActionSheet({
            //         id: this.getView().getId() + "actionSheet",
            //         placement: sap.m.PlacementType.Top
            //     });
            //     this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
            //     this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
            //     this.oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton({
            //         id: this.getView().getId() + "saveAsTile"
            //     }));
            //     this.oActionsButton = new sap.m.Button({
            //         id: this.getView().getId() + "actionSheetButton",
            //         press: function() {
            //             that.oActionSheet.openBy(this);
            //         },
            //         icon: "sap-icon://action"
            //     });
            //     if (srvc && typeof srvc.getSettingsControl === "function") {
            //         page.setFooter(new sap.m.Bar({
            //             //                    contentLeft: srvc.getSettingsControl(),
            //             contentRight: this.oActionsButton
            //         }));
            //     }
            // }

            // // Store initial navigation in the model
            // var bIsInitialNavigation = sap.ushell.Container.getService("CrossApplicationNavigation").isInitialNavigation();
            // this.oModel = new sap.ui.model.json.JSONModel({
            //     isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
            //     isInitialNavigationColor: bIsInitialNavigation ? "green" : "red"
            // });
            // this.getView().setModel(this.oModel, "listModel");
        },
        onItemPressed: function (oEvent) {
            var sSelectedItemTitle = oEvent.getSource().getTitle();
            if (sSelectedItemTitle === "Intent Resolution") {
                this.oApplication.navigate("toView", "IntentResolution");
                return;
            }
            if (sSelectedItemTitle === "Settings") {
                this.oApplication.navigate("toView", "Settings");
                return;
            }
            if (sSelectedItemTitle === "Inbounds Browser") {
                this.oApplication.navigate("toView", "InboundsBrowser");
                return;
            }
            if (sSelectedItemTitle === "Get Easy Access Systems") {
                this.oApplication.navigate("toView", "GetEasyAccessSystems");
                return;
            }

            oMessageToast.show("Invalid Selection");
        },
        getMyComponent: function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },
        onExit: function () {
            // dialogs and popovers are not part of the UI composition tree and must
            // therefore be
            // destroyed explicitly in the exit handler
            if (this.oDialog) {
                this.oDialog.destroy();
            }
            if (this.oPopover) {
                this.oPopover.destroy();
            }
            if (this.oActionSheet) {
                this.oActionSheet.destroy();
            }
            if (this.oActionsButton) {
                this.oActionsButton.destroy();
            }
        }
    });

});
