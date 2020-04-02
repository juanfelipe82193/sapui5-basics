// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/m/VBox",
    "sap/m/FlexBox",
    "sap/m/Input",
    "sap/m/Label",
    "sap/ui/Device",
    "sap/ushell/resources"
], function (
    jQuery,
    VBox,
    FlexBox,
    Input,
    Label,
    Device,
    resources
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector", {
        createContent: function (/*oController*/) {
            var i18n = resources.i18n;
            var sFlexDirection = Device.system.phone ? "Column" : "Row";
            var sFlexAlignItems = Device.system.phone ? "Stretch" : "Center";
            var sTextAlign = Device.system.phone ? "Left" : "Right";
            var sLabelWidth = Device.system.phone ? "auto" : "12rem";
            var nameLabel = new Label({
                text: i18n.getText("UserAccountNameFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });
            var nameInput = new Input("userAccountuserName", {
                value: "{/name}",
                editable: false
            }).addAriaLabelledBy(nameLabel);

            nameInput.addEventDelegate({
                onfocusin: function () {
                    jQuery("#userAccountuserName input").blur();
                }
            });

            var fboxName = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [nameLabel, nameInput]
            });
            var emailLabel = new Label({
                text: i18n.getText("UserAccountEmailFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });
            var fboxMail = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    emailLabel,
                    new Input({
                        value: "{/mail}",
                        editable: false
                    }).addAriaLabelledBy(emailLabel)
                ]
            });
            var serverLabel = new Label({
                text: i18n.getText("UserAccountServerFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });
            var fboxServer = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    serverLabel,
                    new Input({
                        value: "{/server}",
                        editable: false
                    }).addAriaLabelledBy(serverLabel)
                ]
            });

            var vbox = new VBox({
                items: [fboxName, fboxMail, fboxServer]
            });
            vbox.addStyleClass("sapUiSmallMargin");

            return vbox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector";
        }
    });
}, /* bExport= */ true);
