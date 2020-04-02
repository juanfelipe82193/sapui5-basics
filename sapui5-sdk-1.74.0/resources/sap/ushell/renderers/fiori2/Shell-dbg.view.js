// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/HTML",
    "sap/ushell/components/_HeaderManager/ControlManager",
    "sap/ushell/components/HeaderManager",
    "sap/ushell/components/_HeaderManager/ShellHeader.controller",
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/library"
], function (
    Device,
    HTML,
    HeaderControlManager,
    HeaderManager,
    ShellHeaderController,
    ContactSupportButton,
    AccessibilityCustomData,
    Button,
    Dialog,
    resources,
    utils,
    Config,
    EventHub,
    JSONModel,
    jQuery,
    coreLibrary
) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    function fnShellUpdateAggItem (sId, oContext) {
        return sap.ui.getCore().byId(oContext.getObject());
    }

    sap.ui.jsview("sap.ushell.renderers.fiori2.Shell", {
        /**
         * Most of the following code acts just as placeholder for new Unified Shell Control.
         *
         * @param {Object} oController oController
         * @returns {sap.ushell.ui.Shell} oUnifiedShell
         * @public
         */
        createContent: function (oController) {
            this.oController = oController;
            this.oShellAppTitleStateEnum = {
                SHELL_NAV_MENU_ONLY: 0,
                ALL_MY_APPS_ONLY: 1,
                SHELL_NAV_MENU: 2,
                ALL_MY_APPS: 3
            };
            var oViewData = this.getViewData() || {},
                oConfig = oViewData.config || {};

            this.oConfig = oConfig;
            this.aDanglingControls = [];

            // Change config if more then three buttons moved to the header
            this._allowUpToThreeActionInShellHeader(oConfig);

            var oUnifiedShell = sap.ui.xmlfragment("sap.ushell.ui.ShellLayout", oController),
                oShellHeader = this.createShellHeader(oConfig, this.getViewData().shellModel);

            oUnifiedShell.setHeader(oShellHeader);
            oShellHeader.setShellLayout(oUnifiedShell);

            // handling of ToolArea lazy creation
            EventHub.once("CreateToolArea").do(function () {
                sap.ui.require(["sap/ushell/ui/shell/ToolArea"], function (ToolArea) {
                    var oShellToolArea = new ToolArea({
                        id: "shell-toolArea",
                        toolAreaItems: {
                            path: "/currentState/toolAreaItems",
                            factory: fnShellUpdateAggItem
                        }
                    });
                    oShellToolArea.updateAggregation = this.updateShellAggregation;
                    oShellToolArea.addEventDelegate({
                        onAfterRendering: function () {
                            oUnifiedShell.applySplitContainerSecondaryContentSize();
                        }
                    });
                    oUnifiedShell.setToolArea(oShellToolArea);
                }.bind(this));
            }.bind(this));

            this.setOUnifiedShell(oUnifiedShell);

            this.setDisplayBlock(true);
            this.addDanglingControl(sap.ui.getCore().byId("viewPortContainer"));

            // This property is needed for a special scenario when a remote Authentication is required.
            // IFrame src is set by UI2 Services
            this.logonIFrameReference = null;
            utils.setPerformanceMark("FLP - Shell.view rendering started!");
            return oUnifiedShell;
        },

        /**
         * allow up to 3 actions in shell header
         * @param {Object} oConfig view configuration
         */
        _allowUpToThreeActionInShellHeader: function (oConfig) {
            // in order to save performance time when these properties are not defined
            if (Object.keys(oConfig).length > 3) {
                var aParameter = [
                        "moveAppFinderActionToShellHeader",
                        "moveUserSettingsActionToShellHeader",
                        "moveGiveFeedbackActionToShellHeader",
                        "moveContactSupportActionToShellHeader",
                        "moveEditHomePageActionToShellHeader"
                    ],
                    count = 0,
                    sParameter;

                // count the number of "true" values, once get to three, force the other to be "false"
                for (var index = 0; index < 5; index++) {
                    sParameter = aParameter[index];
                    if (count === 3) {
                        // if 3 user actions have allready been moved to the shell header, assign false to every other parameter
                        oConfig[sParameter] = false;
                    } else if (oConfig[sParameter]) {
                        count++;
                    }
                }
            }
        },

        createShellHeader: function (oConfig, oShellModel) {
            // Create own model for the header
            var oShellHeaderModel = Config.createModel("/core/shellHeader", JSONModel),
                oHeaderController = new ShellHeaderController(),
                oShellHeader;
            HeaderControlManager.init(oConfig, oHeaderController, oShellModel);
            oShellHeader = sap.ui.xmlfragment("sap.ushell.ui.ShellHeader", oHeaderController);

            if (Device.system.desktop) {
                oShellHeader.setAccessKeyHandler(sap.ushell.renderers.fiori2.AccessKeysHandler);

                // Handle the title
                var oShellHeaderAppTitle = oShellHeader.getAppTitle();
                oShellHeaderAppTitle.addEventDelegate({
                    onsapskipforward: function (oEvent) {
                        if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                        }
                    }
                });
            }

            if (oConfig.appState === "embedded") {
                oShellHeader.setNoLogo();
            }

            // Assign models to the Shell Header
            oShellHeader.setModel(oShellHeaderModel);
            oShellHeader.setModel(resources.i18nModel, "i18n");

            this.addEventDelegate({
                "onBeforeRendering": function () {
                    // Render the Shell Header
                    oShellHeader.createUIArea(this.getUIArea().getId());
                }
            }, this);

            return oShellHeader;
        },

        /**
         * Begin factory functions for lazy instantiation of Shell Layout controls
         */

        createPostCoreExtControls: function () {
            // In order to minimize core-min we delay the FloatingContainer, ShellFloatingActions creation.
            sap.ui.require([
                "sap/ushell/ui/shell/FloatingContainer",
                "sap/ushell/ui/shell/ShellFloatingActions"
            ], function (FloatingContainer, ShellFloatingActions) {
                var oShell = sap.ui.getCore().byId("shell");

                // qUnit specific: the function may be called after the shell is destroyed
                if (!oShell) {
                    return;
                }

                var oShellFloatingContainer = new FloatingContainer({
                    id: "shell-floatingContainer",
                    content: {
                        path: "/currentState/floatingContainerContent",
                        factory: fnShellUpdateAggItem
                    }
                });
                if (Device.system.desktop) {
                    // add tabindex for the floating container so it can be tab/f6
                    oShellFloatingContainer.addCustomData(new AccessibilityCustomData({
                        key: "tabindex",
                        value: "-1",
                        writeToDom: true
                    }));
                    // from the container , next f6 is to the shell
                    oShellFloatingContainer.addEventDelegate({
                        onsapskipforward: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        },
                        onsapskipback: function (oEvent) {
                            if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                                oEvent.preventDefault();
                                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                            }
                        }
                    });
                }

                oShellFloatingContainer.setModel(oShell.getModel());

                this.addDanglingControl(oShellFloatingContainer);
                var oShellFloatingActions = new ShellFloatingActions({
                    id: "shell-floatingActions",
                    floatingActions: {
                        path: "/currentState/floatingActions",
                        factory: fnShellUpdateAggItem
                    }
                });

                oShellFloatingActions.updateAggregation = this.updateShellAggregation;

                var oShellLayout = this.getOUnifiedShell();
                oShellLayout.setFloatingContainer(oShellFloatingContainer);
                oShellLayout.setFloatingActionsContainer(oShellFloatingActions);

                this._createAllMyAppsView();
            }.bind(this));
        },

        _createAllMyAppsView: function () {
            var oModel = this.getModel(),
                onServiceLoaded = function (oAllMyApps) {
                if (oAllMyApps.isEnabled()) {
                    this.oAllMyAppsView = sap.ui.view("allMyAppsView", {
                        type: ViewType.JS,
                        viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps",
                        viewData: {
                            _fnGetShellModel: function () {
                                return oModel;
                            }
                        },
                        async: true,
                        height: "100%",
                        visible: {
                            path: "/ShellAppTitleState",
                            formatter: function (oCurrentState) {
                                return oCurrentState !== this.oShellAppTitleStateEnum.SHELL_NAV_MENU;
                            }.bind(this)
                        }
                    }).addStyleClass("sapUshellAllMyAppsView");

                    this.oAllMyAppsView.addCustomData(new AccessibilityCustomData({
                        key: "aria-label",
                        value: resources.i18n.getText("allMyApps_headerTitle"),
                        writeToDom: true
                    }));

                    this.getOUnifiedShell().getHeader().getAppTitle().setAllMyApps(this.oAllMyAppsView);
                }
            }.bind(this);

            sap.ushell.Container.getServiceAsync("AllMyApps").then(onServiceLoaded);
        },

        getOUnifiedShell: function () {
            return this.oUnifiedShell;
        },

        setOUnifiedShell: function (oUnifiedShell) {
            this.oUnifiedShell = oUnifiedShell;
        },

        updateShellAggregation: function (sName) {
            var oBindingInfo = this.mBindingInfos[sName],
                oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
                oClone;

            jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function (i, v) {
                this[oAggregationInfo._sRemoveMutator](v);
            }, this));
            jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function (i, v) {
                oClone = oBindingInfo.factory(this.getId() + "-" + i, v)
                    ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model)
                    : "";
                this[oAggregationInfo._sMutator](oClone);
            }, this));
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.Shell";
        },

        createIFrameDialog: function () {
            var oDialog = null,
                oLogonIframe = this.logonIFrameReference,
                bContactSupportEnabled;

            var _getIFrame = function () {
                // In order to assure the same iframe for SAML authentication is not reused, we will first remove it from the DOM if exists.
                if (oLogonIframe) {
                    oLogonIframe.remove();
                }
                // The src property is empty by default. the caller will set it as required.
                return jQuery("<iframe id=\"SAMLDialogFrame\" src=\"\" frameborder=\"0\" height=\"100%\" width=\"100%\"></iframe>");
            };

            var _hideDialog = function () {
                oDialog.addStyleClass("sapUshellSamlDialogHidden");
                jQuery("#sap-ui-blocklayer-popup").addClass("sapUshellSamlDialogHidden");
            };

            // A new dialog wrapper with a new inner iframe will be created each time.
            this.destroyIFrameDialog();

            var closeBtn = new Button({
                text: resources.i18n.getText("samlCloseBtn"),
                press: function () {
                    sap.ushell.Container.cancelLogon(); // Note: calls back destroyIFrameDialog()!
                }
            });

            var oHTMLCtrl = new HTML("SAMLDialogFrame");
            // create new iframe and add it to the Dialog HTML control
            this.logonIFrameReference = _getIFrame();
            oHTMLCtrl.setContent(this.logonIFrameReference.prop("outerHTML"));
            oDialog = new Dialog({
                id: "SAMLDialog",
                title: resources.i18n.getText("samlDialogTitle"),
                contentWidth: "50%",
                contentHeight: "50%",
                rightButton: closeBtn
            }).addStyleClass("sapUshellIframeDialog");
            bContactSupportEnabled = Config.last("/core/extension/SupportTicket");
            if (bContactSupportEnabled) {
                var oContactSupportBtn = new ContactSupportButton();
                oContactSupportBtn.setWidth("150px");
                oContactSupportBtn.setIcon("");
                oDialog.setLeftButton(oContactSupportBtn);
            }
            oDialog.addContent(oHTMLCtrl);
            oDialog.open();
            // Make sure to manipulate css properties after the dialog is rendered.
            _hideDialog();
            this.logonIFrameReference = jQuery("#SAMLDialogFrame");
            return this.logonIFrameReference[0];
        },

        destroyIFrameDialog: function () {
            var dialog = sap.ui.getCore().byId("SAMLDialog");
            if (dialog) {
                dialog.destroy();
            }
            this.logonIFrameReference = null;
        },

        showIFrameDialog: function () {
            // remove css class of dialog
            var oDialog = sap.ui.getCore().byId("SAMLDialog");

            if (oDialog) {
                oDialog.removeStyleClass("sapUshellSamlDialogHidden");
                jQuery("#sap-ui-blocklayer-popup").removeClass("sapUshellSamlDialogHidden");
            }
        },

        addDanglingControl: function (oControl) {
            this.aDanglingControls.push(oControl);
        },

        destroyDanglingControls: function () {
            if (this.aDanglingControls) {
                this.aDanglingControls.forEach(function (oControl) {
                    if (oControl.destroyContent) {
                        oControl.destroyContent();
                    }
                    oControl.destroy();
                });
            }
        }
    });
});
