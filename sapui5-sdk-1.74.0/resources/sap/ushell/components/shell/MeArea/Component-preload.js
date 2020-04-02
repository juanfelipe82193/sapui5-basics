//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shell/MeArea/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/components/shell/MeArea/MeArea.controller"
], function (
    UIComponent,
    AppLifeCycle,
    Config,
    MeAreaController
) {
    "use strict";

    var _oRenderer;
    // Shortcut to sap.ushell.Container.getRenderer("fiori2")
    function _renderer () {
        if (!_oRenderer) {
            _oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }
        return _oRenderer;
    }

    // MeArea Component
    return UIComponent.extend("sap.ushell.components.shell.MeArea.Component", {

        metadata: {
            version: "1.74.0",
            library: "sap.ushell.components.shell.MeArea",
            dependencies: {
                libs: ["sap.m"]
            }
        },

        createContent: function () {
            this._bIsMeAreaCreated = false;

            this.oMeAreaController = new MeAreaController();
            this.oMeAreaController.onInit();

            var that = this;

            // In state blank when no Action Items do not display MeArea.
            AppLifeCycle.getElementsModel().createTriggers([{
                fnRegister: function () {
                    if (!that.oActionsDoable) {
                        that.oActionsDoable = Config.on("/core/shell/model/currentState/actions").do(function (aActions) {
                            if (aActions && aActions.length > 0) {
                                _renderer().showHeaderEndItem(["meAreaHeaderButton"], true);
                            } else {
                                _renderer().hideHeaderEndItem(["meAreaHeaderButton"], true);
                            }
                        });
                    }
                },
                fnUnRegister: function () {
                    if (!that.oActionsDoable) {
                        that.oActionsDoable.off();
                        that.oActionsDoable = null;
                    }
                }
            }], false, ["blank-home", "blank"]);

            sap.ui.getCore().getEventBus().publish("shell", "meAreaCompLoaded", { delay: 0 });
        },

        exit: function () {
            if (this.oActionsDoable) {
                this.oActionsDoable.off();
            }
            this.oEventListener.off();
            this.oMeAreaController.onExit();
        }
    });

});
},
	"sap/ushell/components/shell/MeArea/MeArea.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/StandardListItem",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/AboutButton",
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/ui/footerbar/EndUserFeedback",
    "sap/ushell/ui/launchpad/ActionItem",
    "sap/ushell/ui/QuickAccess",
    "sap/ushell/EventHub",
    "sap/m/library",
    "sap/base/Log",
    "sap/ui/performance/Measurement",
    "sap/ui/core/ElementMetadata"
], function (
    Controller,
    Device,
    JSONModel,
    StandardListItem,
    AppLifeCycle,
    Config,
    resources,
    AboutButton,
    ContactSupportButton,
    EndUserFeedback,
    ActionItem,
    QuickAccess,
    EventHub,
    library,
    Log,
    Measurement,
    ElementMetadata
) {
    "use strict";

    var ListType = library.ListType;
    var ButtonType = library.ButtonType;

    var _oRenderer;

    // Shortcut to sap.ushell.Container.getRenderer("fiori2")
    function _renderer () {
        if (!_oRenderer) {
            _oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }
        return _oRenderer;
    }

    // Shortcut to sap.ushell.Container.getRenderer("fiori2").getShellConfig()
    function _shellConfig () {
        return _renderer().getShellConfig();
    }

    // Shortcut to AppLifeCycle.getElementsModel().getModel()
    function _model () {
        return AppLifeCycle.getElementsModel().getModel();
    }

    function isActionExist (sActionId) {
        if (!sap.ui.getCore().byId(sActionId)) {
            Log.debug("Could not render ActionItem because it was not created: " + sActionId);
            return false;
        }
        return true;
    }

    return Controller.extend("sap.ushell.components.shell.MeArea.MeArea", {
        _aDanglingControl: [],
        _aDoables: [],

        onInit: function () {
            var that = this;

            var oConfig = _shellConfig();
            this._createActionButtons(oConfig);

            var oUser = sap.ushell.Container.getUser();

            var aCreatedActions = Config.last("/core/shell/model/currentState/actions").filter(isActionExist);
            this.oModel = new JSONModel({
                actions: aCreatedActions,
                userName: oUser.getFullName() || oUser.getId()
            });
            this._aDoables.push(Config.on("/core/shell/model/currentState/actions").do(function (aActions) {
                var aFilteredActions = aActions.filter(isActionExist);
                that.getModel().setProperty("/actions", aFilteredActions);
            }));

            this._aDoables.push(EventHub.on("showMeArea").do(function (bShow) {
                var oPopover = sap.ui.getCore().byId("sapUshellMeAreaPopover");
                if (oPopover && oPopover.isOpen() || !bShow) {
                    that._toggleMeAreaPopover(false);
                } else {
                    that._toggleMeAreaPopover(true);
                }
            }));
        },

        onExit: function () {
            this._destroyDanglingControls();
            this._aDoables.forEach(function (oDoable) {
                oDoable.off();
            });
            this._aDanglingControl = [];
            this._aDoables = [];

            var oPopover = sap.ui.getCore().byId("sapUshellMeAreaPopover");
            if (oPopover) {
                oPopover.destroy();
            }
        },

        getModel: function () {
            return this.oModel;
        },

        _createActionButtons: function (oConfig) {
            var bEnableHelp = Config.last("/core/extension/enableHelp");

            this._createAboutButton(bEnableHelp);

            if (Config.last("/core/spaces/enabled") && !oConfig.moveAppFinderActionToShellHeader ||
                oConfig.enablePersonalization !== false && !oConfig.moveAppFinderActionToShellHeader) {
                this._createAppFinderButton(oConfig, bEnableHelp);
            }

            //in case the user setting button should move to the shell header, it was already created by header
            //otherwise, create it as an actionItem for MeArea
            if (!oConfig.moveUserSettingsActionToShellHeader) {
                this._createSettingsButton(bEnableHelp);
            }

            // Only when the contact support button has to be shown in the MeArea
            if (!oConfig.moveContactSupportActionToShellHeader) {
                this._createSupportTicketButton(bEnableHelp);
            }

            this._createEndUserFeedbackButton(oConfig, bEnableHelp);

            if (oConfig.enableRecentActivity && Config.last("/core/shell/model/currentState/showRecentActivity")) {
                this._createRecentActivitiesButton();
                this._createFrequentActivitiesButton();
            }

            if (!oConfig.disableSignOut) {
                this._createLogoutButton();
            }
        },

        _createAppFinderButton: function (oConfig, bEnableHelp) {
            if (sap.ui.getCore().byId("openCatalogBtn")) {
                return;
            }

            var oOpenCatalogItem = new ActionItem("openCatalogBtn", {
                text: resources.i18n.getText("open_appFinderBtn"),
                icon: "sap-icon://sys-find",
                visible: !oConfig.disableAppFinder,
                actionType: "action",
                press: function () {
                    Measurement.start("FLP:AppFinderLoadingStartToEnd", "AppFinderLoadingStartToEnd", "FLP");
                    sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossAppNavigator) {
                        oCrossAppNavigator.toExternal({ target: { semanticObject: "Shell", action: "appfinder" } });
                    });
                }
            });
            if (bEnableHelp) {
                oOpenCatalogItem.addStyleClass("help-id-openCatalogActionItem"); // xRay help ID
            }
            this._addDanglingControl(oOpenCatalogItem);
        },

        _createAboutButton: function (bEnableHelp) {
            var sId = "aboutBtn";
            if (!sap.ui.getCore().byId(sId)) {
                var oAboutButton = new AboutButton(sId);
                if (bEnableHelp) {
                    oAboutButton.addStyleClass("help-id-aboutBtn"); // xRay help ID
                }
                this._addDanglingControl(oAboutButton);
                _renderer().showActionButton(sId, false);
            }
        },

        _createSettingsButton: function (bEnableHelp) {
            var sId = "userSettingsBtn";
            if (!sap.ui.getCore().byId(sId)) {
                var oUserPrefButton = new ActionItem(sId, {
                    text: resources.i18n.getText("userSettings"),
                    icon: "sap-icon://action-settings",
                    press: function () {
                        EventHub.emit("openUserSettings", Date.now());
                    }
                });
                if (bEnableHelp) {
                    oUserPrefButton.addStyleClass("help-id-loginDetails"); // xRay help ID
                }
                this._addDanglingControl(oUserPrefButton);
            }
        },

        _createSupportTicketButton: function (bEnableHelp) {
            var that = this;
            //Create button on demand
            Config.on("/core/extension/SupportTicket").do(function (bConfigured) {
                // 1) false and no button : do nothing
                // 2) false and the button exists: probably visible, set visibility to false
                // 3) true: create the button and set visibility to true
                var sId = "ContactSupportBtn";
                var oContactSupport = sap.ui.getCore().byId(sId);
                if (bConfigured && !oContactSupport) {
                    oContactSupport = new ContactSupportButton(sId);
                    that._addDanglingControl(oContactSupport);
                    if (bEnableHelp) {
                        oContactSupport.addStyleClass("help-id-contactSupportBtn"); // xRay help ID
                    }
                }
                if (bConfigured) {
                    _renderer().showActionButton(sId);
                } else {
                    _renderer().hideActionButton(sId);
                }
            });
        },
        _createEndUserFeedbackButton: function (oConfig, bEnableHelp) {
            var that = this;
            Config.on("/core/extension/EndUserFeedback").do(function (bConfigured) {
                if (bConfigured) { // Create and set the End User Feedback button
                    var sId = "EndUserFeedbackBtn";
                    var oEndUserFeedbackBtn = sap.ui.getCore().byId(sId);
                    if (!oEndUserFeedbackBtn) {
                        var endUserFeedbackConfiguration = _renderer().getEndUserFeedbackConfiguration();
                        oEndUserFeedbackBtn = new EndUserFeedback(sId, {
                            showAnonymous: endUserFeedbackConfiguration.showAnonymous,
                            anonymousByDefault: endUserFeedbackConfiguration.anonymousByDefault,
                            showLegalAgreement: endUserFeedbackConfiguration.showLegalAgreement,
                            showCustomUIContent: endUserFeedbackConfiguration.showCustomUIContent,
                            feedbackDialogTitle: endUserFeedbackConfiguration.feedbackDialogTitle,
                            textAreaPlaceholder: endUserFeedbackConfiguration.textAreaPlaceholder,
                            customUIContent: endUserFeedbackConfiguration.customUIContent
                        });
                        if (bEnableHelp) {
                            oEndUserFeedbackBtn.addStyleClass("help-id-EndUserFeedbackBtn"); // xRay help ID
                        }
                        oEndUserFeedbackBtn.setModel(_model());
                        that._addDanglingControl(oEndUserFeedbackBtn);
                    }

                    sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function (oEndUserFeedbackService) {
                        Config.emit("/core/shell/model/showEndUserFeedback", true);
                        that._setupEndUserFeedbackButton(oEndUserFeedbackService, oEndUserFeedbackBtn, oConfig);
                    });
                } else {
                    Config.emit("/core/shell/model/showEndUserFeedback", false);
                }
            });
        },

        _setupEndUserFeedbackButton: function (oEndUserFeedbackService, oEndUserFeedbackBtn, oConfig) {
            try {
                oEndUserFeedbackService.isEnabled()
                    .done(function () { // The service is enabled
                        var endUserFeedbackConfiguration = _renderer().getEndUserFeedbackConfiguration();

                        if (oConfig.moveGiveFeedbackActionToShellHeader) {
                            Measurement.start("FLP:Shell.controller._createActionButtons",
                                "create give feedback as shell head end item", "FLP");
                            // since the EndUserFeedback is not compatible type with shell header end item,
                            // create here the button which will not be shown on the view and trigger its
                            // press method by a shell header end item button that was created in ControlManager.js
                            var tempBtn = sap.ui.getCore().byId("EndUserFeedbackHandlerBtn");
                            if (tempBtn) {
                                tempBtn.setModel(_model());
                                tempBtn.setShowAnonymous(endUserFeedbackConfiguration.showAnonymous);
                                tempBtn.setAnonymousByDefault(endUserFeedbackConfiguration.anonymousByDefault);
                                tempBtn.setShowLegalAgreement(endUserFeedbackConfiguration.showLegalAgreement);
                                tempBtn.setShowCustomUIContent(endUserFeedbackConfiguration.showCustomUIContent);
                                tempBtn.setFeedbackDialogTitle(endUserFeedbackConfiguration.feedbackDialogTitle);
                                tempBtn.setTextAreaPlaceholder(endUserFeedbackConfiguration.textAreaPlaceholder);
                                tempBtn.setAggregation("customUIContent", endUserFeedbackConfiguration.customUIContent, false);

                                oEndUserFeedbackBtn.attachPress(function () {
                                    tempBtn.firePress();
                                }); // Exception if the button does not exist
                            }

                            Measurement.end("FLP:Shell.controller._createActionButtons");
                        }
                        oEndUserFeedbackBtn.setVisible(true);
                        _renderer().showActionButton(oEndUserFeedbackBtn.getId());
                    })
                    .fail(function () { // The service is disabled
                        if (oConfig.moveGiveFeedbackActionToShellHeader) {
                            _renderer().hideHeaderEndItem(oEndUserFeedbackBtn.getId());
                        } else {
                            _renderer().hideActionButton(oEndUserFeedbackBtn.getId());
                        }
                    });
            } catch (e) {
                Log.error("EndUserFeedback adapter is not found", e.message || e);
            }
        },

        _createRecentActivitiesButton: function () {
            var that = this,
                sId = "recentActivitiesBtn";

            Config.on("/core/shell/model/enableTrackingActivity").do(function (bEnableTrackingActivity) {
                if (bEnableTrackingActivity) {
                    var oRecentActivitiesBtn = sap.ui.getCore().byId(sId);
                    if (!oRecentActivitiesBtn) {
                        oRecentActivitiesBtn = new ActionItem(sId, {
                            text: resources.i18n.getText("recentActivities"),
                            icon: "sap-icon://customer-history",
                            press: function () {
                                QuickAccess.openQuickAccessDialog("recentActivityFilter", "meAreaHeaderButton");
                            }
                        });
                        that._addDanglingControl(oRecentActivitiesBtn);
                    }
                    _renderer().showActionButton(sId, false);
                } else {
                    _renderer().hideActionButton(sId, false);
                }
            });
        },

        _createFrequentActivitiesButton: function () {
            var that = this,
                sId = "frequentActivitiesBtn";

            Config.on("/core/shell/model/enableTrackingActivity").do(function (bEnableTrackingActivity) {
                if (bEnableTrackingActivity) {
                    var oFrequentActivitiesBtn = sap.ui.getCore().byId(sId);
                    if (!oFrequentActivitiesBtn) {
                        oFrequentActivitiesBtn = new ActionItem(sId, {
                            text: resources.i18n.getText("frequentActivities"),
                            icon: "sap-icon://activity-individual",
                            tooltip: resources.i18n.getText("frequentActivitiesTooltip"),
                            press: function () {
                                QuickAccess.openQuickAccessDialog("frequentlyUsedFilter", "meAreaHeaderButton");
                            }
                        });
                        that._addDanglingControl(oFrequentActivitiesBtn);
                    }
                    _renderer().showActionButton(sId, false);
                } else {
                    _renderer().hideActionButton(sId, false);
                }
            });
        },

        _createLogoutButton: function () {
            var sId = "logoutBtn";
            if (sap.ui.getCore().byId(sId)) {
                return;
            }
            var oLogoutBtn = new ActionItem(sId, {
                visible: true,
                type: ButtonType.Transparent,
                icon: "sap-icon://log",
                text: resources.i18n.getText("signoutBtn_title"),
                press: this.logout
            });
            this._addDanglingControl(oLogoutBtn);
            _renderer().showActionButton(sId, false);
        },

        logout: function () {
            sap.ui.require([ "sap/m/MessageBox", "sap/ushell/ui/launchpad/LoadingDialog" ],
                function (MessageBox, LoadingDialog) {
                    var oLoading = new LoadingDialog({ text: "" }),
                        bShowLoadingScreen = true,
                        bIsLoadingScreenShown = false,
                        oLogoutDetails = {};

                    sap.ushell.Container.getGlobalDirty().done(function (dirtyState) {
                        bShowLoadingScreen = false;
                        if (bIsLoadingScreenShown === true) {
                            oLoading.exit();
                            oLoading = new LoadingDialog({ text: "" });
                        }

                        var _getLogoutDetails = function () {
                            var oResourceBundle = resources.i18n;

                            if (dirtyState === sap.ushell.Container.DirtyState.DIRTY) {
                                // show warning only if it is sure that there are unsaved changes
                                oLogoutDetails.message = oResourceBundle.getText("unsaved_data_warning_popup_message");
                                oLogoutDetails.icon = MessageBox.Icon.WARNING;
                                oLogoutDetails.messageTitle = oResourceBundle.getText("unsaved_data_warning_popup_title");
                            } else {
                                // show 'normal' logout confirmation in all other cases, also if dirty state could not be determined
                                oLogoutDetails.message = oResourceBundle.getText("signoutConfirmationMsg");
                                oLogoutDetails.icon = MessageBox.Icon.QUESTION;
                                oLogoutDetails.messageTitle = oResourceBundle.getText("signoutMsgTitle");
                            }

                            return oLogoutDetails;
                        };

                        oLogoutDetails = _getLogoutDetails(dirtyState);
                        MessageBox.show(oLogoutDetails.message, oLogoutDetails.icon,
                            oLogoutDetails.messageTitle, [ MessageBox.Action.OK, MessageBox.Action.CANCEL ],
                            function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    oLoading.openLoadingScreen();
                                    oLoading.showAppInfo(resources.i18n.getText("beforeLogoutMsg"), null);
                                    sap.ushell.Container.logout();
                                } else if (window.document.activeElement && window.document.activeElement.tagName === "BODY") {
                                    window.document.getElementById("meAreaHeaderButton").focus();
                                }
                            }, ElementMetadata.uid("confirm"));
                    });
                    if (bShowLoadingScreen === true) {
                        oLoading.openLoadingScreen();
                        bIsLoadingScreenShown = true;
                    }
                }
            );
        },

        _addDanglingControl: function (oControl) {
            this._aDanglingControl.push(oControl);
        },

        _destroyDanglingControls: function () {
            if (this._aDanglingControl) {
                this._aDanglingControl.forEach(function (oControl) {
                    if (oControl.destroyContent) {
                        oControl.destroyContent();
                    }
                    oControl.destroy();
                });
            }
        },

        /**
         * Method to open or close the MeArea popover
         *
         * @param {boolean} bShow flag to open or cloase MeArea popover
         *
         * @private
         */
        _toggleMeAreaPopover: function (bShow) {
            var oPopover = sap.ui.getCore().byId("sapUshellMeAreaPopover");
            if (!oPopover) {
                oPopover = sap.ui.xmlfragment("sap.ushell.components.shell.MeArea.MeAreaPopover", this);
                oPopover.setModel(this.getModel());
            } else if (bShow) {
                oPopover.getModel().refresh(true); // force refresh by reopen because the visibility of actions may change
            }
            if (bShow) {
                oPopover.openBy(sap.ui.getCore().byId("meAreaHeaderButton"));
            } else {
                oPopover.close();
            }
        },

        meAreaPopoverItemFactory: function (sId, oContext) {
            var oActionItem = sap.ui.getCore().byId(oContext.getObject()),
                oListItem;

            var fnListItemPress = function () {
                if (oActionItem) {
                    oActionItem.firePress();
                    EventHub.emit("showMeArea", false);
                }
            };

            oListItem = new StandardListItem({
                id: sId + "-" + oActionItem.getId(),
                icon: oActionItem.getIcon(),
                iconInset: true,
                title: oActionItem.getText(),
                visible: oActionItem.getVisible(),
                type: ListType.Active,
                customData: [ { //used for opa test
                    key: "actionItemId",
                    value: oActionItem.getId()
                } ],
                press: fnListItemPress
            });
            oListItem.addStyleClass("sapUshellMeAreaActionItem");

            oListItem.addEventDelegate({
                onkeydown: function (oEvent) {
                    if (oEvent.keyCode === 32) { // Space
                        fnListItemPress();
                    }
                }
            });

            return oListItem;
        }
    });
});
},
	"sap/ushell/components/shell/MeArea/MeAreaPopover.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m" xmlns:core="sap.ui.core">\n    <Popover\n            id="sapUshellMeAreaPopover"\n            placement="Bottom"\n            showArrow="true"\n            showHeader="false"\n            class="sapUshellPopupContainer sapUiSizeCompact">\n        <content>\n            <List\n                class="sapUshellPopoverList"\n                showSeparators="None"\n                includeItemInSelection="true"\n                items="{\n                    path: \'/actions\',\n                    factory: \'.meAreaPopoverItemFactory\'\n                }">\n                <headerToolbar>\n                    <Toolbar style="Clear">\n                        <Title level="H5" text="{/userName}"/>\n                    </Toolbar>\n                </headerToolbar>\n            </List>\n       </content>\n    </Popover>\n</core:FragmentDefinition>'
},"Component-preload"
);
