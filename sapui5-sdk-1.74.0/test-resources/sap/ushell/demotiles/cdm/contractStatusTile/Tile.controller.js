// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, hasher */

    var S_NAMESPACE = "sap.ushell.demotiles.cdm.contractStatusTile";

    sap.ui.getCore().loadLibrary("sap.m");
    jQuery.sap.require("sap.ui.core.IconPool");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.components.tiles.utils");
    jQuery.sap.require("sap.ushell.components.tiles.utilsRT");

    sap.ui.controller(S_NAMESPACE + ".Tile", {

        onInit: function () {
            var oComponentDataProperties = this.getOwnerComponent().getComponentData().properties || {},
                oView = this.getView(),
                oModel;

            oModel = new sap.ui.model.json.JSONModel({
                tileTitle: oComponentDataProperties.title || "Contract Status",
                tileSubtitle: "invisible", // set dynamically
                refreshCount: 0,
                backgroundImage: jQuery.sap.getModulePath(S_NAMESPACE) + "/contract_status_visible.png",
                navigationTargetUrl: oComponentDataProperties.targetURL || "",
                search: { }
            });
            oView.setModel(oModel);

            //adopt tileSize behavior and updates
            sap.ushell.Container.getServiceAsync("Configuration").then(function (oService) {
                oService.attachSizeBehaviorUpdate(function (sSizeBehavior) {
                    oModel.setProperty("/sizeBehavior", sSizeBehavior);
                });
            });

            this.getView().addContent(this.getView().getTileControl());
        },

        refreshHandler: function (oTileController) {
            var oModel = this.getView().getModel();
            var nRefreshCount = oModel.getProperty("/refreshCount");

            // increase counter
            oModel.setProperty("/refreshCount", nRefreshCount + 1);

            // indicate the value just changed:
            oModel.setProperty("/stateArrow", "Up");
            oModel.setProperty("/numberState", "Good");

            window.setTimeout(function ()  {
                oModel.setProperty("/stateArrow", "None");
                oModel.setProperty("/numberState", "Neutral");
            }, 10000);
        },

        visibleHandler: function (isVisible) {
            var oModel = this.getView().getModel();
            if (isVisible) {
                oModel.setProperty("/icon", "sap-icon://show");
                oModel.setProperty("/tileSubtitle", "visible");
            } else {
                oModel.setProperty("/icon", "sap-icon://hide");
                oModel.setProperty("/tileSubtitle", "invisible");
            }
        },

        setVisualPropertiesHandler: function (oNewProperties) {
            if (oNewProperties.title) {
                this.getView().getModel().setProperty("/tileTitle", oNewProperties.title);
            }
        },


        onExit: function () {
        },

        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function () {
            var oModel = this.getView().getModel(),
                sTargetUrl = oModel.getProperty("/navigationTargetUrl");

            if (sTargetUrl) {
                if (sTargetUrl[0] === "#") {
                    hasher.setHash(sTargetUrl);
                } else {
                    window.open(sTargetUrl, "_blank");
                }
            }
        }
    });
}());
