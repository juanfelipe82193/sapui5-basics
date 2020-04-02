// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/base/Log"
], function (AppRuntimeService, Log) {
    "use strict";

    var aButtonsHandlers = [];

    function RendererProxy () {
        var that = this;

        sap.ushell = (sap.ushell || {});
        sap.ushell.renderers = (sap.ushell.renderers || {});
        sap.ushell.renderers.fiori2 = (sap.ushell.renderers.fiori2 || {});
        sap.ushell.renderers.fiori2.Renderer = this;

        [
            "init", "createContent", "createExtendedShellState", "applyExtendedShellState", "showLeftPaneContent", "showHeaderItem",
            "showRightFloatingContainerItem", "showRightFloatingContainer", "showToolAreaItem", "showActionButton",
            "showFloatingActionButton", "showHeaderEndItem", "setHeaderVisibility", "showSubHeader", "showSignOutItem", "showSettingsItem",
            "setFooter", "setShellFooter", "setFooterControl", "hideHeaderItem", "removeToolAreaItem", "removeRightFloatingContainerItem",
            "hideActionButton", "hideLeftPaneContent", "hideFloatingActionButton", "hideSubHeader", "removeFooter",
            "getCurrentViewportState", "addShellSubHeader", "addSubHeader", "addUserAction", "addActionButton", "addFloatingButton",
            "addFloatingActionButton", "addSidePaneContent", "addLeftPaneContent", "addHeaderItem", "addRightFloatingContainerItem",
            "addToolAreaItem", "getModelConfiguration", "addEndUserFeedbackCustomUI", "addUserPreferencesEntry", "setHeaderTitle",
            "setLeftPaneVisibility", "showToolArea", "setHeaderHiding", "setFloatingContainerContent", "setFloatingContainerVisibility",
            "getFloatingContainerVisiblity", "getRightFloatingContainerVisibility", "setFloatingContainerDragSelector",
            "makeEndUserFeedbackAnonymousByDefault", "showEndUserFeedbackLegalAgreement", "createTriggers", "convertButtonsToActions",
            "createItem", "addEntryInShellStates", "removeCustomItems", "addCustomItems", "addRightViewPort", "addLeftViewPort",
            "getShellController", "getViewPortContainerCurrentState", "ViewPortContainerNavTo", "switchViewPortStateByControl",
            "setMeAreaSelected", "getMeAreaSelected", "setNotificationsSelected", "getNotificationsSelected", "addShellDanglingControl",
            "getShellConfig", "getEndUserFeedbackConfiguration", "reorderUserPrefEntries", "addUserProfilingEntry", "logRecentActivity",
            "setCurrentCoreView", "getCurrentCoreView"
        ].forEach(function (sMethod) {
            that[sMethod] = function () {
                Log.error("'Renderer' api '" + sMethod
                    + "' is not supported when UI5 application is running inside an iframe (sap.ushell.appRuntime.ui5.renderers.fiori2.Renderer)");
            };
        });

        this.LaunchpadState = {
            App: "app",
            Home: "home"
        };

        this._addButtonHandler = function (sId, fnHandler) {
            aButtonsHandlers[sId] = fnHandler;
        };

        this.handleHeaderButtonClick = function (sButtonId) {
            if (aButtonsHandlers[sButtonId] !== undefined) {
                aButtonsHandlers[sButtonId]();
            }
        };

        this.addHeaderItem = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
            this._addHeaderItem(
                "sap.ushell.services.Renderer.addHeaderItem",
                oControlProperties,
                bIsVisible,
                bCurrentState,
                aStates
            );
        };

        this.addHeaderEndItem = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
            this._addHeaderItem(
                "sap.ushell.services.Renderer.addHeaderEndItem",
                oControlProperties,
                bIsVisible,
                bCurrentState,
                aStates
            );
        };

        this.showHeaderItem = function (aIds/*, bCurrentState, aStates*/) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Renderer.showHeaderItem", {
                    "aIds": aIds,
                    "bCurrentState": true,
                    "aStates": ""
                }
            );
        };

        this.showHeaderEndItem = function (aIds/*, bCurrentState, aStates*/) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Renderer.showHeaderEndItem", {
                    "aIds": aIds,
                    "bCurrentState": true,
                    "aStates": ""
                }
            );
        };

        this.hideHeaderItem = function (aIds/*, bCurrentState, aStates*/) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Renderer.hideHeaderItem", {
                    "aIds": aIds,
                    "bCurrentState": true,
                    "aStates": ""
                }
            );
        };

        this.hideHeaderEndItem = function (aIds/*, bCurrentState, aStates*/) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Renderer.hideHeaderEndItem", {
                    "aIds": aIds,
                    "bCurrentState": true,
                    "aStates": ""
                }
            );
        };

        this._addHeaderItem = function (sAPI, oControlProperties, bIsVisible/*, bCurrentState, aStates*/) {
            if (oControlProperties.click !== undefined) {
                aButtonsHandlers[oControlProperties.id] = oControlProperties.click;
            }
            AppRuntimeService.sendMessageToOuterShell(
                sAPI, {
                    sId: oControlProperties.id,
                    sTooltip: oControlProperties.tooltip,
                    sIcon: oControlProperties.icon,
                    bVisible: bIsVisible,
                    bCurrentState: true
                }
            );
        };

        this.setHeaderTitle = function (sTitle) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Renderer.setHeaderTitle",
                { "sTitle": sTitle }
            );
        };

        this.setHeaderVisibility = function (bVisible, bCurrentState, aStates) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Renderer.setHeaderVisibility", {
                    "bVisible": bVisible,
                    "bCurrentState": bCurrentState,
                    "aStates": aStates
                }
            );
        };
    }

    return new RendererProxy();
});
