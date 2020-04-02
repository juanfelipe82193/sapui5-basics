// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/ui/Device",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources"
], function (
    Log,
    Device,
    UIComponent,
    JSONModel,
    Config,
    EventHub,
    resources
) {
    "use strict";

    function getProductSwitchButton () {
        return sap.ui.getCore().byId("productSwitchBtn");
    }

    function getProductSwitchPopover () {
        return sap.ui.getCore().byId("sapUshellProductSwitchPopover");
    }

    function removeProductSwitch () {
        sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem("productSwitchBtn");
    }

    return UIComponent.extend("sap.ushell.components.shell.ProductSwitch.Component", {

        metadata: {
            version: "1.74.0",
            library: "sap.ushell.components.shell.ProductSwitch",
            dependencies: {
                libs: ["sap.m", "sap.f"]
            }
        },

        createContent: function () {
            this.oModel = this._getModel();
            this.aDoables = [];
        },

        _getModel: function () {
            var that = this,
                oModel = new JSONModel();
            oModel.loadData(Config.last("/core/productSwitch/url"))
                .then(function () {
                    var aProducts = oModel.getData();
                    if (aProducts.length === 0) {
                        Log.debug("There are no other profucts configured for your user. ProductSwitch button will be hidden.");
                        removeProductSwitch();
                    } else {
                        getProductSwitchButton().setVisible(true);
                        that.aDoables.push(EventHub.on("showProductSwitch").do(that._openProductSwitch.bind(that)));
                    }
                })
                .catch(function (err) {
                    Log.debug(err);
                    removeProductSwitch();
                });
            return oModel;
        },

        _openProductSwitch: function () {
            var oPopover = getProductSwitchPopover();
            if (!oPopover) {
                oPopover = sap.ui.xmlfragment("sap.ushell.components.shell.ProductSwitch.ProductSwitch", this);
                oPopover.setModel(this.oModel);
                oPopover.setModel(resources.i18nModel, "i18n");
                if (Device.system.phone) {
                    oPopover.setShowHeader(true);
                }
            }
            var oSource = getProductSwitchButton();
            // if the button is hidden in the overflow, use the overflow button itself
            if (!oSource || !oSource.$().width()) {
                oSource = sap.ui.getCore().byId("endItemsOverflowBtn");
            }

            oPopover.openBy(oSource);
        },

        onProductItemPress: function (oEvent) {
            var sTargetUrl = oEvent.getParameter("itemPressed").getTargetSrc();
            getProductSwitchPopover().close();
            window.open(sTargetUrl, "_blank");
        },


        exit: function () {
            var oPopover = getProductSwitchPopover();
            if (!oPopover) {
                oPopover.destroy();
            }
            this.aDoables.forEach(function (oDoable) {
                oDoable.off();
            });
        }
    });

});
