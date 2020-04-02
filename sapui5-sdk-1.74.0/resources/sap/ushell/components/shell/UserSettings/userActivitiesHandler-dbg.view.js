// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/VBox",
    "sap/m/Button",
    "sap/m/FlexBox",
    "sap/m/library",
    "sap/m/Switch",
    "sap/m/Label",
    "sap/ui/Device",
    "sap/ushell/resources"
], function (
    VBox,
    Button,
    FlexBox,
    mobileLibrary,
    Switch,
    Label,
    Device,
    resources
) {
    "use strict";

    // shortcut for sap.m.SwitchType
    var SwitchType = mobileLibrary.SwitchType;

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.userActivitiesHandler", {
        createContent: function (oController) {
            var i18n = resources.i18n;
            var sFlexDirection = Device.system.phone ? "Column" : "Row";
            var sFlexAlignItems = Device.system.phone ? "Stretch" : "Center";
            var sTextAlign = Device.system.phone ? "Left" : "Right";
            var sCleanActivityButton = "cleanActivityButton";

            this.trackingLabel = new Label("trackingLabel", {
                text: i18n.getText("trackingLabel"),
                textAlign: sTextAlign
            }).addStyleClass("sapUshellCleanActivityLabel");

            this.trackUserActivitySwitch = new Switch("trackUserActivitySwitch", {
                type: SwitchType.Default,
                customTextOn: i18n.getText("Yes"),
                customTextOff: i18n.getText("No"),
                change: function (oEvent) {
                    oController._handleTrackUserActivitySwitch(oEvent.getParameter("state"));
                }
            }).addAriaLabelledBy(this.trackingLabel);

            var fTrackingSwitch = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    this.trackingLabel,
                    this.trackUserActivitySwitch
                ]
            });

            this.cleanActivityLabel = new Label("cleanActivityLabel", {
                text: i18n.getText("cleanActivityLabel"),
                textAlign: sTextAlign,
                labelFor: sCleanActivityButton
            }).addStyleClass("sapUshellCleanActivityLabel");

            this.cleanActivityButton = new Button({
                id: "cleanActivityButton",
                text: i18n.getText("cleanActivityButton"),
                press: oController._handleCleanHistory
            }).addAriaLabelledBy(this.cleanActivityLabel);

            var fcleanActivity = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    this.cleanActivityLabel,
                    this.cleanActivityButton
                ]
            });

            var vbox = new VBox({
                items: [fTrackingSwitch, fcleanActivity]
            });
            vbox.addStyleClass("sapUiSmallMargin");

            return vbox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.userActivitiesHandler";
        }
    });
});
