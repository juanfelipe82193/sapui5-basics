// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Label",
    "sap/ushell/resources",
    "sap/ui/Device",
    "sap/m/Switch",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/HBox",
    "sap/m/FlexItemData",
    "sap/m/VBox"
], function (
    Label,
    resources,
    Device,
    Switch,
    mobileLibrary,
    Text,
    HBox,
    FlexItemData,
    VBox
) {
    "use strict";

    // shortcut for sap.m.SwitchType
    var SwitchType = mobileLibrary.SwitchType;

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.UsageAnalyticsSelector", {
        createContent: function (/*oController*/) {
            var sFBoxAlignItems = Device.system.phone ? "Start" : "Center",
                sFlexWrap = Device.system.phone ? "Wrap" : "NoWrap",
                sFBoxDirection = Device.system.phone ? "Column" : "Row",
                sTextAlign = Device.system.phone ? "Left" : "Right",
                sAllignSelf = Device.system.phone ? "Baseline" : "Auto",
                sWidth = Device.system.phone ? "auto" : "11.75rem";

            this.oLabel = new Label({
                width: sWidth,
                textAlign: sTextAlign,
                text: resources.i18n.getText("allowTracking") + ":"
            }).addStyleClass("sapUshellUsageAnalyticsSelectorLabel");

            this.oSwitchButton = new Switch("usageAnalyticsSwitchButton", {
                type: SwitchType.Default
            }).addStyleClass("sapUshellUsageAnalyticsSelectorSwitchButton");

            this.oMessage = new Text({
                text: sap.ushell.Container.getService("UsageAnalytics").getLegalText()
            }).addStyleClass("sapUshellUsageAnalyticsSelectorLegalTextMessage");

            this.fBox = new HBox({
                alignItems: sFBoxAlignItems,
                wrap: sFlexWrap,
                direction: sFBoxDirection,
                height: "2rem",
                items: [
                    this.oLabel,
                    this.oSwitchButton
                ],
                layoutData: new FlexItemData({ alignSelf: sAllignSelf })
            });

            this.vBox = new VBox({
                items: [this.fBox, this.oMessage]
            });

            return this.vBox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.UsageAnalyticsSelector";
        }
    });
}, /* bExport= */ true);
