// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/ui/utils",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/m/ObjectHeader",
    "sap/m/library",
    "sap/ui/core/IconPool",
    "sap/m/Page",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/m/FlexBox"
], function (
    Controller,
    Device,
    AppLifeCycle,
    Config,
    EventHub,
    resources,
    utils,
    Log,
    jQuery,
    ObjectHeader,
    mobileLibrary,
    IconPool,
    Page,
    Label,
    Input,
    StandardListItem,
    Text,
    FlexBox
) {
    "use strict";

    // shortcut for sap.m.BackgroundDesign
    var BackgroundDesign = mobileLibrary.BackgroundDesign;

    var oDoable;
    return Controller.extend("sap.ushell.components.shell.UserSettings", {
        /**
         * Initalizes the user settings dialog.
         *
         * @private
         */
        onInit: function () {
            this.getView().byId("userSettingEntryList").addEventDelegate({
                onAfterRendering: this._listAfterRendering.bind(this)
            });

            this.getView().byId("userSettingsDialog").addEventDelegate({
                onkeydown: this._keyDown.bind(this)
            });

            var oSplitApp = this.getView().byId("settingsApp");
            // SplitContainer behaves only depending on the width/height viewport ratio and does not take into account available space.
            // According to the documentation, SplitContainer should be used as a full screen control but it is used in a dialog here.
            // Solution: make sure that the master list is always visible on desktop computers.
            oSplitApp.setMode(Device.system.desktop ? "StretchCompressMode" : "ShowHideMode");

            // This is a hack suggested as temporal solution in BCP ticket 1680226447
            // We have to set the autofocus property of internal SplitApp navcontainer in order to allow search through the views of the
            // Detail page and also to assure that we set focus on the first element in the view
            // and not the one which appears earlier in case of dynamic content.
            // A feature request will be opened in order to allow this property to be set via official API.
            oSplitApp._oDetailNav.setAutoFocus(false);

            oDoable = EventHub.on("openUserSettings").do(this.openUserSettings.bind(this));
        },

        /**
         * Turns the eventlistener off.
         *
         * @private
         */
        onExit: function () {
            oDoable.off();
        },

        /**
         * Opens the user settings dialog.
         *
         * @private
         */
        openUserSettings: function () {
            this.getView().byId("userSettingsDialog").open();
        },

        /**
         * Resets changed properties.
         *
         * @private
         */
        _afterClose: function () {
            sap.ushell.Container.getUser().resetChangedProperties();
            if (window.document.activeElement && window.document.activeElement.tagName === "BODY") {
                window.document.getElementById("meAreaHeaderButton").focus();
            }
        },

        /**
         * Creates the detail page that should be displayed
         *
         * @param {string} sEntryId the name of the entry
         * @param {string} sTitle the title of the entry
         * @param {object} oContent that should be shown on the detail page
         * @returns {string} the id of the created detail page
         * @private
         */
        _createDetailPage: function (sEntryId, sTitle, oContent) {
            var oObjectHeader = new ObjectHeader({
                title: sTitle,
                backgroundDesign: BackgroundDesign.Solid
            }).addStyleClass("sapUshellUserSettingDetailHeader");

            if (sEntryId === "userAccountEntry") {
                var oUser = sap.ushell.Container.getUser();

                // User image in the detail page (in user account entry)
                if (oUser.getImage()) {
                    oObjectHeader.setIcon(Config.last("/core/shell/model/userImage/personPlaceHolder"));
                } else {
                    oObjectHeader.setIcon(IconPool.getIconURI("sap-icon://person-placeholder"));
                }

                oUser.attachOnSetImage(function () {
                    var sPersonPlaceHolder = Config.last("/core/shell/model/userImage/personPlaceHolder"),
                        sPlaceholderIcon = IconPool.getIconURI("sap-icon://person-placeholder");

                    oObjectHeader.setIcon(sPersonPlaceHolder || sPlaceholderIcon);
                });

                oObjectHeader.setTitle(sap.ushell.Container.getUser().getFullName());
            }
            var oPage = new Page("detail" + oContent.getId(), {
                content: [oObjectHeader, oContent],
                showHeader: false
            }).addStyleClass("sapUsheUserSettingDetaildPage");

            oPage.addEventDelegate({
                onAfterRendering: this._handleNavButton.bind(this)
            });

            this.getView().byId("settingsApp").addDetailPage(oPage);
            return oPage.getId();
        },

        /**
         * Creates a detail page for the given Entry
         *
         * @param {object} oEntry that needs a detail page
         * @returns {Promise<string>} that resolves with the created Page id
         * @private
         */
        _createEntryContent: function (oEntry) {
            var that = this;
            return new Promise(function (resolve) {
                if (typeof oEntry.contentFunc === "function") {
                    oEntry.contentFunc().always(function (oContentResult) {
                        if (oContentResult instanceof sap.ui.core.Control) {
                            resolve(that._createDetailPage(oEntry.entryHelpID, oEntry.title, oContentResult));
                        } else {
                            var oErrorContent = new FlexBox(oEntry.entryHelpID, {
                                height: "5rem",
                                alignItems: "Center",
                                justifyContent: "Center",
                                items: [ new Text({ text: resources.i18n.getText("loadingErrorMessage") })]
                            });
                            resolve(that._createDetailPage(oEntry.entryHelpID, oEntry.title, oErrorContent));
                        }
                    });
                } else {
                    var oContent;
                    oEntry.valueArgument().done(function (sValue) {
                        oContent = that._getKeyValueContent(oEntry, sValue);
                    }).fail(function () {
                        oContent = that._getKeyValueContent(oEntry);
                    }).always(function () {
                        resolve(that._createDetailPage(oEntry.entryHelpID, oEntry.title, oContent));
                    });
                }
            });
        },

        /**
         * Factory function that creates the list items for the entires
         *
         * @param {string} sId the id given by the model
         * @param {object} oContext the model context of the specific entry
         * @returns {sap.m.StandardListItem} the list item for an entry
         *
         * @private
         */
        _createListEntry: function (sId, oContext) {
            var oEntry = oContext.getProperty(oContext.sPath);

            if (oEntry.entryHelpID) {
                sId = oEntry.entryHelpID + "-UserSettingsEntry";
            }

            return new StandardListItem(sId, {
                title: { path: "entries>title" },
                description: { path: "entries>valueResult" },
                icon: {
                    parts: [
                        { path: "entries>icon" },
                        { path: "/userImage/account" }
                    ],
                    formatter: this._getEntryIcon
                },
                visible: {
                    parts: [
                        { path: "entries>visible"},
                        { path: "entries>defaultVisibility"},
                        { path: "entries>title"}
                    ],
                    formatter: this._getEntryVisible.bind(this)
                },
                type: Device.system.phone ? "Navigation" : "Inactive"
            }).addStyleClass("sapUshellUserSettingMasterListItem");
        },

        /**
         * Close User Settings Dialog without saving.
         *
         * @private
         */
        _dialogCancelButtonHandler: function () {
            var aEntries = this.getView().getModel("entries").getData().entries || [];
            // Invoke onCancel function for each userPreferences entry
            for (var i = 0; i < aEntries.length; i++) {
                if (aEntries[i] && aEntries[i].onCancel) {
                    aEntries[i].onCancel();
                }
            }
            this._handleSettingsDialogClose();
        },

        /**
         * Emits an event to notify that the given entry needs to be saved.
         *
         * @param {string} sEntryPath the model path of the entry
         * @private
         */
        _emitEntryOpened: function (sEntryPath) {
            var aUserSettingsEntriesToSave = EventHub.last("UserSettingsOpened") || {},
                sPosition = sEntryPath.split("/").pop();

            aUserSettingsEntriesToSave[sPosition] = true;
            EventHub.emit("UserSettingsOpened", aUserSettingsEntriesToSave);
        },

        /**
         * Calculates the correct icon on the list entry.
         *
         * @param {string} sEntryIcon icon source
         * @param {string} sUserImage user image source
         * @returns {string} the correct icon source
         * @private
         */
        _getEntryIcon: function (sEntryIcon, sUserImage) {
            if (sEntryIcon === "sap-icon://account" && sUserImage) {
                return sUserImage;
            }
            return sEntryIcon || "sap-icon://action-settings";
        },

        /**
         * Calculates if an entry list item should be visible.
         *
         * @param {boolean} bVisibility entry set to be visible
         * @param {boolean} bDefaultVisibility entry set to be visible as a default
         * @param {string} sTitle the title of the entry
         * @returns {boolean} if an entry list item should be visible
         * @private
         */
        _getEntryVisible: function (bVisibility, bDefaultVisibility, sTitle) {
            if (sTitle === resources.i18n.getText("userProfiling")) {
                var aProfilingEntries = this.getView().getModel("entries").getProperty("/profiling") || [],
                    UsageAnalytics = sap.ushell.Container.getService("UsageAnalytics");
                // Remove usage analytics entry if its not enabled
                for (var i = aProfilingEntries.length - 1; i >= 0; i--) {
                    if (aProfilingEntries[i].entryHelpID === "usageAnalytics") {
                        if (!UsageAnalytics.systemEnabled() || !UsageAnalytics.isSetUsageAnalyticsPermitted()) {
                            aProfilingEntries.splice(i, 1);
                        }
                    }
                }
                return aProfilingEntries && aProfilingEntries.length > 0;
            }

            if (bVisibility !== undefined) {
                return bVisibility;
            }

            if (bDefaultVisibility !== undefined) {
                return bDefaultVisibility;
            }

            return true;
        },

        /**
         * Creating UI for key/value settings.
         *
         * @param {object} oEntry the settings entry (containing the title)
         * @param {string} sEntryValue the value of the setting
         * @returns {object} a Flexbox containing the setting
         * @private
         */
        _getKeyValueContent: function (oEntry, sEntryValue) {
            var oKeyLabel = new Label({
                text: oEntry.title + ":"
            }).addStyleClass("sapUshellUserSettingsDetailsKey");

            var oValueLabel = new Input({
                value: sEntryValue || " ",
                editable: false
            }).addStyleClass("sapUshellUserSettingsDetailsValue");

            var oBox = new FlexBox(oEntry.entryHelpID, {
                alignItems: Device.system.phone ? "Start" : "Center",
                wrap: Device.system.phone ? "Wrap" : "NoWrap",
                direction: Device.system.phone ? "Column" : "Row",
                items: [
                    oKeyLabel,
                    oValueLabel
                ]
            });
            return oBox;
        },

        /**
         * Determins if the Navigation Button is visible.
         *
         * @private
         */
        _handleNavButton: function () {
            var oSplitApp = this.getView().byId("settingsApp"),
                oNavBackButton = this.getView().byId("userSettingsNavBackButton");

            oNavBackButton.setVisible(!oSplitApp.isMasterShown());
        },

        /**
         * Close User Settings Dialog.
         *
         * @private
         */
        _handleSettingsDialogClose: function () {
            this.getView().byId("settingsApp").toMaster("sapFlpUserSettings-View--userSettingMaster");
            // Fix - in phone the first selection (user account) wasn't responsive when this view was closed
            // and re-opened because is was regarded as already selected entry in the splitApp control.
            this.getView().byId("userSettingEntryList").removeSelections(true);
            this.getView().byId("userSettingsDialog").close();
        },
        /**
         * Triggers a refresh to the home page
         *
         * @private
         * @since 1.72.0
         */
        _refreshBrowser: function () {
            document.location = document.location.href.replace(location.hash, "");
        },

        /**
         * Save and close User Settings Dialog.
         *
         * @private
         */
        _handleSettingsSave: function () {
            var oShellModel = AppLifeCycle.getElementsModel().getModel(),
                that = this;
            // In case the save button is pressed in the detailed entry mode, there is a need to update value result in the model
            var isDetailedEntryMode = oShellModel.getProperty("/userPreferences/isDetailedEntryMode");
            if (isDetailedEntryMode) {
                oShellModel.setProperty("/userPreferences/activeEntryPath", null);
            }

            utils.saveUserPreferenceEntries(oShellModel.getProperty("/userPreferences/entries"))
                .done(function (oAfterSave) {
                    that._handleSettingsDialogClose();
                    sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                        var sMessage = resources.i18n.getText("savedChanges");

                        MessageToast.show(sMessage, {
                            duration: 3000,
                            width: "15em",
                            my: "center bottom",
                            at: "center bottom",
                            of: window,
                            offset: "0 -50",
                            collision: "fit fit"
                        });
                    });
                    if (oAfterSave && oAfterSave.refresh) {
                        that._refreshBrowser();
                    }
                })
                .fail(function (failureMsgArr) {
                    sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                        var sErrMessageText;
                        var sErrMessageLog = "";
                        if (failureMsgArr.length === 1) {
                            sErrMessageText = resources.i18n.getText("savingEntryError") + " ";
                        } else {
                            sErrMessageText = resources.i18n.getText("savingEntriesError") + "\n";
                        }
                        failureMsgArr.forEach(function (oError) {
                            sErrMessageText += oError.entry + "\n";
                            sErrMessageLog += "Entry: " + oError.entry + " - Error message: " + oError.message + "\n";
                        });

                        MessageBox.show(
                            sErrMessageText, {
                                icon: MessageBox.Icon.ERROR,
                                title: resources.i18n.getText("error"),
                                actions: [MessageBox.Action.OK]
                            }
                        );

                        Log.error(
                            "Failed to save the following entries",
                            sErrMessageLog,
                            "sap.ushell.ui.footerbar.UserPreferencesButton"
                        );
                    }
                    );
                });
        },

        /**
         * Handles the entry item press
         *
         * @param {object} oEvent the event that was fired
         * @private
         */
        _itemPress: function (oEvent) {
            this._toDetail(oEvent.getSource().getSelectedItem(), oEvent.getId());
        },

        /**
         * Handles the key down event on the Dialog
         *
         * @param {object} oEvent the event that was fired
         * @private
         */
        _keyDown: function (oEvent) {
            if (oEvent.keyCode === 27) { // ESC
                this._dialogCancelButtonHandler();
            }
        },

        /**
         * Handles after renderering code of the list.
         *
         * @private
         */
        _listAfterRendering: function () {
            var oMasterEntryList = this.getView().byId("userSettingEntryList");

            var aEntries = oMasterEntryList.getItems();
            // For each item in the list we need to add XRay help id
            // For each item in the list we need to execute the relevant function to get the entry value
            for (var i = 0; i < aEntries.length; i++) {
                var sPath = aEntries[i].getBindingContext("entries").getPath();
                this._setEntryValueResult(sPath);
            }

            if (!Device.system.phone) {
                var oFirstEntry = oMasterEntryList.getItems()[0];
                if (oFirstEntry) {
                    oMasterEntryList.setSelectedItem(oFirstEntry);
                    this._toDetail(oFirstEntry, "select");
                    oFirstEntry.getDomRef().focus();
                }
            }
        },

        /**
         * Handles the Back / Menu button press
         *
         * @param {object} oEvent the event that was fired
         * @private
         */
        _navBackButtonPressHandler: function (oEvent) {
            var oSplitApp = this.getView().byId("settingsApp");

            if (Device.system.phone) {
                oSplitApp.backDetail();
                this._handleNavButton();
                oEvent.getSource().setPressed(false);
            } else if (oSplitApp.isMasterShown()) {
                oSplitApp.hideMaster();
                oEvent.getSource().setTooltip(resources.i18n.getText("ToggleButtonShow"));
                oEvent.getSource().setPressed(false);
            } else {
                oSplitApp.showMaster();
                oEvent.getSource().setTooltip(resources.i18n.getText("ToggleButtonHide"));
                oEvent.getSource().setPressed(true);
            }
        },

        /**
         * Navigates to the corresponding detail Page
         *
         * @param {string} sId the id of the detail Page the AppSplit-Container schould navigate to
         * @param {string} sEventId the name of the event that was fired
         * @param {string} sEntryPath the path ot the entry that should be navigated to
         * @private
         */
        _navToDetail: function (sId, sEventId, sEntryPath) {
            var oSplitApp = this.getView().byId("settingsApp");

            oSplitApp.toDetail(sId);
            EventHub.emit("UserPreferencesDetailNavigated", sId);
            // Since we cannot use autofocus property of splitApp navcontainer, we have to implement it explicitly
            if (sEventId === "select" && !Device.system.phone) {
                var elFirstToFocus = jQuery(document.getElementById(sId)).firstFocusableDomRef();

                if (elFirstToFocus) {
                    elFirstToFocus.focus();
                }
            }
            if (oSplitApp.getMode() === "ShowHideMode") {
                oSplitApp.hideMaster();
            }

            this._handleNavButton();
            this._emitEntryOpened(sEntryPath);
        },

        /**
         * Tries to load the information for the list item of an entry async.
         *
         * @param {string} sEntryPath a speific path of one of the entries
         * @private
         */
        _setEntryValueResult: function (sEntryPath) {
            var oModel = this.getView().getModel("entries"),
                isEditable = oModel.getProperty(sEntryPath + "/editable"),
                valueArgument = oModel.getProperty(sEntryPath + "/valueArgument"),
                bVisibility = oModel.getProperty(sEntryPath + "/visible"),
                bDefaultVisibility = oModel.getProperty(sEntryPath + "/defaultVisibility");

            if (typeof valueArgument === "function") {
                // Display "Loading..." and disable the entry until the value result is available
                oModel.setProperty(sEntryPath + "/valueResult", resources.i18n.getText("genericLoading"));
                oModel.setProperty(sEntryPath + "/editable", false);
                valueArgument()
                    .done(function (valueResult) {
                        oModel.setProperty(sEntryPath + "/editable", isEditable);
                        var bVisible = true;
                        if (valueResult && valueResult.value !== undefined) {
                            bVisible = !!valueResult.value;
                        } else if (bVisibility !== undefined) {
                            bVisible = bVisibility;
                        } else if (bDefaultVisibility !== undefined) {
                            bVisible = bDefaultVisibility;
                        }
                        var sDisplayText = " ";
                        if (valueResult !== undefined) {
                            if (typeof (valueResult) === "object") {
                                sDisplayText = valueResult.displayText;
                            } else {
                                sDisplayText = valueResult;
                            }
                        }

                        oModel.setProperty(sEntryPath + "/visible", bVisible);
                        oModel.setProperty(sEntryPath + "/valueResult", sDisplayText);
                    })
                    .fail(function () {
                        oModel.setProperty(sEntryPath + "/valueResult", resources.i18n.getText("loadingErrorMessage"));
                    });
            } else if (valueArgument) {
                oModel.setProperty(sEntryPath + "/valueResult", valueArgument);
            } else {
                oModel.setProperty(sEntryPath + "/valueResult", resources.i18n.getText("loadingErrorMessage"));
            }
        },

        /**
         * Navigates to the detail page that belongs to the given selected item
         *
         * @param {object} oSelectedItem the entry control that should be handled
         * @param {string} sEventId the name of the even
         * @private
         */
        _toDetail: function (oSelectedItem, sEventId) {
            var oModel = this.getView().getModel("entries"),
                sEntryPath = oSelectedItem.getBindingContext("entries").getPath(),
                sDetailPageId = oModel.getProperty(sEntryPath + "/contentResult");

            // Clear selection from list.
            if (Device.system.phone) {
                oSelectedItem.setSelected(false);
            }

            if (sDetailPageId) {
                this._navToDetail(sDetailPageId, sEventId, sEntryPath);
            } else {
                var that = this,
                    oEntry = oModel.getProperty(sEntryPath);

                this._createEntryContent(oEntry).then(function (sNewDetailPageId) {
                    oModel.setProperty(sEntryPath + "/contentResult", sNewDetailPageId);
                    that._navToDetail(sNewDetailPageId, sEventId, sEntryPath);
                });
            }
        }
    });
});
