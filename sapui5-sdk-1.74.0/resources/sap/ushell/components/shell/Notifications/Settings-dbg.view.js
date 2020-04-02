// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * Notification settings View.
 * The View contains a sap.m.VBox, including:
 *   - A header that includes a switch control for the "DoNotDisturb" feature
 *   - A table of notification types, allowing the user to set presentation-related properties
 */
sap.ui.define([
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/CheckBox",
    "sap/m/Switch",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/FlexBox",
    "sap/ui/core/Icon",
    "sap/m/ColumnListItem",
    "sap/ui/model/Sorter",
    "sap/ui/core/library",
    "sap/m/library",
    "sap/ushell/resources"
], function (
    Table,
    Column,
    CheckBox,
    Switch,
    Text,
    Label,
    VBox,
    HBox,
    FlexBox,
    Icon,
    ColumnListItem,
    Sorter,
    library,
    mLibrary,
    resources
) {
    "use strict";

    var ListSeparators = mLibrary.ListSeparators;
    var BackgroundDesign = mLibrary.BackgroundDesign;
    var TextAlign = library.TextAlign;

    sap.ui.jsview("sap.ushell.components.shell.Notifications.Settings", {
        /**
         * The content of the View:
         *   - Notification types settings table
         *   - Switch buttons bar (i.e. the header)
         * Both controls are put in a sap.m.VBox
         */
        createContent: function (/*oController*/) {
            var that = this,
                oNotificationTypeTable,
                oTableRowTemplate,
                oSwitchButtonsBar,
                oVBox,
                oHeaderVBox,
                oResourceBundle = resources.i18n;

            oNotificationTypeTable = new Table("notificationSettingsTable", {
                backgroundDesign: BackgroundDesign.Transparent,
                showSeparators: ListSeparators.All,
                fixedLayout: false,
                columns: [
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("notificationType_column"),
                            tooltip: oResourceBundle.getText("notificationType_columnTooltip")
                        }),
                        vAlign: "Middle",
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("iOSNotification_column"),
                            tooltip: oResourceBundle.getText("iOSNotification_columnTooltip")
                        }),
                        visible: "{/flags/mobileNotificationsEnabled}",
                        // When the screen size is smaller than Tablet -
                        // the cells of this column should be placed under the cells of the previous column
                        minScreenWidth: "Tablet",
                        demandPopin: true,
                        vAlign: "Middle",
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("eMailFld"),
                            tooltip: oResourceBundle.getText("email_columnTooltip")
                        }),
                        visible: "{/flags/emailNotificationsEnabled}",
                        minScreenWidth: "Tablet",
                        demandPopin: true,
                        vAlign: "Middle",
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("highNotificationsBanner_column"),
                            tooltip: oResourceBundle.getText("highNotificationsBanner_columnTooltip")
                        }),
                        // When the screen size is smaller than Tablet -
                        // the cells of this column should be placed under the cells of the previous column
                        minScreenWidth: "Tablet",
                        demandPopin: true,
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("Notifications_Settings_Show_Type_column"),
                            tooltip: oResourceBundle.getText("notificationTypeEnable_columnTooltip")
                        }),
                        vAlign: "Middle",
                        hAlign: "Left"
                    })
                ]
            });

            oTableRowTemplate = new ColumnListItem({
                cells: [
                    new Label({ text: "{NotificationTypeDesc}" }),
                    new CheckBox({
                        selected: {
                            parts: ["DoNotDeliverMob"],
                            formatter: function (bDoNotDeliverMob) {
                                return !bDoNotDeliverMob;
                            }
                        },
                        select: function (oEvent) {
                            that.getController().setControlDirtyFlag.apply(this);
                            var sPath = oEvent.getSource().getBindingContext().sPath;
                            that.getModel().setProperty(sPath + "/DoNotDeliverMob", !oEvent.mParameters.selected);
                        }
                    }),
                    new CheckBox({
                        visible: {
                            parts: ["IsEmailEnabled", "IsEmailIdMaintained", "DoNotDeliver"],
                            formatter: function (bEmailEnabled, bEmailIdMaintained, bDoNotDeliver) {
                                return bEmailEnabled && bEmailIdMaintained && !bDoNotDeliver;
                            }
                        },
                        selected: {
                            path: "DoNotDeliverEmail",
                            formatter: function (bDoNotDeliverEmail) {
                                return !bDoNotDeliverEmail;
                            }
                        },
                        select: function (oEvent) {
                            that.getController().setControlDirtyFlag.apply(this);
                            var sPath = oEvent.getSource().getBindingContext().sPath;
                            that.getModel().setProperty(sPath + "/DoNotDeliverEmail", !oEvent.mParameters.selected);
                        }
                    }),
                    new CheckBox({
                        // When the "High Priority" property is checked - the value in the model should be "40-HIGH".
                        // when it is unchecked - - the value in the model should be an empty string.
                        select: function (oEvent) {
                            that.getController().setControlDirtyFlag.apply(this);
                            var sPath = oEvent.getSource().getBindingContext().sPath;
                            if (oEvent.mParameters.selected === true) {
                                that.getModel().setProperty(sPath + "/PriorityDefault", "40-HIGH");
                            } else {
                                that.getModel().setProperty(sPath + "/PriorityDefault", "");
                            }
                        },
                        selected: {
                            parts: ["PriorityDefault"],
                            // The checkbox for PriorityDefault should be checked when the priority of the corresponding
                            // ...notification type is HIGH (i.e. the string "40-HIGH"), and unchecked otherwise
                            formatter: function (sPriorityDefault) {
                                that.getController().setControlDirtyFlag.apply(this);
                                if (sPriorityDefault === "40-HIGH") {
                                    return true;
                                }
                                return false;
                            }
                        }
                    }),
                    new Switch({
                        state: {
                            parts: ["DoNotDeliver"],
                            formatter: function (bDoNotDeliver) {
                                return !bDoNotDeliver;
                            }
                        },
                        customTextOn: " ",
                        customTextOff: " ",
                        change: function (oEvent) {
                            var bNewState = oEvent.getParameter("state"),
                                sPath = oEvent.getSource().getBindingContext().sPath;

                            that.getModel().setProperty(sPath + "/DoNotDeliver", !bNewState);
                            that.getController().setControlDirtyFlag.apply(this);
                        }
                    })
                ]
            });

            oNotificationTypeTable.bindAggregation("items", {
                path: "/rows",
                template: oTableRowTemplate,
                // Table rows (i.e. notification types) are sorted by type name, which is the NotificationTypeDesc field
                sorter: new Sorter("NotificationTypeDesc")
            });

            // The main container in the View.
            // Contains the header (switch flags) and the notification types table
            oVBox = new VBox();

            // Create the header, which is a sap.m.Bar that contain two switch controls
            oSwitchButtonsBar = this.createSwitchControlBar();

            // Create wrapper to the switch button in order to support belize plus theme
            oHeaderVBox = new VBox();
            oHeaderVBox.addStyleClass("sapContrastPlus");
            oHeaderVBox.addItem(oSwitchButtonsBar);

            oVBox.addItem(oHeaderVBox);
            oVBox.addItem(oNotificationTypeTable);

            return [oVBox];
        },

        /**
         * Creates and returns a UI control (sap.m.Bar)
         * that contains the DoNotDisturb and EnablePreview switch controls and labels.
         * The switch control for enabling/disabling notifications preview is created and added
         * only when preview is configured as enabled and the device screen is wide enough for presenting the preview
         *
         * @returns sap.m.HBox containing the switch controls that appear at the top part of the settings UI
         */
        createSwitchControlBar: function () {
            var oDoNotDisturbSwitch,
                oDoNotDisturbLabel,
                oDoNotDisturbHBox,
                oSwitchButtonsBar,
                oResourceBundle = resources.i18n;

            oSwitchButtonsBar = new FlexBox("notificationSettingsSwitchBar");

            oDoNotDisturbLabel = new Label("doNotDisturbLabel", {
                text: oResourceBundle.getText("Show_High_Priority_Alerts_title")
            });

            oDoNotDisturbSwitch = new Switch("doNotDisturbSwitch", {
                tooltip: oResourceBundle.getText("showAlertsForHighNotifications_tooltip"),
                state: "{/flags/highPriorityBannerEnabled}",
                customTextOn: oResourceBundle.getText("Yes"),
                customTextOff: oResourceBundle.getText("No")
            }).addAriaLabelledBy(oDoNotDisturbLabel);

            oDoNotDisturbHBox = new HBox("notificationDoNotDisturbHBox", {
                items: [
                    oDoNotDisturbSwitch,
                    oDoNotDisturbLabel
                ]
            });

            oSwitchButtonsBar.addItem(oDoNotDisturbHBox);
            return oSwitchButtonsBar;
        },

        /**
         * Creates and returns the UI that is shown in the settings view in case that no Notification type rows are available.<br>
         * The UI consists of a sap.m.VBox, in which the is an icon, a message header (text), and the actual text message.
         */
        getNoDataUI: function () {
            var oNoDataVBox,
                oNoDataIcon,
                oNoDataHeaderLabel,
                oNoDataLabel,
                oResourceBundle = resources.i18n;

            if (oNoDataVBox === undefined) {
                oNoDataIcon = new Icon("notificationSettingsNoDataIcon", {
                    size: "5rem",
                    src: "sap-icon://message-information"
                });
                oNoDataHeaderLabel = new Text("notificationSettingsNoDataTextHeader", {
                    text: oResourceBundle.getText("noNotificationTypesEnabledHeader_message")
                }).setTextAlign(TextAlign.Center);
                oNoDataLabel = new Text("notificationSettingsNoDataText", {
                    text: oResourceBundle.getText("noNotificationTypesEnabled_message")
                }).setTextAlign(TextAlign.Center);

                oNoDataVBox = new VBox("notificationSettingsNoDataInnerBox", {
                    items: [
                        oNoDataIcon,
                        oNoDataHeaderLabel,
                        oNoDataLabel
                    ]
                });
            }
            return oNoDataVBox;
        },
        getControllerName: function () {
            return "sap.ushell.components.shell.Notifications.Settings";
        }
    });
});
