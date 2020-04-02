//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview ActionMode for the PageRuntime view
 *
 * @version 1.74.0
 */

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/EventHub",
    "sap/base/Log"
], function (resources, EventHub, Log) {
    "use strict";
    var ActionMode = {};

    /**
     * Initialization of the action mode for the pages runtime
     *
     * @param {sap.ui.core.mvc.Controller} oController Controller of the pages runtime
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.start = function (oController) {
        this.oController = oController;
        oController.getView().getModel("viewSettings").setProperty("/actionModeActive", true);
        EventHub.emit("enableMenuBarNavigation", false);

        var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
        var sActionModeButtonText = resources.i18n.getText("PageRuntime.EditMode.Exit");
        oActionModeButton.setTooltip(sActionModeButtonText);
        oActionModeButton.setText(sActionModeButtonText);
    };

    /**
     * Handler for action mode cancel
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.cancel = function () {
        this._cleanup();
    };

    /**
     * Handler for action mode save
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.save = function () {
        Log.info("store actions in pages service");
        this._cleanup();
    };

    /**
     * Disables the action mode and enables the navigation
     *
     * @private
     * @since 1.74.0
     */
    ActionMode._cleanup = function () {
        this.oController.getView().getModel("viewSettings").setProperty("/actionModeActive", false);
        EventHub.emit("enableMenuBarNavigation", true);

        var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
        var sActionModeButtonText = resources.i18n.getText("PageRuntime.EditMode.Activate");
        oActionModeButton.setTooltip(sActionModeButtonText);
        oActionModeButton.setText(sActionModeButtonText);
    };

    /**
     * Handler for visualization add
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.visualizationAdd = function (oEvent, oSource, oParameters) {
        Log.info("add visualization");
    };

    /**
     * Handler for section add
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.sectionAdd = function (oEvent, oSource, oParameters) {
        Log.info("add section");
    };

    /**
     * Handler for section delete
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.sectionDelete = function (oEvent, oSource, oParameters) {
        Log.info("delete section");
    };

    /**
     * Handler for section reset
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.sectionReset = function (oEvent, oSource, oParameters) {
        Log.info("reset section");
    };

    /**
     * Handler for section title change
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.sectionTitleChange = function (oEvent, oSource, oParameters) {
        Log.info("section title changed");
    };

    /**
     * Handler for section drag and drop
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.sectionMove = function (oEvent, oSource, oParameters) {
        Log.info("section should be moved");
    };

    /**
     * Handler for section hide and unhide
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.sectionVisibilityChange = function (oEvent, oSource, oParameters) {
        Log.info("section was hidden or unhidden");
    };

    return ActionMode;
});