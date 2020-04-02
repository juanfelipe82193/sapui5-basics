// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/utils/clone"
], function (mobileLibrary, JSONModel, Config, fnClone) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    /**
     * @typedef {object} PageMessage An error or warning that occured on a page
     * @property {string} type The type of the message (i.e. error or warning)
     * @property {string} title The title of the message
     * @property {string} subtitle The subtitle of the message
     * @property {string} description The description of the message

    /**
     * @typedef {object} PageMessageCollection A collection of errors or warnings that occured on a page
     * @property {PageMessage[]} errors  Only the errors that occured on a page
     * @property {PageMessage[]} warnings Only the warnings that occured on a page
     */

    var oMainController,
        oPage,
        resources = {};

    var oViewSettingsModel = new JSONModel({
        sizeBehavior: Config.last("/core/home/sizeBehavior")
    });

    var _aDoableObject = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
        oViewSettingsModel.setProperty("/sizeBehavior", sSizeBehavior);
    });

    /**
     * Returns the model relevant indices from the given visualization
     *
     * @param {sap.ushell.ui.launchpad.VizInstance} oVisualization The visualization that is inside of a model.
     * @return {object} The relevant indices of the model
     * @private
     */
    function _getModelDataFromVisualization (oVisualization) {
        var aPath = oVisualization.getBindingContext().getPath().split("/"),
            iVisualizationIndex = aPath.pop();

        aPath.pop();
        return {
            visualizationIndex: iVisualizationIndex,
            sectionIndex: aPath.pop()
        };
    }

    function _hasValidTarget (oVisualization) {
        var oContextInfo = oVisualization.getBindingContext(),
            sInboundPermanentKey = oContextInfo.getProperty(oContextInfo.getPath()).inboundPermanentKey,
            sTarget = oVisualization.getTarget();

        return sInboundPermanentKey || !sTarget || sTarget[0] !== "#";
    }

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
        var oTileProperties = fnClone(tileData);

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

    /**
     * Checks if a visualization is available in the set role context.
     *
     * @param {sap.ushell.ui.launchpad.VizInstance} visualization The Visualization to be checked against the visualizations in the context.
     * @return {boolean} Whether the given visualization is available in the context.
     * @private
     */
    function _availableInContext (visualization) {
        var oRolesModel = oMainController.getModel("roles");
        var aAvailableVisualizations = oRolesModel && oRolesModel.getData().availableVisualizations;

        return !aAvailableVisualizations || aAvailableVisualizations.indexOf(visualization.getVisualizationId()) > -1;
    }

    return {
        /**
         * Initializes the Page fragment logic
         *
         * @param {sap.ui.core.mvc.Controller} oController The controller that uses the Page fragment
         *
         * @protected
         */
        init: function (oController) {
            oMainController = oController;

            oPage = oController.getView().byId("page");
            oPage.setModel(oController.getModel());
            oPage.setModel(oViewSettingsModel, "viewSettings");

            resources.i18n = oController.getResourceBundle();

            var bEdit = oController.getModel().getProperty("/edit");
            oPage.toggleStyleClass("sapUshellPageComposing", !!bEdit);
        },

        exit: function () {
            _aDoableObject.off();
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
            if (!oMainController.oVisualizationLoadingService) {
                throw new Error("Visualization Service was not loaded yet!");
            }

            var oTileData = oBindingContext.getProperty(),
                oVisualization = oMainController.oVisualizationLoadingService.instantiateVisualization({
                    vizId: oTileData.vizId,
                    previewMode: true,
                    localLoad: true,
                    tileType: (oTileData.tileType === "DYNAMIC" ? "sap.ushell.ui.tile.DynamicTile" : "sap.ushell.ui.tile.StaticTile"),
                    properties: _getTileProperties(oTileData)
                }),
                GenericTileAction = {
                    Press: "Press",
                    Remove: "Remove"
                };

            oVisualization._getInnerControlPromise().then(function () {
                var oInnerControl = oVisualization.getInnerControl().getContent
                    ? oVisualization.getInnerControl().getContent()[0]
                    : oVisualization.getInnerControl();

                oInnerControl.attachPress(function (oEvent) {
                    switch (oEvent.getParameter("action")) {
                        case GenericTileAction.Remove:
                            var oModelData = _getModelDataFromVisualization(oVisualization);
                            oMainController.deleteVisualizationInSection(oModelData.visualizationIndex, oModelData.sectionIndex);
                            break;
                        case GenericTileAction.Press:
                        default:
                            oVisualization.fireEvent("press");
                            break;
                    }
                });

                // sizeBehavior for tiles: Small/Responsive
                oInnerControl.bindProperty("sizeBehavior", "viewSettings>/sizeBehavior");
                oInnerControl.setScope(oMainController.getModel().getProperty("/edit") ? "Actions" : "Display");

                if (oVisualization.getState() !== LoadState.Loading
                    && !_hasValidTarget(oVisualization)
                    && oInnerControl.setState) {
                    oInnerControl.setState(LoadState.Failed);
                }
            });

            oVisualization.attachPress(function (oEvent) {
                var oEventSource = oEvent.getSource(),
                    oBindingContext = oEventSource.getBindingContext();
                if (oPage.getProperty("edit")) {
                    oMainController._openTileInfo(oEventSource, oBindingContext);
                }
            });

            return oVisualization;
        },

        /**
         * Collects all errors and warnings that occured on the page.
         *
         * @returns {PageMessageCollection} A collection of errors or warnings that occured on the page.
         *
         * @protected
         */
        collectMessages: function () {
            var aErrors = [],
                aWarnings = [];

            oPage.getSections().forEach(function (oSection, iSectionIndex) {
                var oSectionTitle = oSection.byId("title-edit");
                if (oSection.getTitle() === "") {
                    oSectionTitle.setValueState("Warning");
                    oSectionTitle.setValueStateText(resources.i18n.getText("Message.InvalidSectionTitle"));
                    aWarnings.push({
                        type: "Warning",
                        title: resources.i18n.getText("Title.NoSectionTitle", iSectionIndex + 1),
                        description: resources.i18n.getText("Message.NoSectionTitle", iSectionIndex + 1)
                    });
                } else {
                    oSectionTitle.setValueState("None");
                }

                oSection.getVisualizations().forEach(function (oVisualization, iVisualizationIndex) {
                    if (oVisualization.getState() === LoadState.Failed) {
                        aErrors.push({
                            type: "Error",
                            title: resources.i18n.getText("Title.UnsufficientRoles"),
                            subtitle: resources.i18n.getText("Title.VisualizationIsNotVisible"),
                            description: resources.i18n.getText("Message.LoadTileError", [(iVisualizationIndex + 1) + ".", oSection.getTitle()])
                        });
                    } else if (oVisualization.getState() !== LoadState.Loading && !_hasValidTarget(oVisualization)) {
                        aWarnings.push({
                            type: "Warning",
                            title: resources.i18n.getText("Message.NavigationTargetError"),
                            subtitle: resources.i18n.getText("Title.VisualizationNotNavigateable"),
                            description: resources.i18n.getText("Message.NavTargetResolutionError",
                                oVisualization.getTitle() || oVisualization.getCatalogTile().getTitle())
                        });
                    } else if (!_availableInContext(oVisualization)) {
                        aWarnings.push({
                            type: "Warning",
                            title: resources.i18n.getText("Message.VisualizationNotAvailableInContext"),
                            subtitle: resources.i18n.getText("Message.VisualizationNotAvailableInContext"),
                            description: resources.i18n.getText("Message.VisualizationOutOfContextError",
                                oVisualization.getTitle() || oVisualization.getCatalogTile().getTitle())
                        });
                    }
                });
            });

            return {
                errors: aErrors,
                warnings: aWarnings
            };
        },

        /**
         * Adds a new Section to the Page.
         *
         * @param {sap.ui.base.Event} [oEvent] The event data. If not given, section is added at the first position.
         *
         * @protected
         */
        addSection: function (oEvent) {
            var iSectionIndex = oEvent ? oEvent.getParameter("index") : 0;

            oMainController.addSectionAt(iSectionIndex);
        },

        /**
         * Deletes a Section from the Page
         *
         * @param {sap.ui.base.Event} oEvent contains event data
         *
         * @private
         */
        deleteSection: function (oEvent) {
            var oSection = oEvent.getSource(),
                sTitle = oSection.getTitle(),
                sMsg = sTitle ? resources.i18n.getText("Message.Section.Delete", sTitle)
                    : resources.i18n.getText("Message.Section.DeleteNoTitle");

            sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                function deleteSection (oAction) {
                    if (oAction === MessageBox.Action.DELETE) {
                        oMainController.deleteSection(oPage.indexOfSection(oSection));
                    }
                }

                sap.ushell.Container.getService("Message").confirm(
                    sMsg,
                    deleteSection,
                    resources.i18n.getText("Button.Delete"),
                    [
                        MessageBox.Action.DELETE,
                        MessageBox.Action.CANCEL
                    ]
                );
            });
        },

        /**
         * Moves a section inside of the Page
         *
         * @param {object} oInfo Drag and drop event data
         * @private
         */
        moveSection: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                iDragPosition = oPage.indexOfSection(oDragged),
                iDropPosition = oPage.indexOfSection(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
            }

            oMainController.moveSection(iDragPosition, iDropPosition);
        },

        /**
         * Moves a visualization inside a section or between different sections.
         *
         * @param {object} oDropInfo Drag and drop event data
         *
         * @private
         */
        moveVisualization: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                sInsertPosition = oDropInfo.getParameter("dropPosition");

            if (oDropped.isA("sap.ushell.ui.launchpad.Section")) {
                var oModelData = _getModelDataFromVisualization(oDragged),
                    iSectionPosition = oPage.indexOfSection(oDropped),
                    oBindingContext = oDragged.getBindingContext();

                oMainController.addVisualisationToSection(oBindingContext.getModel().getProperty(oBindingContext.getPath()), [iSectionPosition], 0);
                oMainController.deleteVisualizationInSection(oModelData.visualizationIndex, oModelData.sectionIndex);
                return;
            }

            var oDroppedModelData = _getModelDataFromVisualization(oDropped),
                iDropVizPosition = oDroppedModelData.visualizationIndex,
                iDropSectionPosition = oDroppedModelData.sectionIndex;

            if (oDragged.isA("sap.m.CustomTreeItem")) {
                var fnDragSessionCallback = oDropInfo.getParameter("dragSession").getComplexData("callback");
                if (sInsertPosition === "After") {
                    iDropVizPosition++;
                }
                fnDragSessionCallback(iDropVizPosition, iDropSectionPosition);
                return;
            }
            var oDraggedModelData = _getModelDataFromVisualization(oDragged),
                iDragVizPosition = oDraggedModelData.visualizationIndex,
                iDragSectionPosition = oDraggedModelData.sectionIndex;

            if (iDragSectionPosition === iDropSectionPosition) {
                if (sInsertPosition === "After") {
                    if (iDropVizPosition < iDragVizPosition) {
                        iDropVizPosition++;
                    }
                } else if (iDropVizPosition > iDragVizPosition) {
                    iDropVizPosition--;
                }
            } else if (sInsertPosition === "After") {
                iDropVizPosition++;
            }

            oMainController.moveVisualizationInSection(iDragVizPosition, iDropVizPosition, iDragSectionPosition, iDropSectionPosition);
        },

        /**
         * Adds a visualization to a section in the Page.
         *
         * @param {object} oDropInfo Drag and drop event data
         *
         * @private
         */
        addVisualization: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                iDropVizPosition = oDropped.getVisualizations().length,
                iDropSectionPosition = oPage.indexOfSection(oDropped);

            if (oDragged.isA("sap.m.CustomTreeItem")) {
                oDropInfo.getParameter("dragSession").getComplexData("callback")(iDropVizPosition, iDropSectionPosition);
                return;
            }

            var oDraggedModelData = _getModelDataFromVisualization(oDragged),
                iDragVizPosition = oDraggedModelData.visualizationIndex,
                iDragSectionPosition = oDraggedModelData.sectionIndex;

            oMainController.moveVisualizationInSection(iDragVizPosition, iDropVizPosition, iDragSectionPosition, iDropSectionPosition);
        }
    };
});
