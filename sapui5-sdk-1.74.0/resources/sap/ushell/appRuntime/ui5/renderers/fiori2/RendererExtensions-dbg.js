// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global jQuery, sap */
sap.ui.define(['sap/ushell/EventHub', 'sap/base/util/ObjectPath'], function (EventHub, ObjectPath) {
    "use strict";

    function _init(oController) {
        setTimeout(function () {
            sap.ui.getCore().getEventBus().publish("sap.ushell", "rendererLoaded", {rendererName : "fiori2"});
        }, 0);
        EventHub.emit("RendererLoaded", {rendererName : "fiori2"});
    }
    function _publishExternalEvent(sEventName, oData) {
        setTimeout(function () {
            sap.ui.getCore().getEventBus().publish("sap.ushell.renderers.fiori2.Renderer", sEventName, oData);
        }, 0);
    }

    function _addSubHeader(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").showSubHeader(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _removeSubHeader(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").hideSubHeader(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _addHeaderItem(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").showHeaderItem(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _removeHeaderItem(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").hideHeaderItem(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _addOptionsActionSheetButton(oButton, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").showActionButton(oButton.getId(), false,  [sLaunchpadState1, sLaunchpadState2]);
    }
    function _removeOptionsActionSheetButton(oButton, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").hideActionButton(oButton.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _setLeftPaneContent(oContent, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").showLeftPaneContent(oContent.getId(), false,  [sLaunchpadState1, sLaunchpadState2]);
    }
    function _removeLeftPaneContent(sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").hideLeftPaneContent(false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _addFloatingActionButton(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").showFloatingActionButton(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _removeFloatingActionButton(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").hideFloatingActionButton(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _addHeaderEndItem(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").showHeaderEndItem(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _removeHeaderEndItem(oItem, sLaunchpadState1, sLaunchpadState2) {
        //sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem(oItem.getId(), false, [sLaunchpadState1, sLaunchpadState2]);
    }
    function _getConfiguration() {
        //return sap.ushell.Container.getRenderer("fiori2").getModelConfiguration();
        return {};
    }
    function _setHeaderItemVisibility(sItem, sLaunchpadState, bToLocal, bIsVisible) {
        //var oItem = sap.ui.getCore().byId(sItem);
        //if (bIsVisible) {
        //    sap.ushell.Container.getRenderer("fiori2").showHeaderItem(oItem.getId(), bToLocal, [sLaunchpadState]);
        //}
    }
    function _addEndUserFeedbackCustomUI(oCustomUIContent, bShowCustomUIContent) {
        //sap.ushell.Container.getRenderer("fiori2").addEndUserFeedbackCustomUI(oCustomUIContent, bShowCustomUIContent);
    }
    function _addUserPreferencesEntry(entryObject) {
        //sap.ushell.Container.getRenderer("fiori2").addUserPreferencesEntry(entryObject);
    }
    function _setHeaderTitle(sTitle) {
        //sap.ushell.Container.getRenderer("fiori2").setHeaderTitle(sTitle);
    }
    function _setLeftPaneVisibility(sLaunchpadState, bVisible) {
        //sap.ushell.Container.getRenderer("fiori2").setLeftPaneVisibility(sLaunchpadState, bVisible);
    }
    function _setHeaderHiding(bHiding) {
        //sap.ushell.Container.getRenderer("fiori2").setHeaderHiding(bHiding);
    }
    function _setFooter(oFooter) {
        //sap.ushell.Container.getRenderer("fiori2").setFooter(oFooter);
    }
    function _removeFooter() {
        //sap.ushell.Container.getRenderer("fiori2").removeFooter();
    }
    function RendererExtensions() {
        this.addHeaderItem = _addHeaderItem;
        this.setHeaderItemVisibility = _setHeaderItemVisibility;
        this.addSubHeader = _addSubHeader;
        this.removeSubHeader = _removeSubHeader;
        this.addHeaderEndItem = _addHeaderEndItem;
        this.removeHeaderItem = _removeHeaderItem;
        this.removeHeaderEndItem = _removeHeaderEndItem;
        this.addEndUserFeedbackCustomUI = _addEndUserFeedbackCustomUI;
        this.addOptionsActionSheetButton = _addOptionsActionSheetButton;
        this.removeOptionsActionSheetButton = _removeOptionsActionSheetButton;
        this.setFooter = _setFooter;
        this.removeFooter = _removeFooter;
        this.addUserPreferencesEntry = _addUserPreferencesEntry;
        this.setHeaderTitle = _setHeaderTitle;
        this.setHeaderHiding = _setHeaderHiding;
        this.LaunchpadState = {
            App: "app",
            Home: "home"
        };
        this.addFloatingActionButton = _addFloatingActionButton;
        this.removeFloatingActionButton = _removeFloatingActionButton;
        this.setLeftPaneContent = _setLeftPaneContent;
        this.removeLeftPaneContent = _removeLeftPaneContent;
        this.setLeftPaneVisibility = _setLeftPaneVisibility;
        this.getConfiguration = _getConfiguration;
    }

    var RendererExtensions1 = new RendererExtensions();

    // we need a global namespace registration for the RendererExtensions for backwards compatibility
    // if utils are really needed should be revalidated
    var oUtils = {
        publishExternalEvent : _publishExternalEvent,
        init : _init
    };
    ObjectPath.set("sap.ushell.renderers.fiori2.utils", oUtils);

    ObjectPath.set("sap.ushell.renderers.fiori2.RendererExtensions", RendererExtensions1);

    return RendererExtensions1;

}, /* bExport= */ false);
