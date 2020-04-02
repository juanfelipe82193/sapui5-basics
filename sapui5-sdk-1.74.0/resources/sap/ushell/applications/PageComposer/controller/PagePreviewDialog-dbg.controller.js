// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ushell/Config"
], function (
    Controller,
    Fragment,
    JSONModel,
    Filter,
    Config
) {
    "use strict";

    var resources = {};
    var _oDialog;

    /**
     * Returns the tile properties used for displaying the tile.
     * Should be used when instantiating a visualization using "localLoad" mode.
     * @see sap.ushell.services.VisualizationLoading#instantiateVisualization
     *
     * @param {object} tileData The tile properties.
     * @returns {object} The tile properties for usage in "VizInstance" "localLoad" mode.
     * @private
     */
    function _getTileProperties (tileData) {
        var oTileProperties = Object.assign(Object.create(null), tileData);

        // adjust service property name: "subTitle" -> "subtitle"
        if (oTileProperties.subTitle) {
            oTileProperties.subtitle = oTileProperties.subTitle;
            delete oTileProperties.subTitle;
        }
        // adjust service property name: "iconUrl" -> "icon"
        if (oTileProperties.iconUrl) {
            oTileProperties.icon = oTileProperties.iconUrl;
            delete oTileProperties.iconUrl;
        }

        // custom tile "info" placeholder (or any other type of tile)
        if (oTileProperties.tileType !== "STATIC" && oTileProperties.tileType !== "DYNAMIC" && !oTileProperties.info) {
            oTileProperties.info = "[" + resources.i18n.getText("Title.CustomTile") + "]";
        }

        return oTileProperties;
    }

    function _hasValidTarget (oVisualization) {
        var oContextInfo = oVisualization.getBindingContext(),
            sInboundPermanentKey = oContextInfo.getProperty(oContextInfo.getPath()).inboundPermanentKey,
            sTarget = oVisualization.getTarget();

        return sInboundPermanentKey || !sTarget || sTarget[0] !== "#";
    }

    /**
     * Show only visualizations that are selected in the current role scope.
     * If the scope is not set, all visualizations are shown.
     * Array of available visualization IDs is provided by the scope selector in the "roles" model.
     *
     * @private
     */
    function _filterRoles () {
        var aAvailableIds;
        var oRolesModel;
        var oFilter = new Filter({
            path: "vizId",
            caseSensitive: true,
            test: function (vizId) {
                return !aAvailableIds || aAvailableIds.indexOf(vizId) >= 0;
            }
        });
        var oPage = _oDialog && _oDialog.getContent()[0];
        if (oPage) {
            oRolesModel = oPage.getModel("roles");
            if (oRolesModel) {
                aAvailableIds = oRolesModel.getProperty("/availableVisualizations");
            }
            oPage.getSections().forEach(function (oSection) {
                oSection.getBinding("visualizations").filter(oFilter);
            });
        }
    }

    var PagePreviewDialogController = Controller.extend("sap.ushell.applications.PageComposer.controller.PagePreviewDialog.controller", {
        load: function (sParentId) {
            return _oDialog ? Promise.resolve(_oDialog) : Fragment.load({
                    id: sParentId,
                    name: "sap.ushell.applications.PageComposer.view.PagePreviewDialog",
                    controller: this
                });
        },

        open: function (oSourceControl, sParentId) {
            this.load(sParentId).then(function (oDialog) {
                _oDialog = oDialog;
                resources.i18n = oSourceControl.getModel("i18n").getResourceBundle();
                oSourceControl.addDependent(oDialog);

                oDialog.setModel(new JSONModel({
                    sizeBehavior: Config.last("/core/home/sizeBehavior")
                }), "viewSettings");
                _filterRoles(); // filter visualizations according to the currently selected scope
                oDialog.open();
            });
        },

        close: function () {
            if (_oDialog) {
                _oDialog.close();
            }
        },

        /**
         * Creates the visualizations inside of the sections.
         *
         * @param {string} sId The ID of the visualization.
         * @param {sap.ui.model.Context} oBindingContext The visualization binding context.
         * @returns {sap.ushell.ui.launchpad.VizInstance} A visualization inside of a section.
         *
         * @private
         */
        visualizationFactory: function (sId, oBindingContext) {
            if (!this.oVisualizationLoadingService) {
                // The service is already loaded, no need for an async call
                this.oVisualizationLoadingService = sap.ushell.Container.getService("VisualizationLoading");
            }

            var oTileData = oBindingContext.getProperty(),
                oVisualization = this.oVisualizationLoadingService.instantiateVisualization({
                    vizId: oTileData.vizId,
                    previewMode: true,
                    localLoad: true,
                    tileType: (oTileData.tileType === "DYNAMIC" ? "sap.ushell.ui.tile.DynamicTile" : "sap.ushell.ui.tile.StaticTile"),
                    properties: _getTileProperties(oTileData)
                });

            oVisualization._getInnerControlPromise().then(function () {
                var oInnerControl = oVisualization.getInnerControl().getContent
                    ? oVisualization.getInnerControl().getContent()[0]
                    : oVisualization.getInnerControl();

                oInnerControl.attachPress(function (oEvent) {
                    oVisualization.fireEvent("press");
                });

                // sizeBehavior for tiles: Small/Responsive
                oInnerControl.bindProperty("sizeBehavior", "viewSettings>/sizeBehavior");
                oInnerControl.setScope("Display");

                if (oVisualization.getState() !== "Loading"
                    && !_hasValidTarget(oVisualization)
                    && oInnerControl.setState) {
                    oInnerControl.setState("Failed");
                }
            });

            return oVisualization;
        }

    });

    return new PagePreviewDialogController();
});